'use server'

import pool from '@/app/lib/db/connection'
import { revalidatePath } from 'next/cache'

function revalidateAll() {
  revalidatePath('/admin/articles')
  revalidatePath('/(th)', 'layout')
  revalidatePath('/(en)', 'layout')
}

export async function getArticles(search = '') {
  try {
    let sql = `
      SELECT a.*, GROUP_CONCAT(DISTINCT ac.name_th) as categories
      FROM articles a
      LEFT JOIN article_article_categories aac ON aac.article_id = a.id
      LEFT JOIN article_categories ac ON ac.id = aac.category_id
      WHERE 1=1
    `
    const params: (string | number | null)[] = []
    if (search) { sql += ' AND (a.title_th LIKE ? OR a.title_en LIKE ?)'; params.push(`%${search}%`, `%${search}%`) }
    sql += ' GROUP BY a.id ORDER BY a.published_at DESC, a.id DESC'
    const [rows] = await pool.execute(sql, params) as [Record<string, unknown>[], unknown]
    return rows
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function getArticle(id: number) {
  try {
    const [[article]] = await pool.execute('SELECT * FROM articles WHERE id = ?', [id]) as [Record<string, unknown>[], unknown]
    if (!article) return null
    const [blocks] = await pool.execute('SELECT * FROM article_blocks WHERE article_id = ? ORDER BY sort_order ASC', [id]) as [Record<string, unknown>[], unknown]
    const [tags] = await pool.execute('SELECT t.* FROM article_tags t JOIN article_article_tags aat ON aat.tag_id = t.id WHERE aat.article_id = ?', [id]) as [Record<string, unknown>[], unknown]
    const [cats] = await pool.execute('SELECT c.* FROM article_categories c JOIN article_article_categories aac ON aac.category_id = c.id WHERE aac.article_id = ?', [id]) as [Record<string, unknown>[], unknown]
    return { ...article, blocks, tags, categories: cats }
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function getArticleCategories() {
  try {
    const [rows] = await pool.execute('SELECT * FROM article_categories ORDER BY sort_order ASC') as [Record<string, unknown>[], unknown]
    return rows
  } catch (e) { return [] }
}

export async function getArticleTags() {
  try {
    const [rows] = await pool.execute('SELECT * FROM article_tags ORDER BY name_th ASC') as [Record<string, unknown>[], unknown]
    return rows
  } catch (e) { return [] }
}

export async function createArticle(formData: FormData) {
  try {
    const fields = ['slug','title_th','title_en','excerpt_th','excerpt_en','content_th','content_en','seo_title_th','seo_title_en','seo_description_th','seo_description_en','author_name','cover_image_url','cover_image_alt_th','cover_image_alt_en','focus_keyword_th','focus_keyword_en','reading_time_minutes','published_at','is_published']
    const values = fields.map(f => formData.get(f) ?? null)
    const [result] = await pool.execute(`INSERT INTO articles (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`, values) as [{ insertId: number }, unknown]
    revalidateAll()
    return { success: true, id: result.insertId }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

export async function updateArticle(id: number, formData: FormData) {
  try {
    const fields = ['slug','title_th','title_en','excerpt_th','excerpt_en','content_th','content_en','seo_title_th','seo_title_en','seo_description_th','seo_description_en','author_name','cover_image_url','cover_image_alt_th','cover_image_alt_en','focus_keyword_th','focus_keyword_en','reading_time_minutes','published_at','is_published']
    const set = fields.map(f => `${f} = ?`).join(', ')
    await pool.execute(`UPDATE articles SET ${set} WHERE id = ?`, [...fields.map(f => formData.get(f) ?? null), id])
    revalidateAll()
    revalidatePath(`/admin/articles/${id}`)
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

export async function deleteArticle(id: number) {
  try {
    await pool.execute('DELETE FROM articles WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

export async function upsertBlock(blockId: number | null, articleId: number, data: Record<string, unknown>) {
  try {
    const fields = ['block_type', 'sort_order', 'content_th', 'content_en', 'heading_th', 'heading_en', 'level', 'style', 'items_th', 'items_en', 'label_th', 'label_en', 'href']
    if (blockId) {
      const set = fields.map(f => `${f} = ?`).join(', ')
      await pool.execute(`UPDATE article_blocks SET ${set} WHERE id = ?`, [...fields.map(f => (data[f] ?? null) as string | number | boolean | null), blockId])
    } else {
      await pool.execute(`INSERT INTO article_blocks (article_id, ${fields.join(',')}) VALUES (?, ${fields.map(() => '?').join(',')})`,
        [articleId, ...fields.map(f => (data[f] ?? null) as string | number | boolean | null)])
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

export async function deleteBlock(id: number) {
  try {
    await pool.execute('DELETE FROM article_blocks WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

export async function setArticleTags(articleId: number, tagIds: number[]) {
  try {
    await pool.execute('DELETE FROM article_article_tags WHERE article_id = ?', [articleId])
    for (const tid of tagIds) {
      await pool.execute('INSERT INTO article_article_tags (article_id, tag_id) VALUES (?, ?)', [articleId, tid])
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

export async function setArticleCategories(articleId: number, catIds: number[]) {
  try {
    await pool.execute('DELETE FROM article_article_categories WHERE article_id = ?', [articleId])
    for (const cid of catIds) {
      await pool.execute('INSERT INTO article_article_categories (article_id, category_id) VALUES (?, ?)', [articleId, cid])
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

export async function createArticleTag(formData: FormData) {
  try {
    const [result] = await pool.execute('INSERT INTO article_tags (slug, name_th, name_en) VALUES (?, ?, ?)',
      [formData.get('slug'), formData.get('name_th'), formData.get('name_en')]) as [{ insertId: number }, unknown]
    revalidatePath('/admin/articles')
    return { success: true, id: result.insertId }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}

export async function createArticleCategory(formData: FormData) {
  try {
    const [result] = await pool.execute('INSERT INTO article_categories (slug, name_th, name_en, sort_order) VALUES (?, ?, ?, ?)',
      [formData.get('slug'), formData.get('name_th'), formData.get('name_en'), formData.get('sort_order') ?? 0]) as [{ insertId: number }, unknown]
    revalidatePath('/admin/articles')
    return { success: true, id: result.insertId }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}
