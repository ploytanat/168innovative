import pool from '@/app/lib/db/connection'
import Link from 'next/link'
import { Plus, Tag } from 'lucide-react'
import CategoriesClient from './_client'

async function getCategories() {
  try {
    const [rows] = await pool.execute(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.id ASC
    `) as [Record<string, unknown>[], unknown]
    return rows
  } catch { return [] }
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-gray-400 text-sm mt-1">{categories.length} total categories</p>
        </div>
        <Link href="/admin/categories/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus size={16} /> New Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-16 text-center">
          <Tag size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">No categories yet</p>
          <Link href="/admin/categories/new" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg">
            <Plus size={16} /> New Category
          </Link>
        </div>
      ) : (
        <CategoriesClient categories={categories} />
      )}
    </div>
  )
}
