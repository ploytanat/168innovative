import pool from '@/app/lib/db/connection'
import ProductForm from '../_form'

async function getCategories() {
  try {
    const [rows] = await pool.execute('SELECT id, name_th FROM categories ORDER BY sort_order ASC') as [Record<string, unknown>[], unknown]
    return rows
  } catch { return [] }
}

export default async function NewProductPage() {
  const categories = await getCategories()
  return <ProductForm categories={categories} />
}
