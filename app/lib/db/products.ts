import pool from './connection'
import type {
  DBProduct,
  DBProductVariant,
  DBVariantOption,
  DBProductSpec,
  DBProductMedia,
} from './types'

const PRODUCT_SELECT = `
  p.id, p.slug, p.category_id, c.slug AS category_slug,
  p.name_th, p.name_en, p.family_name_th, p.family_name_en,
  p.description_th, p.description_en, p.content_th, p.content_en,
  p.application_th, p.application_en, p.seo_title_th, p.seo_title_en,
  p.seo_description_th, p.seo_description_en,
  p.image_url, p.image_alt_th, p.image_alt_en,
  p.sku, p.availability_status, p.moq, p.lead_time, p.default_variant_slug
`

export async function queryAllProducts(): Promise<DBProduct[]> {
  const [rows] = await pool.execute<DBProduct[]>(
    `SELECT ${PRODUCT_SELECT}
     FROM products p
     JOIN categories c ON p.category_id = c.id
     WHERE p.is_published = 1
     ORDER BY p.sort_order ASC, p.id ASC`
  )
  return rows
}

export async function queryProductsByCategoryId(
  categoryId: number,
  page: number,
  perPage: number
): Promise<{ data: DBProduct[]; totalCount: number }> {
  const offset = (page - 1) * perPage
  const [[{ total }]] = await pool.execute<Array<{ total: number } & import('mysql2').RowDataPacket>>(
    `SELECT COUNT(*) AS total FROM products WHERE category_id = ? AND is_published = 1`,
    [categoryId]
  )
  const [rows] = await pool.execute<DBProduct[]>(
    `SELECT ${PRODUCT_SELECT}
     FROM products p
     JOIN categories c ON p.category_id = c.id
     WHERE p.category_id = ? AND p.is_published = 1
     ORDER BY p.sort_order ASC, p.id ASC
     LIMIT ? OFFSET ?`,
    [categoryId, perPage, offset]
  )
  return { data: rows, totalCount: total }
}

export async function queryAllProductsByCategoryId(
  categoryId: number
): Promise<DBProduct[]> {
  const [rows] = await pool.execute<DBProduct[]>(
    `SELECT ${PRODUCT_SELECT}
     FROM products p
     JOIN categories c ON p.category_id = c.id
     WHERE p.category_id = ? AND p.is_published = 1
     ORDER BY p.sort_order ASC, p.id ASC`,
    [categoryId]
  )
  return rows
}

export async function queryProductBySlug(slug: string): Promise<DBProduct | null> {
  const [rows] = await pool.execute<DBProduct[]>(
    `SELECT ${PRODUCT_SELECT}
     FROM products p
     JOIN categories c ON p.category_id = c.id
     WHERE p.slug = ? AND p.is_published = 1 LIMIT 1`,
    [slug]
  )
  return rows[0] ?? null
}

export async function queryRelatedProducts(
  categoryId: number,
  excludeSlug: string,
  limit = 5
): Promise<DBProduct[]> {
  const [rows] = await pool.execute<DBProduct[]>(
    `SELECT ${PRODUCT_SELECT}
     FROM products p
     JOIN categories c ON p.category_id = c.id
     WHERE p.category_id = ? AND p.slug != ? AND p.is_published = 1
     ORDER BY p.sort_order ASC, p.id ASC
     LIMIT ?`,
    [categoryId, excludeSlug, limit]
  )
  return rows
}

export async function queryVariantsByProductIds(
  productIds: number[]
): Promise<DBProductVariant[]> {
  if (!productIds.length) return []
  const placeholders = productIds.map(() => '?').join(',')
  const [rows] = await pool.execute<DBProductVariant[]>(
    `SELECT id, product_id, slug, sku, label_th, label_en, description_th, description_en,
            image_url, availability_status, moq, lead_time, is_default, sort_order
     FROM product_variants WHERE product_id IN (${placeholders}) AND is_published = 1
     ORDER BY product_id ASC, sort_order ASC`,
    productIds
  )
  return rows
}

export async function queryOptionsByVariantIds(
  variantIds: number[]
): Promise<DBVariantOption[]> {
  if (!variantIds.length) return []
  const placeholders = variantIds.map(() => '?').join(',')
  const [rows] = await pool.execute<DBVariantOption[]>(
    `SELECT id, variant_id, group_key, group_label_th, group_label_en,
            value_key, value_th, value_en, sort_order
     FROM product_variant_options WHERE variant_id IN (${placeholders})
     ORDER BY variant_id ASC, sort_order ASC`,
    variantIds
  )
  return rows
}

export async function querySpecsByProductIds(
  productIds: number[]
): Promise<DBProductSpec[]> {
  if (!productIds.length) return []
  const placeholders = productIds.map(() => '?').join(',')
  const [rows] = await pool.execute<DBProductSpec[]>(
    `SELECT id, product_id, variant_id, spec_key, label_th, label_en, value_th, value_en, sort_order
     FROM product_specs WHERE product_id IN (${placeholders})
     ORDER BY product_id ASC, sort_order ASC`,
    productIds
  )
  return rows
}

export async function queryMediaByProductIds(
  productIds: number[]
): Promise<DBProductMedia[]> {
  if (!productIds.length) return []
  const placeholders = productIds.map(() => '?').join(',')
  const [rows] = await pool.execute<DBProductMedia[]>(
    `SELECT id, product_id, variant_id, url, alt_th, alt_en, sort_order, is_primary
     FROM product_media WHERE product_id IN (${placeholders})
     ORDER BY product_id ASC, is_primary DESC, sort_order ASC`,
    productIds
  )
  return rows
}

export async function queryCategoryIdBySlug(slug: string): Promise<number | null> {
  const [rows] = await pool.execute<Array<{ id: number } & import('mysql2').RowDataPacket>>(
    `SELECT id FROM categories WHERE slug = ? AND is_published = 1 LIMIT 1`,
    [slug]
  )
  return rows[0]?.id ?? null
}
