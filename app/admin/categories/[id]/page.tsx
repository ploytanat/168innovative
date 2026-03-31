import pool from '@/app/lib/db/connection'
import { notFound } from 'next/navigation'
import CategoryForm from '../_form'

async function getCategory(id: number) {
  try {
    const [[cat]] = await pool.execute('SELECT * FROM categories WHERE id = ?', [id]) as [Record<string, unknown>[], unknown]
    if (!cat) return null
    const [faqs] = await pool.execute("SELECT * FROM faq_items WHERE owner_type = 'category' AND owner_id = ? ORDER BY sort_order ASC", [id]) as [Record<string, unknown>[], unknown]
    return { ...cat, faqs }
  } catch { return null }
}

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await getCategory(Number(id))
  if (!category) notFound()
  return <CategoryForm category={category} />
}
