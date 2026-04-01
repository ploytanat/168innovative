import {
  getMockAllArticleSlugs,
  getMockArticleBySlug,
  getMockArticles,
  getMockArticlesForSitemap,
} from "../mock/runtime"
import type { Locale } from "../types/content"
import type { ArticleView } from "../types/view"
import {
  getWordPressAllArticleSlugs,
  getWordPressArticleBySlug,
  getWordPressArticles,
  getWordPressArticlesForSitemap,
} from "./wordpress-source"
import { loadWithWordPressFallback } from "./wp"

export type ArticleSitemapView = Pick<
  ArticleView,
  "slug" | "canonicalUrl" | "publishedAt" | "updatedAt"
>

export async function getAllArticleSlugs() {
  return loadWithWordPressFallback(
    "article slugs",
    () => getWordPressAllArticleSlugs(),
    () => getMockAllArticleSlugs()
  )
}

export async function getArticles(locale: Locale) {
  return loadWithWordPressFallback(
    `articles (${locale})`,
    () => getWordPressArticles(locale),
    () => getMockArticles(locale)
  )
}

export async function getArticlesForSitemap(locale: Locale): Promise<ArticleSitemapView[]> {
  return loadWithWordPressFallback(
    `article sitemap (${locale})`,
    () => getWordPressArticlesForSitemap(locale),
    () => getMockArticlesForSitemap(locale)
  )
}

export async function getArticleBySlug(
  slug: string,
  locale: Locale
): Promise<ArticleView | null> {
  if (!slug) return null
  return loadWithWordPressFallback(
    `article ${slug} (${locale})`,
    () => getWordPressArticleBySlug(slug, locale),
    () => getMockArticleBySlug(slug, locale)
  )
}
