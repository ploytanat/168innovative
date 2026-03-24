import { mapFaqItems, normalizeRichText, pickLocalizedText } from "./acf"
import {
  Locale,
  WPArticle,
  WPArticleBlockComparisonRow,
  WPArticleContentBlock,
  WPFeaturedMedia,
} from "../types/content"
import {
  ArticleBlockView,
  ArticleChecklistBlockView,
  ArticleComparisonRowView,
  ArticleView,
} from "../types/view"

const WP_URL = process.env.WP_API_URL

if (!WP_URL) {
  throw new Error("WP_API_URL is not defined")
}

const fetchConfig: RequestInit = {
  next: { revalidate: 120 },
  headers: { "Content-Type": "application/json" },
}

function mapWPImage(
  media: WPFeaturedMedia | undefined,
  altTh?: string,
  altEn?: string,
  locale?: Locale
) {
  if (!media?.source_url) return undefined
  return {
    src: media.source_url,
    alt:
      locale === "th"
        ? altTh ?? media.alt_text ?? ""
        : altEn ?? media.alt_text ?? "",
  }
}

function pickArticleBlockText(
  locale: Locale,
  thValue: unknown,
  enValue: unknown
) {
  return pickLocalizedText(locale, thValue, enValue)
}

function mapComparisonRows(
  rows: WPArticleBlockComparisonRow[] | undefined,
  locale: Locale
): ArticleComparisonRowView[] {
  if (!Array.isArray(rows)) return []

  return rows
    .map((row) => ({
      criterion: pickArticleBlockText(locale, row.criterion_th, row.criterion_en),
      leftValue: pickArticleBlockText(locale, row.left_value_th, row.left_value_en),
      rightValue: pickArticleBlockText(locale, row.right_value_th, row.right_value_en),
    }))
    .filter((row) => row.criterion || row.leftValue || row.rightValue)
}

function mapArticleBlock(
  block: WPArticleContentBlock,
  locale: Locale
): ArticleBlockView | null {
  const layout = block.acf_fc_layout

  if (layout === "rich_text") {
    const body = normalizeRichText(
      locale === "th" ? block.body_th : block.body_en
    )

    if (!body) return null

    return {
      type: "rich_text",
      anchorId: pickArticleBlockText(locale, block.anchor_id, block.anchor_id),
      eyebrow: pickArticleBlockText(locale, block.eyebrow_th, block.eyebrow_en),
      heading: pickArticleBlockText(locale, block.heading_th, block.heading_en),
      body,
    }
  }

  if (layout === "checklist") {
    const items = (block.items ?? [])
      .map((item) => pickArticleBlockText(locale, item.item_th, item.item_en))
      .filter(Boolean)
    const heading = pickArticleBlockText(locale, block.heading_th, block.heading_en)

    if (!heading && items.length === 0) return null

    const mapped: ArticleChecklistBlockView = {
      type: "checklist",
      anchorId: pickArticleBlockText(locale, block.anchor_id, block.anchor_id),
      heading,
      intro: pickArticleBlockText(locale, block.intro_th, block.intro_en),
      items,
    }

    return mapped
  }

  if (layout === "callout") {
    const body = normalizeRichText(
      locale === "th" ? block.body_th : block.body_en
    )
    if (!body) return null

    return {
      type: "callout",
      style:
        block.style === "info" ||
        block.style === "success" ||
        block.style === "warning" ||
        block.style === "note"
          ? block.style
          : "info",
      heading: pickArticleBlockText(locale, block.heading_th, block.heading_en),
      body,
    }
  }

  if (layout === "comparison_table") {
    const heading = pickArticleBlockText(locale, block.heading_th, block.heading_en)
    const leftLabel = pickArticleBlockText(
      locale,
      block.left_label_th,
      block.left_label_en
    )
    const rightLabel = pickArticleBlockText(
      locale,
      block.right_label_th,
      block.right_label_en
    )
    const rows = mapComparisonRows(block.rows, locale)

    if (!heading && rows.length === 0) return null

    return {
      type: "comparison_table",
      heading,
      leftLabel,
      rightLabel,
      rows,
    }
  }

  if (layout === "cta") {
    const heading = pickArticleBlockText(locale, block.heading_th, block.heading_en)
    const buttonLabel = pickArticleBlockText(
      locale,
      block.button_label_th,
      block.button_label_en
    )

    if (!heading && !buttonLabel) return null

    return {
      type: "cta",
      style:
        block.style === "dark" ||
        block.style === "accent" ||
        block.style === "soft"
          ? block.style
          : "dark",
      heading,
      body: pickArticleBlockText(locale, block.body_th, block.body_en),
      buttonLabel,
      buttonUrl: block.button_url,
    }
  }

  return null
}

function mapArticleBlocks(
  blocks: WPArticleContentBlock[] | undefined,
  locale: Locale
): ArticleBlockView[] {
  if (!Array.isArray(blocks)) return []
  return blocks
    .map((block) => mapArticleBlock(block, locale))
    .filter((block): block is ArticleBlockView => block !== null)
}

function mapWPArticleToView(wp: WPArticle, locale: Locale): ArticleView {
  const acf = wp.acf ?? {}
  const featured = wp._embedded?.["wp:featuredmedia"]?.[0]
  const terms = wp._embedded?.["wp:term"]?.flat() ?? []
  const blocks = mapArticleBlocks(acf.content_blocks, locale)

  const tags = terms
    .filter((t) => t.taxonomy === "article_tag")
    .map((t) => ({ id: t.id, slug: t.slug, name: t.name }))

  const category =
    terms.find((t) => t.taxonomy === "article_category")?.name ?? undefined

  return {
    id: String(wp.id),
    slug: wp.slug,

    title: locale === "th" ? acf.title_th ?? "" : acf.title_en ?? "",
    excerpt: locale === "th" ? acf.excerpt_th ?? "" : acf.excerpt_en ?? "",
    content:
      normalizeRichText(locale === "th" ? acf.content_th : acf.content_en) ?? "",
    blocks,
    authorName: typeof acf.author_name === "string" ? acf.author_name.trim() : undefined,

    coverImage: mapWPImage(featured, acf.image_alt_th, acf.image_alt_en, locale),

    category,
    tags,
    publishedAt: acf.published_at || wp.date,
    updatedAt: acf.updated_at || wp.modified || acf.published_at || wp.date,

    // ── Fields ใหม่ ──
    seoTitle: locale === "th" ? acf.seo_title_th : acf.seo_title_en,
    metaDescription:
      locale === "th" ? acf.meta_description_th : acf.meta_description_en,
    canonicalUrl:
      locale === "th" ? acf.canonical_url_th : acf.canonical_url_en,
    focusKeyword: pickLocalizedText(
      locale,
      acf.focus_keyword_th ?? acf.focus_keyword,
      acf.focus_keyword_en ?? acf.focus_keyword
    ),
    readingTimeMinutes: acf.reading_time_minutes,
    faqItems: mapFaqItems(acf.faq_items, locale),
  }
}

async function fetchArticlesFromWP(
  params: Record<string, string>
): Promise<WPArticle[]> {
  try {
    const url = new URL("/wp-json/wp/v2/article", WP_URL)
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.set(key, value)
    )
    const res = await fetch(url.toString(), fetchConfig)
    if (!res.ok) {
      console.error("WP article fetch failed:", res.status, url.toString())
      return []
    }
    return res.json()
  } catch (error) {
    console.error("WP article fetch failed:", error)
    return []
  }
}

export async function getArticles(locale: Locale): Promise<ArticleView[]> {
  const data = await fetchArticlesFromWP({
    _embed: "1",
    per_page: "100",
    orderby: "date",
    order: "desc",
  })
  return data.map((a) => mapWPArticleToView(a, locale))
}


/**
 * Get Single Article by Slug
 */
export async function getArticleBySlug(
  slug: string,
  locale: Locale
): Promise<ArticleView | null> {

  if (!slug) return null

  const data = await fetchArticlesFromWP({
    slug,
    _embed: "1",
  })

  if (!data.length) return null

  return mapWPArticleToView(data[0], locale)
}
