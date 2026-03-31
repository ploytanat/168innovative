'use server'

import pool from '@/app/lib/db/connection'
import { revalidatePath } from 'next/cache'

function revalidateAll() {
  revalidatePath('/admin/categories')
  revalidatePath('/(th)', 'layout')
  revalidatePath('/(en)', 'layout')
}

export async function getCategories() {
  try {
    const [rows] = await pool.execute(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.id ASC
    `) as [Record<string, unknown>[], unknown]
    return rows
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function getCategory(id: number) {
  try {
    const [[cat]] = await pool.execute('SELECT * FROM categories WHERE id = ?', [id]) as [Record<string, unknown>[], unknown]
    if (!cat) return null
    const [faqs] = await pool.execute("SELECT * FROM faq_items WHERE owner_type = 'category' AND owner_id = ? ORDER BY sort_order ASC", [id]) as [Record<string, unknown>[], unknown]
    return { ...cat, faqs }
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function createCategory(formData: FormData) {
  try {
    const fields = ['slug','name_th','name_en','description_th','description_en','intro_html_th','intro_html_en','seo_title_th','seo_title_en','seo_description_th','seo_description_en','image_url','image_alt_th','image_alt_en','sort_order','is_published']
    const values = fields.map(f => formData.get(f) ?? null)
    const cols = fields.join(', ')
    const ph = fields.map(() => '?').join(', ')
    const [result] = await pool.execute(`INSERT INTO categories (${cols}) VALUES (${ph})`, values) as [{ insertId: number }, unknown]
    revalidateAll()
    return { success: true, id: result.insertId }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

export async function updateCategory(id: number, formData: FormData) {
  try {
    const fields = ['slug','name_th','name_en','description_th','description_en','intro_html_th','intro_html_en','seo_title_th','seo_title_en','seo_description_th','seo_description_en','image_url','image_alt_th','image_alt_en','sort_order','is_published']
    const set = fields.map(f => `${f} = ?`).join(', ')
    const values = [...fields.map(f => formData.get(f) ?? null), id]
    await pool.execute(`UPDATE categories SET ${set} WHERE id = ?`, values)
    revalidateAll()
    revalidatePath(`/admin/categories/${id}`)
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

export async function deleteCategory(id: number) {
  try {
    await pool.execute('DELETE FROM categories WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

export async function upsertCategoryFaq(faqId: number | null, ownerId: number, data: { question_th: string; question_en: string; answer_th: string; answer_en: string; sort_order: number; is_published: boolean }) {
  try {
    if (faqId) {
      await pool.execute('UPDATE faq_items SET question_th=?, question_en=?, answer_th=?, answer_en=?, sort_order=?, is_published=? WHERE id=?',
        [data.question_th, data.question_en, data.answer_th, data.answer_en, data.sort_order, data.is_published ? 1 : 0, faqId])
    } else {
      await pool.execute("INSERT INTO faq_items (owner_type, owner_id, question_th, question_en, answer_th, answer_en, sort_order, is_published) VALUES ('category',?,?,?,?,?,?,?)",
        [ownerId, data.question_th, data.question_en, data.answer_th, data.answer_en, data.sort_order, data.is_published ? 1 : 0])
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

export async function deleteCategoryFaq(id: number) {
  try {
    await pool.execute('DELETE FROM faq_items WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}
