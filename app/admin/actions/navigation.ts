'use server'

import pool from '@/app/lib/db/connection'
import { revalidatePath } from 'next/cache'

function revalidateAll() {
  revalidatePath('/admin/navigation')
  revalidatePath('/(th)', 'layout')
  revalidatePath('/(en)', 'layout')
}

export async function getNavItems() {
  try {
    const [rows] = await pool.execute('SELECT * FROM site_navigation_items ORDER BY sort_order ASC') as [Record<string, unknown>[], unknown]
    return rows
  } catch (e) { return [] }
}

export async function upsertNavItem(id: number | null, data: Record<string, unknown>) {
  try {
    const fields = ['parent_id','label_th','label_en','href','sort_order','is_published']
    if (id) {
      await pool.execute(`UPDATE site_navigation_items SET ${fields.map(f => `${f}=?`).join(',')} WHERE id=?`,
        [...fields.map(f => (data[f] ?? null) as string | number | boolean | null), id])
    } else {
      await pool.execute(`INSERT INTO site_navigation_items (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`,
        fields.map(f => (data[f] ?? null) as string | number | boolean | null))
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

export async function deleteNavItem(id: number) {
  try {
    await pool.execute('DELETE FROM site_navigation_items WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

export async function getFooterGroups() {
  try {
    const [groups] = await pool.execute('SELECT * FROM footer_link_groups ORDER BY sort_order ASC') as [Record<string, unknown>[], unknown]
    const enriched = await Promise.all(groups.map(async (g) => {
      const [links] = await pool.execute('SELECT * FROM footer_links WHERE group_id = ? ORDER BY sort_order ASC', [Number(g.id)]) as [Record<string, unknown>[], unknown]
      return { ...g, links }
    }))
    return enriched
  } catch (e) { return [] }
}

export async function upsertFooterGroup(id: number | null, data: { label_th: string; label_en: string; sort_order: number; is_published: boolean }) {
  try {
    if (id) {
      await pool.execute('UPDATE footer_link_groups SET label_th=?, label_en=?, sort_order=?, is_published=? WHERE id=?',
        [data.label_th, data.label_en, data.sort_order, data.is_published ? 1 : 0, id])
    } else {
      await pool.execute('INSERT INTO footer_link_groups (label_th, label_en, sort_order, is_published) VALUES (?,?,?,?)',
        [data.label_th, data.label_en, data.sort_order, data.is_published ? 1 : 0])
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

export async function deleteFooterGroup(id: number) {
  try {
    await pool.execute('DELETE FROM footer_link_groups WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

export async function upsertFooterLink(id: number | null, groupId: number, data: { label_th: string; label_en: string; href: string; sort_order: number; is_published: boolean }) {
  try {
    if (id) {
      await pool.execute('UPDATE footer_links SET label_th=?, label_en=?, href=?, sort_order=?, is_published=? WHERE id=?',
        [data.label_th, data.label_en, data.href, data.sort_order, data.is_published ? 1 : 0, id])
    } else {
      await pool.execute('INSERT INTO footer_links (group_id, label_th, label_en, href, sort_order, is_published) VALUES (?,?,?,?,?,?)',
        [groupId, data.label_th, data.label_en, data.href, data.sort_order, data.is_published ? 1 : 0])
    }
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}

export async function deleteFooterLink(id: number) {
  try {
    await pool.execute('DELETE FROM footer_links WHERE id = ?', [id])
    revalidateAll()
    return { success: true }
  } catch (e: unknown) { return { success: false, error: String(e) } }
}
