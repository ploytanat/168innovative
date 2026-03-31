from __future__ import annotations

import argparse
import html
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any


INSERT_RE = re.compile(r"INSERT INTO `(?P<table>[^`]+)` VALUES\s*(?P<values>.*?);\r?\n", re.S)
CREATE_TABLE_RE = re.compile(r"CREATE TABLE `(?P<table>[^`]+)`")


def split_rows(values: str) -> list[str]:
    rows: list[str] = []
    in_str = False
    escape = False
    depth = 0
    start: int | None = None

    for index, ch in enumerate(values):
        if in_str:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == "'":
                in_str = False
            continue

        if ch == "'":
            in_str = True
        elif ch == "(":
            if depth == 0:
                start = index + 1
            depth += 1
        elif ch == ")":
            depth -= 1
            if depth == 0 and start is not None:
                rows.append(values[start:index])
                start = None

    return rows


def split_columns(row: str) -> list[str]:
    columns: list[str] = []
    in_str = False
    escape = False
    start = 0

    for index, ch in enumerate(row):
        if in_str:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == "'":
                in_str = False
            continue

        if ch == "'":
            in_str = True
        elif ch == ",":
            columns.append(row[start:index].strip())
            start = index + 1

    columns.append(row[start:].strip())
    return columns


def unquote(value: str) -> Any:
    if value == "NULL":
        return None
    if value.startswith("'") and value.endswith("'"):
        decoded = value[1:-1]
        decoded = (
            decoded.replace("\\'", "'")
            .replace('\\"', '"')
            .replace("\\\\", "\\")
            .replace("\\r", "\r")
            .replace("\\n", "\n")
            .replace("\\t", "\t")
            .replace("\\0", "\x00")
        )
        return decoded
    return value


def sql_string(value: str) -> str:
    escaped = (
        value.replace("\\", "\\\\")
        .replace("'", "\\'")
        .replace("\r", "\\r")
        .replace("\n", "\\n")
        .replace("\x00", "\\0")
    )
    return f"'{escaped}'"


def sql_value(value: Any) -> str:
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "1" if value else "0"
    if isinstance(value, (int, float)):
        return str(value)
    return sql_string(str(value))


def title_case_label(value: str) -> str:
    return " ".join(part.capitalize() for part in re.split(r"[_\-\s]+", value) if part)


def guess_th_label(key: str) -> str:
    mapping = {
        "model": "รุ่น",
        "inner_diameter_mm": "เส้นผ่านศูนย์กลางด้านใน (มม.)",
        "outer_diameter_mm": "เส้นผ่านศูนย์กลางด้านนอก (มม.)",
        "diameter_mm": "เส้นผ่านศูนย์กลาง (มม.)",
        "width_mm": "ความกว้าง (มม.)",
        "height_mm": "ความสูง (มม.)",
        "length_mm": "ความยาว (มม.)",
        "capacity_ml": "ความจุ (มล.)",
        "material": "วัสดุ",
        "application": "การใช้งาน",
        "neck_size_mm": "ขนาดคอ (มม.)",
        "shape": "รูปทรง",
        "color": "สี",
    }
    return mapping.get(key, title_case_label(key))


def clean_multiline(value: str | None) -> str | None:
    if value is None:
        return None
    normalized = value.replace("\r\n", "\n").replace("\r", "\n").strip()
    return normalized or None


def first_non_empty(*values: Any) -> Any:
    for value in values:
        if value is None:
            continue
        if isinstance(value, str) and not value.strip():
            continue
        return value
    return None


def parse_php_int_list(value: str | None) -> list[int]:
    if not value or value == "a:0:{}":
        return []

    ints = [int(match) for match in re.findall(r"i:\d+;i:(\d+);", value)]
    if ints:
        return ints

    comma_sep = [item.strip() for item in value.split(",") if item.strip().isdigit()]
    return [int(item) for item in comma_sep]


def parse_specs_json(value: str | None) -> dict[str, Any]:
    if not value:
        return {}
    payload = value.replace('\\"', '"')
    try:
        data = json.loads(payload)
        return data if isinstance(data, dict) else {}
    except json.JSONDecodeError:
        return {}


def flatten_spec_value(value: Any) -> str | None:
    if value is None:
        return None
    if isinstance(value, list):
        return ", ".join(str(item) for item in value if item not in (None, ""))
    if isinstance(value, bool):
        return "Yes" if value else "No"
    return str(value)


def parse_faq_items(raw: str | None) -> list[tuple[str, str]]:
    if not raw or raw == "a:0:{}":
        return []

    decoded = html.unescape(raw).strip()
    if not decoded:
        return []

    pairs: list[tuple[str, str]] = []
    html_matches = re.findall(r"<h3>(.*?)</h3>\s*<p>(.*?)</p>", decoded, flags=re.I | re.S)
    if html_matches:
        for question, answer in html_matches:
            q = re.sub(r"<[^>]+>", "", question).strip()
            a = re.sub(r"<[^>]+>", "", answer).strip()
            if q and a:
                pairs.append((q, a))
        return pairs

    plain_matches = re.findall(
        r"Q\d+\s*TH:\s*(.*?)\s*A\d+\s*TH:\s*(.*?)(?=(?:\n\s*\n)?Q\d+\s*TH:|$)",
        decoded,
        flags=re.S,
    )
    if plain_matches:
        for question, answer in plain_matches:
            q = question.strip()
            a = answer.strip()
            if q and a:
                pairs.append((q, a))
        return pairs

    return []


@dataclass
class WPPost:
    id: int
    post_type: str
    post_status: str
    title: str
    content: str
    excerpt: str
    slug: str
    guid: str
    post_date: str
    post_modified: str
    menu_order: int


class DumpParser:
    def __init__(self, dump_path: Path) -> None:
        self.dump_path = dump_path
        self.text = dump_path.read_text(encoding="utf-8", errors="replace")
        self.prefix = self._detect_prefix()
        self.posts: dict[int, WPPost] = {}
        self.postmeta: dict[int, dict[str, str]] = {}
        self.terms: dict[int, dict[str, Any]] = {}
        self.term_taxonomy: dict[int, dict[str, Any]] = {}
        self.termmeta: dict[int, dict[str, str]] = {}
        self.relationships: list[tuple[int, int]] = []
        self.options: dict[str, str] = {}

    def _detect_prefix(self) -> str:
        table_names = [match.group("table") for match in CREATE_TABLE_RE.finditer(self.text)]
        candidate_prefixes = [table[: -len("_posts")] for table in table_names if table.endswith("_posts")]
        required_suffixes = [
            "_posts",
            "_postmeta",
            "_terms",
            "_term_taxonomy",
            "_termmeta",
            "_term_relationships",
            "_options",
        ]
        for prefix in sorted(candidate_prefixes, key=len):
            if all(f"{prefix}{suffix}" in table_names for suffix in required_suffixes):
                return prefix
        raise RuntimeError("Could not detect WordPress table prefix from dump.")

    def parse(self) -> None:
        tables = {
            f"{self.prefix}_posts": self._parse_posts,
            f"{self.prefix}_postmeta": self._parse_postmeta,
            f"{self.prefix}_terms": self._parse_terms,
            f"{self.prefix}_term_taxonomy": self._parse_term_taxonomy,
            f"{self.prefix}_termmeta": self._parse_termmeta,
            f"{self.prefix}_term_relationships": self._parse_term_relationships,
            f"{self.prefix}_options": self._parse_options,
        }

        for match in INSERT_RE.finditer(self.text):
            table = match.group("table")
            parser = tables.get(table)
            if not parser:
                continue
            parser(match.group("values"))

    def _parse_posts(self, values: str) -> None:
        for row in split_rows(values):
            cols = [unquote(value) for value in split_columns(row)]
            if len(cols) < 23:
                continue
            post = WPPost(
                id=int(cols[0]),
                post_type=str(cols[20]),
                post_status=str(cols[7]),
                title=str(cols[5] or ""),
                content=str(cols[4] or ""),
                excerpt=str(cols[6] or ""),
                slug=str(cols[11] or ""),
                guid=str(cols[18] or ""),
                post_date=str(cols[2] or ""),
                post_modified=str(cols[14] or ""),
                menu_order=int(cols[19] or 0),
            )
            self.posts[post.id] = post

    def _parse_postmeta(self, values: str) -> None:
        for row in split_rows(values):
            cols = [unquote(value) for value in split_columns(row)]
            if len(cols) < 4:
                continue
            post_id = int(cols[1])
            self.postmeta.setdefault(post_id, {})[str(cols[2])] = str(cols[3] or "")

    def _parse_terms(self, values: str) -> None:
        for row in split_rows(values):
            cols = [unquote(value) for value in split_columns(row)]
            if len(cols) < 3:
                continue
            self.terms[int(cols[0])] = {
                "term_id": int(cols[0]),
                "name": cols[1] or "",
                "slug": cols[2] or "",
            }

    def _parse_term_taxonomy(self, values: str) -> None:
        for row in split_rows(values):
            cols = [unquote(value) for value in split_columns(row)]
            if len(cols) < 6:
                continue
            self.term_taxonomy[int(cols[0])] = {
                "term_taxonomy_id": int(cols[0]),
                "term_id": int(cols[1]),
                "taxonomy": cols[2] or "",
                "description": cols[3] or "",
                "parent": int(cols[4] or 0),
                "count": int(cols[5] or 0),
            }

    def _parse_termmeta(self, values: str) -> None:
        for row in split_rows(values):
            cols = [unquote(value) for value in split_columns(row)]
            if len(cols) < 4:
                continue
            term_id = int(cols[1])
            self.termmeta.setdefault(term_id, {})[str(cols[2])] = str(cols[3] or "")

    def _parse_term_relationships(self, values: str) -> None:
        for row in split_rows(values):
            cols = [unquote(value) for value in split_columns(row)]
            if len(cols) < 3:
                continue
            self.relationships.append((int(cols[0]), int(cols[1])))

    def _parse_options(self, values: str) -> None:
        for row in split_rows(values):
            cols = [unquote(value) for value in split_columns(row)]
            if len(cols) < 3:
                continue
            self.options[str(cols[1])] = str(cols[2] or "")

    def get_posts(self, post_type: str) -> list[WPPost]:
        return [post for post in self.posts.values() if post.post_type == post_type]

    def get_postmeta(self, post_id: int) -> dict[str, str]:
        return self.postmeta.get(post_id, {})

    def resolve_attachment_url(self, value: str | None) -> str | None:
        if not value:
            return None
        if value.isdigit():
            post = self.posts.get(int(value))
            return post.guid if post and post.post_type == "attachment" else None
        if value.startswith("http://") or value.startswith("https://"):
            return value
        return None

    def get_term_relationships(self, object_id: int, taxonomy: str) -> list[dict[str, Any]]:
        matches: list[dict[str, Any]] = []
        for rel_object_id, term_taxonomy_id in self.relationships:
            if rel_object_id != object_id:
                continue
            record = self.term_taxonomy.get(term_taxonomy_id)
            if not record or record["taxonomy"] != taxonomy:
                continue
            term = self.terms.get(record["term_id"])
            if not term:
                continue
            matches.append(
                {
                    "term_taxonomy_id": term_taxonomy_id,
                    "term_id": record["term_id"],
                    "taxonomy": taxonomy,
                    "slug": term["slug"],
                    "name": term["name"],
                }
            )
        return matches


class InnovaDumpWriter:
    def __init__(self, parser: DumpParser) -> None:
        self.parser = parser
        self.inserts: list[str] = []
        self.counts: dict[str, int] = {}

    def append_rows(self, table: str, columns: list[str], rows: list[dict[str, Any]]) -> None:
        if not rows:
            return
        self.counts[table] = self.counts.get(table, 0) + len(rows)
        columns_sql = ", ".join(f"`{column}`" for column in columns)
        value_rows = []
        for row in rows:
            value_rows.append("(" + ", ".join(sql_value(row.get(column)) for column in columns) + ")")
        self.inserts.append(f"INSERT INTO `{table}` ({columns_sql}) VALUES\n  " + ",\n  ".join(value_rows) + ";\n")

    def build(self) -> str:
        parser = self.parser
        site_name = (parser.options.get("blogname") or "168 Innovative").replace(" CMS", "").strip()
        company_post = next((post for post in parser.get_posts("company") if post.post_status in {"publish", "draft", "private"}), None)
        company_meta = parser.get_postmeta(company_post.id) if company_post else {}
        about_post = next((post for post in parser.get_posts("about") if post.post_status in {"publish", "draft", "private"}), None)
        about_meta = parser.get_postmeta(about_post.id) if about_post else {}

        hero_rows: list[dict[str, Any]] = []
        for index, post in enumerate(sorted(parser.get_posts("hero_slide"), key=lambda item: (item.menu_order, item.id)), start=1):
            meta = parser.get_postmeta(post.id)
            image_url = parser.resolve_attachment_url(meta.get("_thumbnail_id"))
            subtitle_th = clean_multiline(meta.get("subtitle_th"))
            subtitle_en = clean_multiline(meta.get("subtitle_en"))
            hero_rows.append(
                {
                    "id": post.id,
                    "theme": "rose" if index % 2 else "sky",
                    "badge_variant": "featured",
                    "badge_text_th": first_non_empty(subtitle_th, meta.get("title_th"), post.title),
                    "badge_text_en": first_non_empty(subtitle_en, meta.get("title_en"), post.title),
                    "title_th": first_non_empty(meta.get("title_th"), post.title),
                    "title_en": first_non_empty(meta.get("title_en"), post.title),
                    "description_th": clean_multiline(meta.get("description_th")),
                    "description_en": clean_multiline(meta.get("description_en")),
                    "image_url": image_url,
                    "image_alt_th": first_non_empty(meta.get("title_th"), post.title),
                    "image_alt_en": first_non_empty(meta.get("title_en"), post.title),
                    "cta_primary_label_th": first_non_empty(meta.get("cta_primary_text_th"), "ดูสินค้า"),
                    "cta_primary_label_en": first_non_empty(meta.get("cta_primary_text_en"), "View Products"),
                    "cta_primary_href": first_non_empty(meta.get("cta_primary_link"), "/categories"),
                    "cta_secondary_label_th": meta.get("cta_secondary_text_th") or None,
                    "cta_secondary_label_en": meta.get("cta_secondary_text_en") or None,
                    "cta_secondary_href": meta.get("cta_secondary_link") or None,
                    "highlight_value": None,
                    "highlight_label_th": None,
                    "highlight_label_en": None,
                    "visual_title_th": first_non_empty(meta.get("title_th"), post.title),
                    "visual_title_en": first_non_empty(meta.get("title_en"), post.title),
                    "visual_subtitle_th": subtitle_th,
                    "visual_subtitle_en": subtitle_en,
                    "sort_order": index,
                    "is_published": 1 if post.post_status == "publish" else 0,
                }
            )

        why_rows: list[dict[str, Any]] = []
        for post in sorted(parser.get_posts("why"), key=lambda item: int(parser.get_postmeta(item.id).get("order") or item.menu_order or item.id)):
            meta = parser.get_postmeta(post.id)
            why_rows.append(
                {
                    "id": post.id,
                    "page_key": "home",
                    "section_key": "why",
                    "icon_name": None,
                    "image_url": parser.resolve_attachment_url(meta.get("image")),
                    "image_alt_th": first_non_empty(meta.get("title_th"), post.title),
                    "image_alt_en": first_non_empty(meta.get("title_en"), post.title),
                    "title_th": first_non_empty(meta.get("title_th"), post.title),
                    "title_en": first_non_empty(meta.get("title_en"), post.title),
                    "description_th": clean_multiline(meta.get("description_th")),
                    "description_en": clean_multiline(meta.get("description_en")),
                    "sort_order": int(meta.get("order") or post.menu_order or post.id),
                    "is_published": 1 if post.post_status == "publish" else 0,
                }
            )

        categories: list[dict[str, Any]] = []
        category_page_seo: list[dict[str, Any]] = []
        category_faq_rows: list[dict[str, Any]] = []
        for _, taxonomy in sorted(parser.term_taxonomy.items()):
            if taxonomy["taxonomy"] != "product_category":
                continue
            term_id = taxonomy["term_id"]
            term = parser.terms[term_id]
            meta = parser.termmeta.get(term_id, {})
            image_url = parser.resolve_attachment_url(meta.get("image")) or parser.resolve_attachment_url(meta.get("og_image"))
            categories.append(
                {
                    "id": term_id,
                    "slug": term["slug"],
                    "name_th": first_non_empty(meta.get("name_th"), term["name"]),
                    "name_en": meta.get("name_en") or None,
                    "description_th": clean_multiline(meta.get("description_th")),
                    "description_en": clean_multiline(meta.get("description_en")),
                    "intro_html_th": clean_multiline(meta.get("intro_html_th")),
                    "intro_html_en": clean_multiline(meta.get("intro_html_en")),
                    "seo_title_th": meta.get("seo_title_th") or None,
                    "seo_title_en": meta.get("seo_title_en") or None,
                    "seo_description_th": clean_multiline(meta.get("seo_description_th")),
                    "seo_description_en": clean_multiline(meta.get("seo_description_en")),
                    "image_url": image_url,
                    "image_alt_th": first_non_empty(meta.get("image_alt_th"), meta.get("name_th"), term["name"]),
                    "image_alt_en": first_non_empty(meta.get("image_alt_en"), meta.get("name_en")),
                    "sort_order": term_id,
                    "is_published": 1,
                }
            )
            category_page_seo.append(
                {
                    "page_key": f"category:{term['slug']}",
                    "title_th": meta.get("seo_title_th") or None,
                    "title_en": meta.get("seo_title_en") or None,
                    "description_th": clean_multiline(meta.get("seo_description_th")),
                    "description_en": clean_multiline(meta.get("seo_description_en")),
                    "canonical_path_th": meta.get("canonical_url_th") or None,
                    "canonical_path_en": meta.get("canonical_url_en") or None,
                    "og_image_url": parser.resolve_attachment_url(meta.get("og_image")) or image_url,
                    "og_image_alt_th": meta.get("image_alt_th") or None,
                    "og_image_alt_en": meta.get("image_alt_en") or None,
                    "robots_index": int(meta.get("robots_index") or 1),
                    "robots_follow": int(meta.get("robots_follow") or 1),
                }
            )
            for faq_index, (question, answer) in enumerate(parse_faq_items(meta.get("faq_items")), start=1):
                category_faq_rows.append(
                    {
                        "owner_type": "category",
                        "owner_id": term_id,
                        "owner_key": None,
                        "question_th": question,
                        "question_en": None,
                        "answer_th": answer,
                        "answer_en": None,
                        "sort_order": faq_index,
                        "is_published": 1,
                    }
                )

        products: list[dict[str, Any]] = []
        product_specs: list[dict[str, Any]] = []
        product_media: list[dict[str, Any]] = []
        product_page_seo: list[dict[str, Any]] = []
        uncategorized_category_id = 999999
        orphan_product_found = False
        for post in sorted(parser.get_posts("product"), key=lambda item: item.id):
            if post.post_status in {"trash", "auto-draft"}:
                continue
            meta = parser.get_postmeta(post.id)
            category_relations = parser.get_term_relationships(post.id, "product_category")
            if not category_relations:
                orphan_product_found = True
                category_id = uncategorized_category_id
            else:
                category_id = category_relations[0]["term_id"]
            primary_image_url = (
                parser.resolve_attachment_url(meta.get("_thumbnail_id"))
                or parser.resolve_attachment_url(meta.get("og_image"))
                or parser.resolve_attachment_url(meta.get("image"))
            )
            products.append(
                {
                    "id": post.id,
                    "category_id": category_id,
                    "slug": post.slug,
                    "name_th": first_non_empty(meta.get("name_th"), post.title),
                    "name_en": meta.get("name_en") or None,
                    "family_name_th": meta.get("brand_name") or None,
                    "family_name_en": meta.get("brand_name") or None,
                    "description_th": clean_multiline(meta.get("description_th")),
                    "description_en": clean_multiline(meta.get("description_en")),
                    "content_th": clean_multiline(meta.get("content_th")),
                    "content_en": clean_multiline(meta.get("content_en")),
                    "application_th": clean_multiline(meta.get("application_th")),
                    "application_en": clean_multiline(meta.get("application_en")),
                    "seo_title_th": meta.get("seo_title_th") or None,
                    "seo_title_en": meta.get("seo_title_en") or None,
                    "seo_description_th": clean_multiline(meta.get("seo_description_th")),
                    "seo_description_en": clean_multiline(meta.get("seo_description_en")),
                    "image_url": primary_image_url,
                    "image_alt_th": first_non_empty(meta.get("image_alt_th"), meta.get("name_th"), post.title),
                    "image_alt_en": first_non_empty(meta.get("image_alt_en"), meta.get("name_en")),
                    "sku": meta.get("sku") or None,
                    "availability_status": meta.get("availability_status") or None,
                    "moq": meta.get("moq") or None,
                    "lead_time": meta.get("lead_time_days") or None,
                    "default_variant_slug": None,
                    "sort_order": post.id,
                    "is_published": 1 if post.post_status == "publish" else 0,
                }
            )
            seo_image = parser.resolve_attachment_url(meta.get("og_image")) or primary_image_url
            product_page_seo.append(
                {
                    "page_key": f"product:{post.slug}",
                    "title_th": meta.get("seo_title_th") or None,
                    "title_en": meta.get("seo_title_en") or None,
                    "description_th": clean_multiline(meta.get("seo_description_th")),
                    "description_en": clean_multiline(meta.get("seo_description_en")),
                    "canonical_path_th": meta.get("canonical_url_th") or None,
                    "canonical_path_en": meta.get("canonical_url_en") or None,
                    "og_image_url": seo_image,
                    "og_image_alt_th": meta.get("image_alt_th") or None,
                    "og_image_alt_en": meta.get("image_alt_en") or None,
                    "robots_index": int(meta.get("robots_index") or 1),
                    "robots_follow": int(meta.get("robots_follow") or 1),
                }
            )
            if primary_image_url:
                product_media.append(
                    {
                        "product_id": post.id,
                        "variant_id": None,
                        "url": primary_image_url,
                        "alt_th": first_non_empty(meta.get("image_alt_th"), meta.get("name_th"), post.title),
                        "alt_en": first_non_empty(meta.get("image_alt_en"), meta.get("name_en")),
                        "sort_order": 1,
                        "is_primary": 1,
                    }
                )
            secondary_image_url = parser.resolve_attachment_url(meta.get("og_image"))
            if secondary_image_url and secondary_image_url != primary_image_url:
                product_media.append(
                    {
                        "product_id": post.id,
                        "variant_id": None,
                        "url": secondary_image_url,
                        "alt_th": first_non_empty(meta.get("image_alt_th"), meta.get("name_th"), post.title),
                        "alt_en": first_non_empty(meta.get("image_alt_en"), meta.get("name_en")),
                        "sort_order": 2,
                        "is_primary": 0,
                    }
                )
            specs_data = parse_specs_json(meta.get("specs_json"))
            spec_order = 1
            for spec_key, raw_value in specs_data.items():
                spec_value = flatten_spec_value(raw_value)
                if not spec_value:
                    continue
                product_specs.append(
                    {
                        "product_id": post.id,
                        "variant_id": None,
                        "spec_key": spec_key,
                        "label_th": guess_th_label(spec_key),
                        "label_en": title_case_label(spec_key),
                        "value_th": spec_value,
                        "value_en": spec_value,
                        "sort_order": spec_order,
                    }
                )
                spec_order += 1

        if orphan_product_found:
            categories.append(
                {
                    "id": uncategorized_category_id,
                    "slug": "uncategorized-migrated",
                    "name_th": "สินค้ารอจัดหมวด",
                    "name_en": "Uncategorized Migrated Products",
                    "description_th": "หมวดชั่วคราวสำหรับสินค้าที่มีอยู่ใน WordPress dump แต่ยังไม่ได้ผูก product_category",
                    "description_en": "Temporary category for products found in the WordPress dump without a mapped product_category relation.",
                    "intro_html_th": None,
                    "intro_html_en": None,
                    "seo_title_th": None,
                    "seo_title_en": None,
                    "seo_description_th": None,
                    "seo_description_en": None,
                    "image_url": None,
                    "image_alt_th": None,
                    "image_alt_en": None,
                    "sort_order": uncategorized_category_id,
                    "is_published": 1,
                }
            )

        articles: list[dict[str, Any]] = []
        article_page_seo: list[dict[str, Any]] = []
        article_blocks: list[dict[str, Any]] = []
        article_tag_terms: list[dict[str, Any]] = []
        article_category_terms: list[dict[str, Any]] = []
        article_tag_relations: list[dict[str, Any]] = []
        article_category_relations: list[dict[str, Any]] = []

        for _, taxonomy in sorted(parser.term_taxonomy.items()):
            term = parser.terms.get(taxonomy["term_id"])
            if not term:
                continue
            if taxonomy["taxonomy"] == "article_tag":
                article_tag_terms.append(
                    {
                        "id": taxonomy["term_id"],
                        "slug": term["slug"],
                        "name": term["name"],
                        "name_th": term["name"],
                        "name_en": term["name"],
                        "sort_order": taxonomy["term_id"],
                    }
                )
            elif taxonomy["taxonomy"] == "category":
                article_category_terms.append(
                    {
                        "id": taxonomy["term_id"],
                        "slug": term["slug"],
                        "name": term["name"],
                        "name_th": term["name"],
                        "name_en": term["name"],
                        "sort_order": taxonomy["term_id"],
                    }
                )

        for post in sorted(parser.get_posts("article"), key=lambda item: item.id):
            if post.post_status == "auto-draft":
                continue
            meta = parser.get_postmeta(post.id)
            cover_image_url = (
                parser.resolve_attachment_url(meta.get("image"))
                or parser.resolve_attachment_url(meta.get("_thumbnail_id"))
                or parser.resolve_attachment_url(meta.get("og_image"))
            )
            articles.append(
                {
                    "id": post.id,
                    "slug": post.slug or f"article-{post.id}",
                    "title_th": first_non_empty(meta.get("title_th"), post.title),
                    "title_en": meta.get("title_en") or None,
                    "excerpt_th": clean_multiline(meta.get("excerpt_th")),
                    "excerpt_en": clean_multiline(meta.get("excerpt_en")),
                    "content_th": clean_multiline(meta.get("content_th")),
                    "content_en": clean_multiline(meta.get("content_en")),
                    "seo_title_th": meta.get("seo_title_th") or None,
                    "seo_title_en": meta.get("seo_title_en") or None,
                    "seo_description_th": clean_multiline(meta.get("meta_description_th")),
                    "seo_description_en": clean_multiline(meta.get("meta_description_en")),
                    "canonical_url_th": meta.get("canonical_url_th") or None,
                    "canonical_url_en": meta.get("canonical_url_en") or None,
                    "author_name": meta.get("author_name") or None,
                    "cover_image_url": cover_image_url,
                    "cover_image_alt_th": first_non_empty(meta.get("image_alt_th"), meta.get("title_th"), post.title),
                    "cover_image_alt_en": first_non_empty(meta.get("image_alt_en"), meta.get("title_en")),
                    "focus_keyword_th": meta.get("focus_keyword_th") or None,
                    "focus_keyword_en": meta.get("focus_keyword_en") or None,
                    "reading_time_minutes": int(meta["reading_time_minutes"]) if meta.get("reading_time_minutes", "").isdigit() else None,
                    "published_at": first_non_empty(meta.get("published_at"), post.post_date),
                    "updated_at": first_non_empty(meta.get("updated_at"), post.post_modified),
                    "is_published": 1 if post.post_status == "publish" else 0,
                }
            )
            article_page_seo.append(
                {
                    "page_key": f"article:{post.slug or post.id}",
                    "title_th": meta.get("seo_title_th") or None,
                    "title_en": meta.get("seo_title_en") or None,
                    "description_th": clean_multiline(meta.get("meta_description_th")),
                    "description_en": clean_multiline(meta.get("meta_description_en")),
                    "canonical_path_th": meta.get("canonical_url_th") or None,
                    "canonical_path_en": meta.get("canonical_url_en") or None,
                    "og_image_url": parser.resolve_attachment_url(meta.get("og_image")) or cover_image_url,
                    "og_image_alt_th": meta.get("image_alt_th") or None,
                    "og_image_alt_en": meta.get("image_alt_en") or None,
                    "robots_index": int(meta.get("robots_index") or 1),
                    "robots_follow": int(meta.get("robots_follow") or 1),
                }
            )
            if clean_multiline(meta.get("content_th")) or clean_multiline(meta.get("content_en")):
                article_blocks.append(
                    {
                        "id": post.id * 10 + 1,
                        "article_id": post.id,
                        "block_type": "rich_text",
                        "anchor_id": None,
                        "eyebrow_th": None,
                        "eyebrow_en": None,
                        "heading_th": None,
                        "heading_en": None,
                        "body_th": clean_multiline(meta.get("content_th")),
                        "body_en": clean_multiline(meta.get("content_en")),
                        "intro_th": None,
                        "intro_en": None,
                        "style_variant": None,
                        "left_label_th": None,
                        "left_label_en": None,
                        "right_label_th": None,
                        "right_label_en": None,
                        "button_label_th": None,
                        "button_label_en": None,
                        "button_url": None,
                        "sort_order": 1,
                    }
                )
            primary_category_id = meta.get("primary_category")
            if primary_category_id and primary_category_id.isdigit():
                article_category_relations.append({"article_id": post.id, "category_id": int(primary_category_id)})
            for tag_id in parse_php_int_list(meta.get("article_tags")):
                article_tag_relations.append({"article_id": post.id, "tag_id": tag_id})

        social_urls: dict[str, str] = {}
        for index in range(1, 4):
            social_type = company_meta.get(f"social_{index}_type")
            social_url = company_meta.get(f"social_{index}_url")
            if social_type and social_url:
                social_urls[social_type] = social_url

        site_settings_rows = [
            {
                "id": 1,
                "site_name_th": site_name,
                "site_name_en": site_name,
                "site_title_suffix_th": None,
                "site_title_suffix_en": None,
                "default_meta_title_th": site_name,
                "default_meta_title_en": site_name,
                "default_meta_description_th": clean_multiline(about_meta.get("seo_description_th")),
                "default_meta_description_en": clean_multiline(about_meta.get("seo_description_en")),
                "default_og_image_url": parser.resolve_attachment_url(company_meta.get("logo")) or parser.resolve_attachment_url(about_meta.get("og_image")),
                "default_og_image_alt_th": site_name,
                "default_og_image_alt_en": site_name,
                "favicon_url": parser.resolve_attachment_url(company_meta.get("logo")),
                "default_locale": "th",
                "timezone_name": "Asia/Bangkok",
                "line_official_url": social_urls.get("line"),
                "facebook_url": social_urls.get("facebook"),
                "instagram_url": social_urls.get("instagram"),
                "shopee_url": social_urls.get("shopee"),
            }
        ]

        company_rows: list[dict[str, Any]] = []
        company_contact_rows: list[dict[str, Any]] = []
        company_gallery_rows: list[dict[str, Any]] = []
        about_rows: list[dict[str, Any]] = []
        page_seo_rows: list[dict[str, Any]] = []

        if company_post:
            company_rows.append(
                {
                    "id": company_post.id,
                    "legal_name_th": first_non_empty(company_meta.get("name_th"), site_name),
                    "legal_name_en": company_meta.get("name_en") or site_name,
                    "display_name_th": site_name,
                    "display_name_en": site_name,
                    "tagline_th": clean_multiline(about_meta.get("hero_title_th")),
                    "tagline_en": clean_multiline(about_meta.get("hero_title_en")),
                    "address_th": clean_multiline(company_meta.get("address_th")),
                    "address_en": clean_multiline(company_meta.get("address_en")),
                    "tax_id": None,
                    "map_url": None,
                    "map_embed_url": None,
                    "business_hours_th": None,
                    "business_hours_en": None,
                    "logo_url": parser.resolve_attachment_url(company_meta.get("logo")),
                    "logo_alt_th": site_name,
                    "logo_alt_en": site_name,
                    "line_qr_url": parser.resolve_attachment_url(company_meta.get("line_qr")),
                    "line_qr_alt_th": "LINE QR",
                    "line_qr_alt_en": "LINE QR",
                    "contact_image_url": parser.resolve_attachment_url(company_meta.get("contact_image")),
                    "contact_image_alt_th": site_name,
                    "contact_image_alt_en": site_name,
                    "is_published": 1 if company_post.post_status == "publish" else 0,
                }
            )

            sort_order = 1
            for index in range(1, 5):
                number = company_meta.get(f"phone_{index}_number")
                if not number:
                    continue
                company_contact_rows.append(
                    {
                        "company_id": company_post.id,
                        "contact_type": "phone",
                        "label_th": company_meta.get(f"phone_{index}_label_th") or None,
                        "label_en": company_meta.get(f"phone_{index}_label_en") or None,
                        "person_name_th": company_meta.get(f"phone_{index}_label_th") or None,
                        "person_name_en": company_meta.get(f"phone_{index}_label_en") or None,
                        "department_th": None,
                        "department_en": None,
                        "value": number,
                        "url": f"tel:{re.sub(r'[^0-9+]', '', number)}",
                        "icon_url": None,
                        "icon_alt": None,
                        "sort_order": sort_order,
                        "is_primary": 1 if index == 1 else 0,
                        "is_published": 1,
                    }
                )
                sort_order += 1

            for key in ["email_1", "email_2", "email_3"]:
                email_value = company_meta.get(key)
                if not email_value:
                    continue
                company_contact_rows.append(
                    {
                        "company_id": company_post.id,
                        "contact_type": "email",
                        "label_th": "อีเมล",
                        "label_en": "Email",
                        "person_name_th": None,
                        "person_name_en": None,
                        "department_th": None,
                        "department_en": None,
                        "value": email_value,
                        "url": f"mailto:{email_value}",
                        "icon_url": None,
                        "icon_alt": None,
                        "sort_order": sort_order,
                        "is_primary": 0,
                        "is_published": 1,
                    }
                )
                sort_order += 1

            for index in range(1, 4):
                social_type = company_meta.get(f"social_{index}_type")
                social_url = company_meta.get(f"social_{index}_url")
                if not social_type or not social_url:
                    continue
                company_contact_rows.append(
                    {
                        "company_id": company_post.id,
                        "contact_type": social_type if social_type in {"line", "facebook", "instagram", "shopee"} else "other",
                        "label_th": social_type.upper(),
                        "label_en": social_type.upper(),
                        "person_name_th": None,
                        "person_name_en": None,
                        "department_th": None,
                        "department_en": None,
                        "value": social_url,
                        "url": social_url,
                        "icon_url": parser.resolve_attachment_url(company_meta.get(f"social_{index}_icon")),
                        "icon_alt": social_type,
                        "sort_order": sort_order,
                        "is_primary": 0,
                        "is_published": 1,
                    }
                )
                sort_order += 1

            for index in range(1, 5):
                image_url = parser.resolve_attachment_url(company_meta.get(f"contact_image_{index}"))
                if not image_url:
                    continue
                company_gallery_rows.append(
                    {
                        "company_id": company_post.id,
                        "image_url": image_url,
                        "alt_th": company_meta.get(f"contact_image_{index}_alt_th") or None,
                        "alt_en": company_meta.get(f"contact_image_{index}_alt_en") or None,
                        "sort_order": index,
                        "is_published": 1,
                    }
                )

        if about_post:
            page_seo_rows.append(
                {
                    "page_key": "about",
                    "title_th": about_meta.get("seo_title_th") or None,
                    "title_en": about_meta.get("seo_title_en") or None,
                    "description_th": clean_multiline(about_meta.get("seo_description_th")),
                    "description_en": clean_multiline(about_meta.get("seo_description_en")),
                    "canonical_path_th": about_meta.get("canonical_url_th") or None,
                    "canonical_path_en": about_meta.get("canonical_url_en") or None,
                    "og_image_url": parser.resolve_attachment_url(about_meta.get("og_image")),
                    "og_image_alt_th": about_meta.get("hero_image_1_alt_th") or site_name,
                    "og_image_alt_en": about_meta.get("hero_image_1_alt_en") or site_name,
                    "robots_index": int(about_meta.get("robots_index") or 1),
                    "robots_follow": int(about_meta.get("robots_follow") or 1),
                }
            )
            about_rows.extend(
                [
                    {
                        "id": 1,
                        "section_key": "hero",
                        "eyebrow_th": None,
                        "eyebrow_en": None,
                        "title_th": first_non_empty(about_meta.get("hero_title_th"), about_post.title),
                        "title_en": about_meta.get("hero_title_en") or None,
                        "description_th": clean_multiline(about_meta.get("hero_description_th")),
                        "description_en": clean_multiline(about_meta.get("hero_description_en")),
                        "image_primary_url": parser.resolve_attachment_url(about_meta.get("hero_image_1")),
                        "image_primary_alt_th": about_meta.get("hero_image_1_alt_th") or None,
                        "image_primary_alt_en": about_meta.get("hero_image_1_alt_en") or None,
                        "image_secondary_url": parser.resolve_attachment_url(about_meta.get("hero_image_2")),
                        "image_secondary_alt_th": about_meta.get("hero_image_2_alt_th") or None,
                        "image_secondary_alt_en": about_meta.get("hero_image_2_alt_en") or None,
                        "sort_order": 1,
                        "is_published": 1 if about_post.post_status == "publish" else 0,
                    },
                    {
                        "id": 2,
                        "section_key": "who-we-are",
                        "eyebrow_th": None,
                        "eyebrow_en": None,
                        "title_th": first_non_empty(about_meta.get("who_title_th"), "พวกเราคือใคร"),
                        "title_en": about_meta.get("who_title_en") or None,
                        "description_th": clean_multiline(about_meta.get("who_description_th")),
                        "description_en": clean_multiline(about_meta.get("who_description_en")),
                        "image_primary_url": parser.resolve_attachment_url(about_meta.get("who_image")),
                        "image_primary_alt_th": about_meta.get("who_image_alt_th") or None,
                        "image_primary_alt_en": about_meta.get("who_image_alt_en") or None,
                        "image_secondary_url": None,
                        "image_secondary_alt_th": None,
                        "image_secondary_alt_en": None,
                        "sort_order": 2,
                        "is_published": 1 if about_post.post_status == "publish" else 0,
                    },
                ]
            )

        page_seo_rows.extend(category_page_seo)
        page_seo_rows.extend(product_page_seo)
        page_seo_rows.extend(article_page_seo)

        lines = [
            "-- ============================================================",
            "-- innova_core data migration generated from WordPress dump",
            f"-- Source dump : {parser.dump_path}",
            f"-- WP prefix   : {parser.prefix}",
            "-- Generated  : by scripts/wp_dump_to_innova_core.py",
            "-- ============================================================",
            "",
            "USE innova_core;",
            "SET NAMES utf8mb4;",
            "",
            "SET FOREIGN_KEY_CHECKS = 0;",
            "TRUNCATE TABLE article_block_comparison_rows;",
            "TRUNCATE TABLE article_block_checklist_items;",
            "TRUNCATE TABLE article_blocks;",
            "TRUNCATE TABLE article_tag_relations;",
            "TRUNCATE TABLE article_category_relations;",
            "TRUNCATE TABLE article_tags;",
            "TRUNCATE TABLE article_categories;",
            "TRUNCATE TABLE faq_items;",
            "TRUNCATE TABLE product_media;",
            "TRUNCATE TABLE product_specs;",
            "TRUNCATE TABLE product_variant_options;",
            "TRUNCATE TABLE product_variants;",
            "TRUNCATE TABLE products;",
            "TRUNCATE TABLE categories;",
            "TRUNCATE TABLE about_sections;",
            "TRUNCATE TABLE why_items;",
            "TRUNCATE TABLE testimonials;",
            "TRUNCATE TABLE home_process_steps;",
            "TRUNCATE TABLE home_featured_product_slots;",
            "TRUNCATE TABLE home_ticker_items;",
            "TRUNCATE TABLE home_hero_slide_chips;",
            "TRUNCATE TABLE home_hero_slide_stats;",
            "TRUNCATE TABLE home_hero_slides;",
            "TRUNCATE TABLE company_gallery_images;",
            "TRUNCATE TABLE company_contact_methods;",
            "TRUNCATE TABLE company_profiles;",
            "TRUNCATE TABLE footer_links;",
            "TRUNCATE TABLE footer_link_groups;",
            "TRUNCATE TABLE site_navigation_items;",
            "TRUNCATE TABLE page_section_headers;",
            "TRUNCATE TABLE page_seo;",
            "TRUNCATE TABLE site_settings;",
            "SET FOREIGN_KEY_CHECKS = 1;",
            "",
        ]

        self.append_rows("site_settings", ["id", "site_name_th", "site_name_en", "site_title_suffix_th", "site_title_suffix_en", "default_meta_title_th", "default_meta_title_en", "default_meta_description_th", "default_meta_description_en", "default_og_image_url", "default_og_image_alt_th", "default_og_image_alt_en", "favicon_url", "default_locale", "timezone_name", "line_official_url", "facebook_url", "instagram_url", "shopee_url"], site_settings_rows)
        self.append_rows("page_seo", ["page_key", "title_th", "title_en", "description_th", "description_en", "canonical_path_th", "canonical_path_en", "og_image_url", "og_image_alt_th", "og_image_alt_en", "robots_index", "robots_follow"], page_seo_rows)
        self.append_rows("company_profiles", ["id", "legal_name_th", "legal_name_en", "display_name_th", "display_name_en", "tagline_th", "tagline_en", "address_th", "address_en", "tax_id", "map_url", "map_embed_url", "business_hours_th", "business_hours_en", "logo_url", "logo_alt_th", "logo_alt_en", "line_qr_url", "line_qr_alt_th", "line_qr_alt_en", "contact_image_url", "contact_image_alt_th", "contact_image_alt_en", "is_published"], company_rows)
        self.append_rows("company_contact_methods", ["company_id", "contact_type", "label_th", "label_en", "person_name_th", "person_name_en", "department_th", "department_en", "value", "url", "icon_url", "icon_alt", "sort_order", "is_primary", "is_published"], company_contact_rows)
        self.append_rows("company_gallery_images", ["company_id", "image_url", "alt_th", "alt_en", "sort_order", "is_published"], company_gallery_rows)
        self.append_rows("home_hero_slides", ["id", "theme", "badge_variant", "badge_text_th", "badge_text_en", "title_th", "title_en", "description_th", "description_en", "image_url", "image_alt_th", "image_alt_en", "cta_primary_label_th", "cta_primary_label_en", "cta_primary_href", "cta_secondary_label_th", "cta_secondary_label_en", "cta_secondary_href", "highlight_value", "highlight_label_th", "highlight_label_en", "visual_title_th", "visual_title_en", "visual_subtitle_th", "visual_subtitle_en", "sort_order", "is_published"], hero_rows)
        self.append_rows("why_items", ["id", "page_key", "section_key", "icon_name", "image_url", "image_alt_th", "image_alt_en", "title_th", "title_en", "description_th", "description_en", "sort_order", "is_published"], why_rows)
        self.append_rows("about_sections", ["id", "section_key", "eyebrow_th", "eyebrow_en", "title_th", "title_en", "description_th", "description_en", "image_primary_url", "image_primary_alt_th", "image_primary_alt_en", "image_secondary_url", "image_secondary_alt_th", "image_secondary_alt_en", "sort_order", "is_published"], about_rows)
        self.append_rows("categories", ["id", "slug", "name_th", "name_en", "description_th", "description_en", "intro_html_th", "intro_html_en", "seo_title_th", "seo_title_en", "seo_description_th", "seo_description_en", "image_url", "image_alt_th", "image_alt_en", "sort_order", "is_published"], categories)
        self.append_rows("products", ["id", "category_id", "slug", "name_th", "name_en", "family_name_th", "family_name_en", "description_th", "description_en", "content_th", "content_en", "application_th", "application_en", "seo_title_th", "seo_title_en", "seo_description_th", "seo_description_en", "image_url", "image_alt_th", "image_alt_en", "sku", "availability_status", "moq", "lead_time", "default_variant_slug", "sort_order", "is_published"], products)
        self.append_rows("product_specs", ["product_id", "variant_id", "spec_key", "label_th", "label_en", "value_th", "value_en", "sort_order"], product_specs)
        self.append_rows("product_media", ["product_id", "variant_id", "url", "alt_th", "alt_en", "sort_order", "is_primary"], product_media)
        self.append_rows("faq_items", ["owner_type", "owner_id", "owner_key", "question_th", "question_en", "answer_th", "answer_en", "sort_order", "is_published"], category_faq_rows)
        self.append_rows("articles", ["id", "slug", "title_th", "title_en", "excerpt_th", "excerpt_en", "content_th", "content_en", "seo_title_th", "seo_title_en", "seo_description_th", "seo_description_en", "canonical_url_th", "canonical_url_en", "author_name", "cover_image_url", "cover_image_alt_th", "cover_image_alt_en", "focus_keyword_th", "focus_keyword_en", "reading_time_minutes", "published_at", "updated_at", "is_published"], articles)
        self.append_rows("article_categories", ["id", "slug", "name", "name_th", "name_en", "sort_order"], article_category_terms)
        self.append_rows("article_tags", ["id", "slug", "name", "name_th", "name_en", "sort_order"], article_tag_terms)
        self.append_rows("article_category_relations", ["article_id", "category_id"], article_category_relations)
        self.append_rows("article_tag_relations", ["article_id", "tag_id"], article_tag_relations)
        self.append_rows("article_blocks", ["id", "article_id", "block_type", "anchor_id", "eyebrow_th", "eyebrow_en", "heading_th", "heading_en", "body_th", "body_en", "intro_th", "intro_en", "style_variant", "left_label_th", "left_label_en", "right_label_th", "right_label_en", "button_label_th", "button_label_en", "button_url", "sort_order"], article_blocks)

        lines.extend(self.inserts)
        lines.append("-- Summary")
        for table, count in sorted(self.counts.items()):
            lines.append(f"-- {table}: {count} rows")
        lines.append("")
        return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert a WordPress SQL dump into innova_core data SQL.")
    parser.add_argument("source", type=Path, help="Path to the WordPress SQL dump file")
    parser.add_argument("output", type=Path, help="Path to write the generated innova_core data SQL")
    args = parser.parse_args()

    dump_parser = DumpParser(args.source)
    dump_parser.parse()

    writer = InnovaDumpWriter(dump_parser)
    sql = writer.build()

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(sql, encoding="utf-8")

    print(f"Generated: {args.output}")
    for table, count in sorted(writer.counts.items()):
        print(f"{table}: {count}")


if __name__ == "__main__":
    main()
