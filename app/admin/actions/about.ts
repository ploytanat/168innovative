'use server'

import pool from '@/app/lib/db/connection'
import { revalidatePath } from 'next/cache'

function revalidateAll() {
  revalidatePath('/admin/about')
  revalidatePath('/(th)', 'layout')
  revalidatePath('/(en)', 'layout')
}

export async function getAboutSections() {
  try {
    const [rows] = await pool.execute('SELECT * FROM about_sections ORDER BY sort_order ASC') as [Record<string, unknown>[], unknown]
    return rows
  } catch (e) { return [] }
}

export async function upsertAboutSection(id: number | null, data: Record<string, unknown>) {
  try {
    const fields = ['section_key','eyebrow_th','eyebrow_en','title_th','title_en','description_th','description_en','image_primary_url','image_primary_alt_th','image_primary_alt_en','image_secondary_url','image_secondary_alt_th','image_secondary_alt_en','sort_order','is_published']
    if (id) {
      await pool.execute(`UPDATE about_sections SET ${fields.map(f => `${f}=?`).join(',')} WHERE id=?`,
        [...fields.map(f => (data[f] ?? null) as string | number | boolean | null), id])
    } else {
      await pool.execute(`INSERT INTO about_sections (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`,
        fields.map(f => (data[f] ?? null) as string | number | boolean | null))
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

export async function deleteAboutSection(id: number) {
  try {
    await pool.execute('DELETE FROM about_sections WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}
