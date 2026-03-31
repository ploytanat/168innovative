import pool from '@/app/lib/db/connection'
import Link from 'next/link'
import { Plus, Package } from 'lucide-react'
import ProductsClient from './_client'

async function getProducts(search: string, categoryId: string) {
  try {
    let sql = `
      SELECT p.*, c.name_th as category_name,
        (SELECT COUNT(*) FROM product_variants WHERE product_id = p.id) as variant_count
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE 1=1
    `
    const params: string[] = []
    if (search) { sql += ' AND (p.name_th LIKE ? OR p.name_en LIKE ? OR p.sku LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`) }
    if (categoryId) { sql += ' AND p.category_id = ?'; params.push(categoryId) }
    sql += ' ORDER BY p.sort_order ASC, p.id DESC'
    const [rows] = await pool.execute(sql, params) as [Record<string, unknown>[], unknown]
    return rows
  } catch { return [] }
}

async function getCategories() {
  try {
    const [rows] = await pool.execute('SELECT id, name_th FROM categories ORDER BY sort_order ASC') as [Record<string, unknown>[], unknown]
    return rows
  } catch { return [] }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>
}) {
  const params = await searchParams
  const search = params.search ?? ''
  const categoryId = params.category ?? ''
  const [products, categories] = await Promise.all([getProducts(search, categoryId), getCategories()])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-gray-400 text-sm mt-1">{products.length} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} />
          New Product
        </Link>
      </div>

      {/* Filters */}
      <form className="flex items-center gap-3">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search products..."
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
        />
        <select
          name="category"
          defaultValue={categoryId}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={String(c.id)} value={String(c.id)}>{String(c.name_th)}</option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
        >
          Filter
        </button>
        {(search || categoryId) && (
          <Link href="/admin/products" className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors">
            Clear
          </Link>
        )}
      </form>

      {/* Table */}
      {products.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-16 text-center">
          <Package size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">No products found</p>
          <p className="text-gray-600 text-sm mt-1">Create your first product to get started.</p>
          <Link href="/admin/products/new" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
            <Plus size={16} /> New Product
          </Link>
        </div>
      ) : (
        <ProductsClient products={products} />
      )}
    </div>
  )
}
