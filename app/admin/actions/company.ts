'use server'

import pool from '@/app/lib/db/connection'
import { revalidatePath } from 'next/cache'

function revalidateAll() {
  revalidatePath('/admin/company')
  revalidatePath('/(th)', 'layout')
  revalidatePath('/(en)', 'layout')
}

export async function getCompanyProfile() {
  try {
    const [rows] = await pool.execute('SELECT * FROM company_profiles ORDER BY id ASC LIMIT 1') as [Record<string, unknown>[], unknown]
    return rows[0] ?? null
  } catch (e) { return null }
}

export async function upsertCompanyProfile(formData: FormData) {
  try {
    const fields = ['legal_name_th','legal_name_en','short_name','tagline_th','tagline_en','description_th','description_en','founded_year','logo_url','favicon_url','address_th','address_en','is_published']
    const values = fields.map(f => formData.get(f) ?? null)
    const existingId = formData.get('id')
    if (existingId) {
      await pool.execute(`UPDATE company_profiles SET ${fields.map(f => `${f}=?`).join(',')} WHERE id=?`, [...values, existingId])
    } else {
      await pool.execute(`INSERT INTO company_profiles (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`, values)
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

export async function getContactMethods(companyId: number) {
  try {
    const [rows] = await pool.execute('SELECT * FROM company_contact_methods WHERE company_id = ? ORDER BY sort_order ASC', [companyId]) as [Record<string, unknown>[], unknown]
    return rows
  } catch (e) { return [] }
}

export async function upsertContactMethod(id: number | null, companyId: number, data: Record<string, unknown>) {
  try {
    const fields = ['method_type','label_th','label_en','value','href','sort_order','is_published']
    if (id) {
      await pool.execute(`UPDATE company_contact_methods SET ${fields.map(f => `${f}=?`).join(',')} WHERE id=?`,
        [...fields.map(f => (data[f] ?? null) as string | number | boolean | null), id])
    } else {
      await pool.execute(`INSERT INTO company_contact_methods (company_id, ${fields.join(',')}) VALUES (?, ${fields.map(() => '?').join(',')})`,
        [companyId, ...fields.map(f => (data[f] ?? null) as string | number | boolean | null)])
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

export async function deleteContactMethod(id: number) {
  try {
    await pool.execute('DELETE FROM company_contact_methods WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

export async function getGalleryImages(companyId: number) {
  try {
    const [rows] = await pool.execute('SELECT * FROM company_gallery_images WHERE company_id = ? ORDER BY sort_order ASC', [companyId]) as [Record<string, unknown>[], unknown]
    return rows
  } catch (e) { return [] }
}

export async function upsertGalleryImage(id: number | null, companyId: number, data: { image_url: string; alt_th: string; alt_en: string; sort_order: number; is_published: boolean }) {
  try {
    if (id) {
      await pool.execute('UPDATE company_gallery_images SET image_url=?, alt_th=?, alt_en=?, sort_order=?, is_published=? WHERE id=?',
        [data.image_url, data.alt_th, data.alt_en, data.sort_order, data.is_published ? 1 : 0, id])
    } else {
      await pool.execute('INSERT INTO company_gallery_images (company_id, image_url, alt_th, alt_en, sort_order, is_published) VALUES (?,?,?,?,?,?)',
        [companyId, data.image_url, data.alt_th, data.alt_en, data.sort_order, data.is_published ? 1 : 0])
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

export async function deleteGalleryImage(id: number) {
  try {
    await pool.execute('DELETE FROM company_gallery_images WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}
