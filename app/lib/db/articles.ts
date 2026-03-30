import pool from './connection'
import type { DBArticle, DBArticleTag, DBArticleCategory } from './types'

export async function queryArticles(): Promise<DBArticle[]> {
  const [rows] = await pool.execute<DBArticle[]>(
    `SELECT id, slug, title_th, title_en, excerpt_th, excerpt_en,
            content_th, content_en, seo_title_th, seo_title_en,
            seo_description_th, seo_description_en, canonical_url_th, canonical_url_en,
            published_at, updated_at, author_name, cover_image_url,
            cover_image_alt_th, cover_image_alt_en,
            focus_keyword_th, focus_keyword_en, reading_time_minutes
     FROM articles WHERE is_published = 1
     ORDER BY published_at DESC, id DESC`
  )
  return rows
}

export async function queryArticleBySlug(slug: string): Promise<DBArticle | null> {
  const [rows] = await pool.execute<DBArticle[]>(
    `SELECT id, slug, title_th, title_en, excerpt_th, excerpt_en,
            content_th, content_en, seo_title_th, seo_title_en,
            seo_description_th, seo_description_en, canonical_url_th, canonical_url_en,
            published_at, updated_at, author_name, cover_image_url,
            cover_image_alt_th, cover_image_alt_en,
            focus_keyword_th, focus_keyword_en, reading_time_minutes
     FROM articles WHERE slug = ? AND is_published = 1 LIMIT 1`,
    [slug]
  )
  return rows[0] ?? null
}

export async function queryAllArticleSlugs(): Promise<string[]> {
  const [rows] = await pool.execute<Array<{ slug: string } & import('mysql2').RowDataPacket>>(
    `SELECT slug FROM articles WHERE is_published = 1
     ORDER BY published_at DESC, id DESC`
  )
  return rows.map((r) => r.slug)
}

export async function queryArticleTagsByArticleIds(
  articleIds: number[]
): Promise<DBArticleTag[]> {
  if (!articleIds.length) return []
  const placeholders = articleIds.map(() => '?').join(',')
  const [rows] = await pool.execute<DBArticleTag[]>(
    `SELECT atr.article_id, t.id AS tag_id, t.slug AS tag_slug, t.name AS tag_name
     FROM article_tag_relations atr
     JOIN article_tags t ON atr.tag_id = t.id
     WHERE atr.article_id IN (${placeholders})
     ORDER BY atr.article_id ASC`,
    articleIds
  )
  return rows
}

export async function queryArticleCategoryByArticleIds(
  articleIds: number[]
): Promise<DBArticleCategory[]> {
  if (!articleIds.length) return []
  const placeholders = articleIds.map(() => '?').join(',')
  const [rows] = await pool.execute<DBArticleCategory[]>(
    `SELECT acr.article_id, ac.name AS category_name
     FROM article_category_relations acr
     JOIN article_categories ac ON acr.category_id = ac.id
     WHERE acr.article_id IN (${placeholders})`,
    articleIds
  )
  return rows
}
