import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const options = {
    mode: "dry-run",
    status: "draft",
    input: "",
    report: "",
    taxonomyMap: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--mode" && next) {
      options.mode = next;
      index += 1;
      continue;
    }

    if (arg === "--status" && next) {
      options.status = next;
      index += 1;
      continue;
    }

    if (arg === "--input" && next) {
      options.input = next;
      index += 1;
      continue;
    }

    if (arg === "--report" && next) {
      options.report = next;
      index += 1;
      continue;
    }

    if (arg === "--taxonomy-map" && next) {
      options.taxonomyMap = next;
      index += 1;
    }
  }

  return options;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalizeText(value) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function fileNameFromUrl(url) {
  try {
    const parsed = new URL(url);
    return path.basename(parsed.pathname);
  } catch {
    return "";
  }
}

function fileStemFromUrl(url) {
  const fileName = fileNameFromUrl(url);
  return fileName.replace(/\.[^.]+$/, "");
}

function buildContentBlocks(article) {
  return [
    {
      acf_fc_layout: "rich_text",
      body_th: normalizeText(article.content_th),
      body_en: normalizeText(article.content_en),
    },
  ];
}

function buildAcfPayload(article, mapping = {}) {
  const contentBlocks = buildContentBlocks(article);

  return {
    title_th: normalizeText(article.title_th),
    title_en: normalizeText(article.title_en),
    excerpt_th: normalizeText(article.excerpt_th),
    excerpt_en: normalizeText(article.excerpt_en),
    content_th: normalizeText(article.content_th),
    content_en: normalizeText(article.content_en),
    content_blocks: contentBlocks,
    image_alt_th: normalizeText(article.image_alt_th),
    image_alt_en: normalizeText(article.image_alt_en),
    seo_title_th: normalizeText(article.seo_title_th),
    seo_title_en: normalizeText(article.seo_title_en),
    meta_description_th: normalizeText(article.meta_description_th),
    meta_description_en: normalizeText(article.meta_description_en),
    canonical_url_th: normalizeText(article.canonical_url_th),
    canonical_url_en: normalizeText(article.canonical_url_en),
    focus_keyword: normalizeText(article.focus_keyword),
    focus_keyword_th: normalizeText(article.focus_keyword_th || article.focus_keyword),
    focus_keyword_en: normalizeText(article.focus_keyword_en || article.focus_keyword),
    author_name: normalizeText(mapping.author_name || "168 Innovative"),
    reading_time_minutes: Number(mapping.reading_time_minutes || 5),
    faq_items: Array.isArray(mapping.faq_items) ? mapping.faq_items : [],
    related_products: Array.isArray(mapping.related_products) ? mapping.related_products : [],
    related_articles: Array.isArray(mapping.related_articles) ? mapping.related_articles : [],
    primary_category:
      typeof mapping.primary_category === "number" ? mapping.primary_category : "",
    article_tags: Array.isArray(mapping.article_tags) ? mapping.article_tags : [],
    robots_index: mapping.robots_index ?? 1,
    robots_follow: mapping.robots_follow ?? 1,
  };
}

function buildWpPayload(article, mapping = {}, featuredMediaId) {
  const payload = {
    slug: article.slug,
    status: mapping.status || "draft",
    title:
      normalizeText(article.title_en) ||
      normalizeText(article.title_th) ||
      normalizeText(article.slug),
    excerpt:
      normalizeText(article.excerpt_en) || normalizeText(article.excerpt_th),
    content:
      normalizeText(article.content_en) || normalizeText(article.content_th),
    acf: buildAcfPayload(article, mapping),
  };

  if (typeof featuredMediaId === "number") {
    payload.featured_media = featuredMediaId;
  }

  if (Array.isArray(mapping.article_category) && mapping.article_category.length) {
    payload.article_category = mapping.article_category;
  }

  if (Array.isArray(mapping.article_tag) && mapping.article_tag.length) {
    payload.article_tag = mapping.article_tag;
  }

  return payload;
}

function authHeaders() {
  const username = process.env.WP_USERNAME;
  const password = process.env.WP_APP_PASSWORD;

  if (!username || !password) {
    throw new Error("WP_USERNAME and WP_APP_PASSWORD are required");
  }

  return {
    Authorization:
      "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
  };
}

async function fetchJson(url, init = {}) {
  const res = await fetch(url, init);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(
      `Request failed ${res.status} ${res.statusText} for ${url}\n${text}`
    );
  }

  return data;
}

async function findExistingArticle(baseUrl, slug) {
  const url = new URL("/wp-json/wp/v2/article", baseUrl);
  url.searchParams.set("slug", slug);
  url.searchParams.set("_fields", "id,slug,status");
  const items = await fetchJson(url.toString(), {
    headers: authHeaders(),
  });
  return Array.isArray(items) && items.length ? items[0] : null;
}

async function resolveFeaturedMediaId(baseUrl, imageUrl) {
  const stem = fileStemFromUrl(imageUrl);
  if (!stem) return null;

  const url = new URL("/wp-json/wp/v2/media", baseUrl);
  url.searchParams.set("search", stem);
  url.searchParams.set("per_page", "20");
  url.searchParams.set("_fields", "id,source_url,slug");

  const items = await fetchJson(url.toString(), {
    headers: authHeaders(),
  });

  if (!Array.isArray(items)) return null;

  const exact = items.find((item) => item.source_url === imageUrl);
  if (exact) return exact.id;

  const filename = fileNameFromUrl(imageUrl).toLowerCase();
  const partial = items.find((item) =>
    String(item.source_url || "").toLowerCase().includes(filename)
  );
  return partial?.id ?? null;
}

async function upsertArticle(baseUrl, article, mapping, status) {
  const existing = await findExistingArticle(baseUrl, article.slug);
  const featuredMediaId = article.featured_image
    ? await resolveFeaturedMediaId(baseUrl, article.featured_image)
    : null;
  const payload = buildWpPayload(
    article,
    { ...mapping, status },
    featuredMediaId
  );

  if (!existing) {
    const created = await fetchJson(`${baseUrl}/wp-json/wp/v2/article`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(payload),
    });

    return {
      action: "created",
      id: created.id,
      slug: article.slug,
      featuredMediaId,
    };
  }

  const updated = await fetchJson(`${baseUrl}/wp-json/wp/v2/article/${existing.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });

  return {
    action: "updated",
    id: updated.id,
    slug: article.slug,
    featuredMediaId,
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const inputPath =
    options.input || process.env.ARTICLE_IMPORT_JSON || "";

  if (!inputPath) {
    throw new Error(
      "Missing --input. Example: node docs/scripts/import-wordpress-articles.mjs --input \"C:\\path\\articles_wordpress_oem_updated.json\""
    );
  }

  const absoluteInputPath = path.resolve(inputPath);
  const source = readJson(absoluteInputPath);
  const articles = Array.isArray(source.articles) ? source.articles : [];
  const taxonomyMap = options.taxonomyMap
    ? readJson(path.resolve(options.taxonomyMap))
    : {};

  if (!articles.length) {
    throw new Error("No articles found in the source JSON");
  }

  const report = {
    generatedAt: new Date().toISOString(),
    mode: options.mode,
    status: options.status,
    input: absoluteInputPath,
    total: articles.length,
    items: [],
  };

  if (options.mode === "dry-run") {
    report.items = articles.map((article) => {
      const mapping = taxonomyMap[article.slug] ?? {};
      const payload = buildWpPayload(article, { ...mapping, status: options.status }, null);
      return {
        slug: article.slug,
        title: payload.title,
        status: payload.status,
        hasContentBlocks: Array.isArray(payload.acf?.content_blocks),
        contentBlockCount: payload.acf?.content_blocks?.length ?? 0,
        hasLegacyContentTh: Boolean(payload.acf?.content_th),
        hasLegacyContentEn: Boolean(payload.acf?.content_en),
        articleCategory: payload.article_category ?? [],
        articleTag: payload.article_tag ?? [],
      };
    });
  } else {
    const baseUrl = process.env.WP_API_URL;
    if (!baseUrl) {
      throw new Error("WP_API_URL is required for apply mode");
    }

    for (const article of articles) {
      const mapping = taxonomyMap[article.slug] ?? {};
      const result = await upsertArticle(baseUrl, article, mapping, options.status);
      report.items.push(result);
    }
  }

  if (options.report) {
    const reportPath = path.resolve(options.report);
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");
    console.log(`Wrote report: ${reportPath}`);
  } else {
    console.log(JSON.stringify(report, null, 2));
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
