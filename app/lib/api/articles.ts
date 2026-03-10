import { mapFaqItems, pickLocalizedText } from "./acf"
import { Locale, WPArticle } from "../types/content"
import { ArticleView } from "../types/view"

const WP_URL = process.env.WP_API_URL

if (!WP_URL) {
  throw new Error("WP_API_URL is not defined")
}

const fetchConfig: RequestInit = {
  next: { revalidate: 120 },
  headers: { "Content-Type": "application/json" },
}

function mapWPImage(
  media: any | undefined,
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

function mapWPArticleToView(wp: WPArticle, locale: Locale): ArticleView {
  const acf = wp.acf ?? {}
  const featured = wp._embedded?.["wp:featuredmedia"]?.[0]
  const terms = wp._embedded?.["wp:term"]?.flat() ?? []

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
    content: locale === "th" ? acf.content_th ?? "" : acf.content_en ?? "",

    coverImage: mapWPImage(featured, acf.image_alt_th, acf.image_alt_en, locale),

    category,
    tags,
    publishedAt: wp.date,

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
  const url = new URL("/wp-json/wp/v2/article", WP_URL)
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value)
  )
  const res = await fetch(url.toString(), fetchConfig)
  if (!res.ok) {
    console.error("WP fetch failed:", res.status)
    return []
  }
  return res.json()
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
