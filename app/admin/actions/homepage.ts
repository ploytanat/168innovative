'use server'

import pool from '@/app/lib/db/connection'
import { revalidatePath } from 'next/cache'

function revalidateAll() {
  revalidatePath('/admin/homepage')
  revalidatePath('/(th)', 'layout')
  revalidatePath('/(en)', 'layout')
}

// ── Hero Slides ───────────────────────────────────────────────────────────────

export async function getHeroSlides() {
  try {
    const [slides] = await pool.execute('SELECT * FROM home_hero_slides ORDER BY sort_order ASC') as [Record<string, unknown>[], unknown]
    const enriched = await Promise.all(slides.map(async (s) => {
      const [stats] = await pool.execute('SELECT * FROM home_hero_slide_stats WHERE slide_id = ? ORDER BY sort_order ASC', [Number(s.id)]) as [Record<string, unknown>[], unknown]
      const [chips] = await pool.execute('SELECT * FROM home_hero_slide_chips WHERE slide_id = ? ORDER BY sort_order ASC', [Number(s.id)]) as [Record<string, unknown>[], unknown]
      return { ...s, stats, chips }
    }))
    return enriched
  } catch (e) { console.error(e); return [] }
}

export async function upsertHeroSlide(slideId: number | null, formData: FormData) {
  try {
    const fields = ['theme','badge_variant','badge_text_th','badge_text_en','title_th','title_en','description_th','description_en','image_url','image_alt_th','image_alt_en','cta_primary_label_th','cta_primary_label_en','cta_primary_href','cta_secondary_label_th','cta_secondary_label_en','cta_secondary_href','highlight_value','highlight_label_th','highlight_label_en','visual_title_th','visual_title_en','visual_subtitle_th','visual_subtitle_en','sort_order','is_published']
    const values = fields.map(f => formData.get(f) ?? null)
    if (slideId) {
      await pool.execute(`UPDATE home_hero_slides SET ${fields.map(f => `${f}=?`).join(',')} WHERE id=?`, [...values, slideId])
    } else {
      await pool.execute(`INSERT INTO home_hero_slides (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`, values)
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

export async function deleteHeroSlide(id: number) {
  try {
    await pool.execute('DELETE FROM home_hero_slides WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

export async function upsertSlideStats(slideId: number, stats: { id?: number; metric_value: string; label_th: string; label_en: string; sort_order: number }[]) {
  try {
    await pool.execute('DELETE FROM home_hero_slide_stats WHERE slide_id = ?', [slideId])
    for (const s of stats) {
      await pool.execute('INSERT INTO home_hero_slide_stats (slide_id, metric_value, label_th, label_en, sort_order) VALUES (?,?,?,?,?)',
        [slideId, s.metric_value, s.label_th, s.label_en, s.sort_order])
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

export async function upsertSlideChips(slideId: number, chips: { id?: number; label_th: string; label_en: string; sort_order: number }[]) {
  try {
    await pool.execute('DELETE FROM home_hero_slide_chips WHERE slide_id = ?', [slideId])
    for (const c of chips) {
      await pool.execute('INSERT INTO home_hero_slide_chips (slide_id, label_th, label_en, sort_order) VALUES (?,?,?,?)',
        [slideId, c.label_th, c.label_en, c.sort_order])
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

// ── Ticker ────────────────────────────────────────────────────────────────────

export async function getTickerItems() {
  try {
    const [rows] = await pool.execute('SELECT * FROM home_ticker_items ORDER BY sort_order ASC') as [Record<string, unknown>[], unknown]
    return rows
  } catch (e) { return [] }
}

export async function upsertTickerItem(id: number | null, data: { label_th: string; label_en: string; sort_order: number; is_published: boolean }) {
  try {
    if (id) {
      await pool.execute('UPDATE home_ticker_items SET label_th=?, label_en=?, sort_order=?, is_published=? WHERE id=?',
        [data.label_th, data.label_en, data.sort_order, data.is_published ? 1 : 0, id])
    } else {
      await pool.execute('INSERT INTO home_ticker_items (label_th, label_en, sort_order, is_published) VALUES (?,?,?,?)',
        [data.label_th, data.label_en, data.sort_order, data.is_published ? 1 : 0])
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

export async function deleteTickerItem(id: number) {
  try {
    await pool.execute('DELETE FROM home_ticker_items WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

// ── Process Steps ─────────────────────────────────────────────────────────────

export async function getProcessSteps() {
  try {
    const [rows] = await pool.execute('SELECT * FROM home_process_steps ORDER BY sort_order ASC') as [Record<string, unknown>[], unknown]
    return rows
  } catch (e) { return [] }
}

export async function upsertProcessStep(id: number | null, data: { icon_name: string; title_th: string; title_en: string; description_th: string; description_en: string; sort_order: number; is_published: boolean }) {
  try {
    if (id) {
      await pool.execute('UPDATE home_process_steps SET icon_name=?, title_th=?, title_en=?, description_th=?, description_en=?, sort_order=?, is_published=? WHERE id=?',
        [data.icon_name, data.title_th, data.title_en, data.description_th, data.description_en, data.sort_order, data.is_published ? 1 : 0, id])
    } else {
      await pool.execute('INSERT INTO home_process_steps (icon_name, title_th, title_en, description_th, description_en, sort_order, is_published) VALUES (?,?,?,?,?,?,?)',
        [data.icon_name, data.title_th, data.title_en, data.description_th, data.description_en, data.sort_order, data.is_published ? 1 : 0])
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

export async function deleteProcessStep(id: number) {
  try {
    await pool.execute('DELETE FROM home_process_steps WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

// ── Testimonials ──────────────────────────────────────────────────────────────

export async function getTestimonials(pageKey = '') {
  try {
    let sql = 'SELECT * FROM testimonials WHERE 1=1'
    const params: (string | number | null)[] = []
    if (pageKey) { sql += ' AND page_key = ?'; params.push(pageKey) }
    sql += ' ORDER BY sort_order ASC'
    const [rows] = await pool.execute(sql, params) as [Record<string, unknown>[], unknown]
    return rows
  } catch (e) { return [] }
}

export async function upsertTestimonial(id: number | null, data: Record<string, unknown>) {
  try {
    const fields = ['page_key','person_name','role_th','role_en','company_name_th','company_name_en','quote_th','quote_en','avatar_type','avatar_emoji','avatar_url','rating','sort_order','is_featured','is_published']
    if (id) {
      await pool.execute(`UPDATE testimonials SET ${fields.map(f => `${f}=?`).join(',')} WHERE id=?`,
        [...fields.map(f => (data[f] ?? null) as string | number | boolean | null), id])
    } else {
      await pool.execute(`INSERT INTO testimonials (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`,
        fields.map(f => (data[f] ?? null) as string | number | boolean | null))
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

export async function deleteTestimonial(id: number) {
  try {
    await pool.execute('DELETE FROM testimonials WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

// ── Why Items ─────────────────────────────────────────────────────────────────

export async function getWhyItems(pageKey = '') {
  try {
    let sql = 'SELECT * FROM why_items WHERE 1=1'
    const params: (string | number | null)[] = []
    if (pageKey) { sql += ' AND page_key = ?'; params.push(pageKey) }
    sql += ' ORDER BY sort_order ASC'
    const [rows] = await pool.execute(sql, params) as [Record<string, unknown>[], unknown]
    return rows
  } catch (e) { return [] }
}

export async function upsertWhyItem(id: number | null, data: Record<string, unknown>) {
  try {
    const fields = ['page_key','section_key','icon_name','image_url','image_alt_th','image_alt_en','title_th','title_en','description_th','description_en','sort_order','is_published']
    if (id) {
      await pool.execute(`UPDATE why_items SET ${fields.map(f => `${f}=?`).join(',')} WHERE id=?`,
        [...fields.map(f => (data[f] ?? null) as string | number | boolean | null), id])
    } else {
      await pool.execute(`INSERT INTO why_items (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`,
        fields.map(f => (data[f] ?? null) as string | number | boolean | null))
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

export async function deleteWhyItem(id: number) {
  try {
    await pool.execute('DELETE FROM why_items WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}
