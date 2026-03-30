import pool from './connection'
import type { DBCategory, DBFaqItem } from './types'

export async function queryCategories(): Promise<DBCategory[]> {
  const [rows] = await pool.execute<DBCategory[]>(
    `SELECT id, slug, name_th, name_en, description_th, description_en,
            intro_html_th, intro_html_en, seo_title_th, seo_title_en,
            seo_description_th, seo_description_en, image_url, image_alt_th, image_alt_en
     FROM categories WHERE is_published = 1
     ORDER BY sort_order ASC, id ASC`
  )
  return rows
}

export async function queryCategoryBySlug(slug: string): Promise<DBCategory | null> {
  const [rows] = await pool.execute<DBCategory[]>(
    `SELECT id, slug, name_th, name_en, description_th, description_en,
            intro_html_th, intro_html_en, seo_title_th, seo_title_en,
            seo_description_th, seo_description_en, image_url, image_alt_th, image_alt_en
     FROM categories WHERE slug = ? AND is_published = 1 LIMIT 1`,
    [slug]
  )
  return rows[0] ?? null
}

export async function queryAllCategorySlugs(): Promise<string[]> {
  const [rows] = await pool.execute<DBCategory[]>(
    `SELECT slug FROM categories WHERE is_published = 1
     ORDER BY sort_order ASC, id ASC`
  )
  return rows.map((r) => r.slug)
}

export async function queryFaqItemsByOwner(
  ownerType: 'category' | 'product',
  ownerIds: number[]
): Promise<DBFaqItem[]> {
  if (!ownerIds.length) return []
  const placeholders = ownerIds.map(() => '?').join(',')
  const [rows] = await pool.execute<DBFaqItem[]>(
    `SELECT id, owner_type, owner_id, question_th, question_en, answer_th, answer_en, sort_order
     FROM faq_items WHERE owner_type = ? AND owner_id IN (${placeholders})
     ORDER BY owner_id ASC, sort_order ASC`,
    [ownerType, ...ownerIds]
  )
  return rows
}
