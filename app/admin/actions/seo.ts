'use server'

import pool from '@/app/lib/db/connection'
import { revalidatePath } from 'next/cache'

function revalidateAll() {
  revalidatePath('/admin/seo')
  revalidatePath('/(th)', 'layout')
  revalidatePath('/(en)', 'layout')
}

export async function getSiteSettings() {
  try {
    const [rows] = await pool.execute('SELECT * FROM site_settings ORDER BY id ASC LIMIT 1') as [Record<string, unknown>[], unknown]
    return rows[0] ?? null
  } catch (e) { return null }
}

export async function upsertSiteSettings(formData: FormData) {
  try {
    const fields = ['site_name_th','site_name_en','tagline_th','tagline_en','default_seo_title_th','default_seo_title_en','default_seo_description_th','default_seo_description_en','og_image_url','favicon_url','google_analytics_id','facebook_pixel_id']
    const values = fields.map(f => formData.get(f) ?? null)
    const existingId = formData.get('id')
    if (existingId) {
      await pool.execute(`UPDATE site_settings SET ${fields.map(f => `${f}=?`).join(',')} WHERE id=?`, [...values, existingId])
    } else {
      await pool.execute(`INSERT INTO site_settings (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`, values)
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

export async function getPageSeoList() {
  try {
    const [rows] = await pool.execute('SELECT * FROM page_seo ORDER BY page_key ASC, locale ASC') as [Record<string, unknown>[], unknown]
    return rows
  } catch (e) { return [] }
}

export async function upsertPageSeo(id: number | null, data: Record<string, unknown>) {
  try {
    const fields = ['page_key','locale','title','description','keywords','og_title','og_description','og_image_url','canonical_url','is_published']
    if (id) {
      await pool.execute(`UPDATE page_seo SET ${fields.map(f => `${f}=?`).join(',')} WHERE id=?`,
        [...fields.map(f => (data[f] ?? null) as string | number | boolean | null), id])
    } else {
      await pool.execute(`INSERT INTO page_seo (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`,
        fields.map(f => (data[f] ?? null) as string | number | boolean | null))
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

export async function deletePageSeo(id: number) {
  try {
    await pool.execute('DELETE FROM page_seo WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}
