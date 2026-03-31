import {
  getMockAllArticleSlugs,
  getMockArticleBySlug,
  getMockArticles,
  getMockArticlesForSitemap,
} from "../mock/runtime"
import type { Locale } from "../types/content"
import type { ArticleView } from "../types/view"

export type ArticleSitemapView = Pick<
  ArticleView,
  "slug" | "canonicalUrl" | "publishedAt" | "updatedAt"
>

export async function getAllArticleSlugs() {
  return getMockAllArticleSlugs()
}

export async function getArticles(locale: Locale) {
  return getMockArticles(locale)
}

export async function getArticlesForSitemap(locale: Locale): Promise<ArticleSitemapView[]> {
  return getMockArticlesForSitemap(locale)
}

export async function getArticleBySlug(
  slug: string,
  locale: Locale
): Promise<ArticleView | null> {
  if (!slug) return null
  return getMockArticleBySlug(slug, locale)
}
