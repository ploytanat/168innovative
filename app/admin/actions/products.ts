'use server'

import pool from '@/app/lib/db/connection'
import { revalidatePath } from 'next/cache'

function revalidateAll() {
  revalidatePath('/admin/products')
  revalidatePath('/(th)', 'layout')
  revalidatePath('/(en)', 'layout')
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function getProducts(search = '', categoryId = '') {
  try {
    let sql = `
      SELECT p.*, c.name_th as category_name,
        (SELECT COUNT(*) FROM product_variants WHERE product_id = p.id) as variant_count
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE 1=1
    `
    const params: (string | number | null)[] = []
    if (search) { sql += ' AND (p.name_th LIKE ? OR p.name_en LIKE ? OR p.sku LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`) }
    if (categoryId) { sql += ' AND p.category_id = ?'; params.push(categoryId) }
    sql += ' ORDER BY p.sort_order ASC, p.id DESC'
    const [rows] = await pool.execute(sql, params)
    return rows as Record<string, unknown>[]
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function getProduct(id: number) {
  try {
    const [[product]] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]) as [Record<string, unknown>[], unknown]
    if (!product) return null
    const [variants] = await pool.execute('SELECT * FROM product_variants WHERE product_id = ? ORDER BY sort_order ASC', [id]) as [Record<string, unknown>[], unknown]
    const [specs] = await pool.execute('SELECT * FROM product_specs WHERE product_id = ? AND variant_id IS NULL ORDER BY sort_order ASC', [id]) as [Record<string, unknown>[], unknown]
    const [media] = await pool.execute('SELECT * FROM product_media WHERE product_id = ? AND variant_id IS NULL ORDER BY sort_order ASC', [id]) as [Record<string, unknown>[], unknown]
    const [faqs] = await pool.execute("SELECT * FROM faq_items WHERE owner_type = 'product' AND owner_id = ? ORDER BY sort_order ASC", [id]) as [Record<string, unknown>[], unknown]

    // Load variant options and specs for each variant
    const enrichedVariants = await Promise.all(
      (variants as Record<string, unknown>[]).map(async (v) => {
        const [options] = await pool.execute('SELECT * FROM product_variant_options WHERE variant_id = ? ORDER BY sort_order ASC', [Number(v.id)]) as [Record<string, unknown>[], unknown]
        const [vspecs] = await pool.execute('SELECT * FROM product_specs WHERE variant_id = ? ORDER BY sort_order ASC', [Number(v.id)]) as [Record<string, unknown>[], unknown]
        return { ...v, options, specs: vspecs }
      })
    )

    return { ...product, variants: enrichedVariants, specs, media, faqs }
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function createProduct(formData: FormData) {
  try {
    const fields = [
      'category_id','slug','name_th','name_en','family_name_th','family_name_en',
      'description_th','description_en','content_th','content_en',
      'application_th','application_en','seo_title_th','seo_title_en',
      'seo_description_th','seo_description_en','image_url','image_alt_th','image_alt_en',
      'sku','availability_status','moq','lead_time','default_variant_slug','sort_order','is_published'
    ]
    const values = fields.map(f => formData.get(f) ?? null)
    const placeholders = fields.map(() => '?').join(', ')
    const cols = fields.join(', ')
    const [result] = await pool.execute(`INSERT INTO products (${cols}) VALUES (${placeholders})`, values) as [{ insertId: number }, unknown]
    revalidateAll()
    return { success: true, id: result.insertId }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

export async function updateProduct(id: number, formData: FormData) {
  try {
    const fields = [
      'category_id','slug','name_th','name_en','family_name_th','family_name_en',
      'description_th','description_en','content_th','content_en',
      'application_th','application_en','seo_title_th','seo_title_en',
      'seo_description_th','seo_description_en','image_url','image_alt_th','image_alt_en',
      'sku','availability_status','moq','lead_time','default_variant_slug','sort_order','is_published'
    ]
    const set = fields.map(f => `${f} = ?`).join(', ')
    const values = [...fields.map(f => formData.get(f) ?? null), id]
    await pool.execute(`UPDATE products SET ${set} WHERE id = ?`, values)
    revalidateAll()
    revalidatePath(`/admin/products/${id}`)
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

export async function deleteProduct(id: number) {
  try {
    await pool.execute('DELETE FROM products WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

export async function updateProductSortOrder(id: number, sortOrder: number) {
  try {
    await pool.execute('UPDATE products SET sort_order = ? WHERE id = ?', [sortOrder, id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

export async function toggleProductPublished(id: number, published: boolean) {
  try {
    await pool.execute('UPDATE products SET is_published = ? WHERE id = ?', [published ? 1 : 0, id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

// ── Variants ──────────────────────────────────────────────────────────────────

export async function upsertVariant(productId: number, variantId: number | null, formData: FormData) {
  try {
    const fields = ['slug','sku','label_th','label_en','description_th','description_en','image_url','availability_status','moq','lead_time','is_default','sort_order','is_published']
    const values = fields.map(f => formData.get(f) ?? null)
    if (variantId) {
      const set = fields.map(f => `${f} = ?`).join(', ')
      await pool.execute(`UPDATE product_variants SET ${set} WHERE id = ? AND product_id = ?`, [...values, variantId, productId])
    } else {
      const cols = ['product_id', ...fields].join(', ')
      const ph = ['?', ...fields.map(() => '?')].join(', ')
      await pool.execute(`INSERT INTO product_variants (${cols}) VALUES (${ph})`, [productId, ...values])
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

export async function deleteVariant(id: number) {
  try {
    await pool.execute('DELETE FROM product_variants WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

// ── Specs ─────────────────────────────────────────────────────────────────────

export async function upsertSpec(specId: number | null, data: { product_id?: number; variant_id?: number; spec_key: string; label_th: string; label_en: string; value_th: string; value_en: string; sort_order: number }) {
  try {
    if (specId) {
      await pool.execute('UPDATE product_specs SET spec_key=?, label_th=?, label_en=?, value_th=?, value_en=?, sort_order=? WHERE id=?',
        [data.spec_key, data.label_th, data.label_en, data.value_th, data.value_en, data.sort_order, specId])
    } else {
      await pool.execute('INSERT INTO product_specs (product_id, variant_id, spec_key, label_th, label_en, value_th, value_en, sort_order) VALUES (?,?,?,?,?,?,?,?)',
        [data.product_id ?? null, data.variant_id ?? null, data.spec_key, data.label_th, data.label_en, data.value_th, data.value_en, data.sort_order])
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

export async function deleteSpec(id: number) {
  try {
    await pool.execute('DELETE FROM product_specs WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

// ── Media ─────────────────────────────────────────────────────────────────────

export async function upsertMedia(mediaId: number | null, data: { product_id?: number; variant_id?: number; url: string; alt_th: string; alt_en: string; sort_order: number; is_primary: boolean }) {
  try {
    if (mediaId) {
      await pool.execute('UPDATE product_media SET url=?, alt_th=?, alt_en=?, sort_order=?, is_primary=? WHERE id=?',
        [data.url, data.alt_th, data.alt_en, data.sort_order, data.is_primary ? 1 : 0, mediaId])
    } else {
      await pool.execute('INSERT INTO product_media (product_id, variant_id, url, alt_th, alt_en, sort_order, is_primary) VALUES (?,?,?,?,?,?,?)',
        [data.product_id ?? null, data.variant_id ?? null, data.url, data.alt_th, data.alt_en, data.sort_order, data.is_primary ? 1 : 0])
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

export async function deleteMedia(id: number) {
  try {
    await pool.execute('DELETE FROM product_media WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

// ── FAQs ──────────────────────────────────────────────────────────────────────

export async function upsertProductFaq(faqId: number | null, ownerId: number, data: { question_th: string; question_en: string; answer_th: string; answer_en: string; sort_order: number; is_published: boolean }) {
  try {
    if (faqId) {
      await pool.execute('UPDATE faq_items SET question_th=?, question_en=?, answer_th=?, answer_en=?, sort_order=?, is_published=? WHERE id=?',
        [data.question_th, data.question_en, data.answer_th, data.answer_en, data.sort_order, data.is_published ? 1 : 0, faqId])
    } else {
      await pool.execute("INSERT INTO faq_items (owner_type, owner_id, question_th, question_en, answer_th, answer_en, sort_order, is_published) VALUES ('product',?,?,?,?,?,?,?)",
        [ownerId, data.question_th, data.question_en, data.answer_th, data.answer_en, data.sort_order, data.is_published ? 1 : 0])
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

export async function deleteFaq(id: number) {
  try {
    await pool.execute('DELETE FROM faq_items WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

// ── Variant Options ───────────────────────────────────────────────────────────

export async function upsertVariantOption(optionId: number | null, variantId: number, data: { group_key: string; group_label_th: string; group_label_en: string; value_key: string; value_th: string; value_en: string; sort_order: number }) {
  try {
    if (optionId) {
      await pool.execute('UPDATE product_variant_options SET group_key=?, group_label_th=?, group_label_en=?, value_key=?, value_th=?, value_en=?, sort_order=? WHERE id=?',
        [data.group_key, data.group_label_th, data.group_label_en, data.value_key, data.value_th, data.value_en, data.sort_order, optionId])
    } else {
      await pool.execute('INSERT INTO product_variant_options (variant_id, group_key, group_label_th, group_label_en, value_key, value_th, value_en, sort_order) VALUES (?,?,?,?,?,?,?,?)',
        [variantId, data.group_key, data.group_label_th, data.group_label_en, data.value_key, data.value_th, data.value_en, data.sort_order])
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

export async function deleteVariantOption(id: number) {
  try {
    await pool.execute('DELETE FROM product_variant_options WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}
