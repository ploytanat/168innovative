// app/lib/api/articles.ts — MariaDB backend

import { unstable_cache } from 'next/cache'
import { normalizeRichText, pickLocalizedText } from './acf'
import {
  getMockAllArticleSlugs,
  getMockArticleBySlug,
  getMockArticles,
  getMockArticlesForSitemap,
  isMockModeEnabled,
} from '../mock/runtime'
import {
  queryArticles,
  queryArticleBySlug,
  queryAllArticleSlugs,
  queryArticleTagsByArticleIds,
  queryArticleCategoryByArticleIds,
} from '../db/articles'
import type { Locale } from '../types/content'
import type { ArticleView } from '../types/view'
import type { DBArticle, DBArticleTag, DBArticleCategory } from '../db/types'

/* ─────────────────────────────
   Mapper
───────────────────────────── */

function mapDbArticleToView(
  article: DBArticle,
  tags: DBArticleTag[],
  categories: DBArticleCategory[],
  locale: Locale
): ArticleView {
  const articleTags = tags
    .filter((t) => t.article_id === article.id)
    .map((t) => ({ id: t.tag_id, slug: t.tag_slug, name: t.tag_name }))

  const category =
    categories.find((c) => c.article_id === article.id)?.category_name ?? undefined

  const coverImage = article.cover_image_url
    ? {
        src: article.cover_image_url,
        alt: pickLocalizedText(
          locale,
          article.cover_image_alt_th,
          article.cover_image_alt_en
        ),
      }
    : undefined

  return {
    id: String(article.id),
    slug: article.slug,
    title: pickLocalizedText(locale, article.title_th, article.title_en, article.title_th),
    excerpt: pickLocalizedText(locale, article.excerpt_th, article.excerpt_en) ?? '',
    content:
      normalizeRichText(locale === 'th' ? article.content_th : article.content_en) ?? '',
    blocks: [],
    authorName: article.author_name ?? undefined,
    coverImage,
    category,
    tags: articleTags,
    publishedAt: article.published_at?.toISOString() ?? new Date().toISOString(),
    updatedAt:
      article.updated_at?.toISOString() ??
      article.published_at?.toISOString() ??
      new Date().toISOString(),
    seoTitle: pickLocalizedText(locale, article.seo_title_th, article.seo_title_en) || undefined,
    metaDescription:
      pickLocalizedText(locale, article.seo_description_th, article.seo_description_en) || undefined,
    canonicalUrl:
      pickLocalizedText(locale, article.canonical_url_th, article.canonical_url_en) || undefined,
    focusKeyword:
      pickLocalizedText(locale, article.focus_keyword_th, article.focus_keyword_en) || undefined,
    readingTimeMinutes: article.reading_time_minutes ?? undefined,
    faqItems: [],
  }
}

export type ArticleSitemapView = Pick<
  ArticleView,
  'slug' | 'canonicalUrl' | 'publishedAt' | 'updatedAt'
>

/* ─────────────────────────────
   Public API
───────────────────────────── */

export function getAllArticleSlugs(): Promise<string[]> {
  if (isMockModeEnabled()) {
    return Promise.resolve(getMockAllArticleSlugs())
  }

  return unstable_cache(
    async () => queryAllArticleSlugs(),
    ['article-slugs-db-v1'],
    { revalidate: 300, tags: ['articles'] }
  )()
}

export async function getArticles(locale: Locale): Promise<ArticleView[]> {
  if (isMockModeEnabled()) return getMockArticles(locale)

  return unstable_cache(
    async () => {
      const articles = await queryArticles()
      const ids = articles.map((a) => a.id)
      const [tags, categories] = await Promise.all([
        queryArticleTagsByArticleIds(ids),
        queryArticleCategoryByArticleIds(ids),
      ])
      return articles.map((a) => mapDbArticleToView(a, tags, categories, locale))
    },
    [`articles-db-${locale}-v1`],
    { revalidate: 300, tags: ['articles'] }
  )()
}

export async function getArticlesForSitemap(locale: Locale): Promise<ArticleSitemapView[]> {
  if (isMockModeEnabled()) return getMockArticlesForSitemap(locale)

  return unstable_cache(
    async () => {
      const articles = await queryArticles()
      return articles.map((a) => ({
        slug: a.slug,
        canonicalUrl:
          pickLocalizedText(locale, a.canonical_url_th, a.canonical_url_en) || undefined,
        publishedAt: a.published_at?.toISOString() ?? new Date().toISOString(),
        updatedAt:
          a.updated_at?.toISOString() ??
          a.published_at?.toISOString() ??
          new Date().toISOString(),
      }))
    },
    [`articles-sitemap-db-${locale}-v1`],
    { revalidate: 300, tags: ['articles'] }
  )()
}

export async function getArticleBySlug(
  slug: string,
  locale: Locale
): Promise<ArticleView | null> {
  if (!slug) return null
  if (isMockModeEnabled()) return getMockArticleBySlug(slug, locale)

  return unstable_cache(
    async () => {
      const article = await queryArticleBySlug(slug)
      if (!article) return null
      const [tags, categories] = await Promise.all([
        queryArticleTagsByArticleIds([article.id]),
        queryArticleCategoryByArticleIds([article.id]),
      ])
      return mapDbArticleToView(article, tags, categories, locale)
    },
    [`article-db-${slug}-${locale}-v1`],
    { revalidate: 300, tags: ['articles'] }
  )()
}
