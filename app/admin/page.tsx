import pool from '@/app/lib/db/connection'
import Link from 'next/link'
import { Package, Tag, FileText, Star, ArrowRight, Activity } from 'lucide-react'

async function getStats() {
  try {
    const [[{ total: products }]] = await pool.execute('SELECT COUNT(*) as total FROM products') as [Record<string, number>[], unknown]
    const [[{ total: categories }]] = await pool.execute('SELECT COUNT(*) as total FROM categories') as [Record<string, number>[], unknown]
    const [[{ total: articles }]] = await pool.execute('SELECT COUNT(*) as total FROM articles') as [Record<string, number>[], unknown]
    const [[{ total: testimonials }]] = await pool.execute('SELECT COUNT(*) as total FROM testimonials') as [Record<string, number>[], unknown]
    return { products, categories, articles, testimonials }
  } catch {
    return { products: 0, categories: 0, articles: 0, testimonials: 0 }
  }
}

async function getRecentProducts() {
  try {
    const [rows] = await pool.execute(`
      SELECT p.id, p.name_th, p.sku, p.is_published, p.image_url, c.name_th as category_name, p.sort_order
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ORDER BY p.id DESC LIMIT 10
    `) as [Record<string, unknown>[], unknown]
    return rows
  } catch {
    return []
  }
}

export default async function AdminDashboard() {
  const [stats, recentProducts] = await Promise.all([getStats(), getRecentProducts()])

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: <Package size={20} />, href: '/admin/products', color: 'text-blue-400' },
    { label: 'Categories', value: stats.categories, icon: <Tag size={20} />, href: '/admin/categories', color: 'text-purple-400' },
    { label: 'Articles', value: stats.articles, icon: <FileText size={20} />, href: '/admin/articles', color: 'text-green-400' },
    { label: 'Testimonials', value: stats.testimonials, icon: <Star size={20} />, href: '/admin/homepage', color: 'text-yellow-400' },
  ]

  const quickLinks = [
    { label: 'Add Product', href: '/admin/products/new', description: 'Create a new product listing' },
    { label: 'Add Category', href: '/admin/categories/new', description: 'Create a new product category' },
    { label: 'Add Article', href: '/admin/articles/new', description: 'Write a new article/blog post' },
    { label: 'Edit Homepage', href: '/admin/homepage', description: 'Manage hero slides, ticker, etc.' },
    { label: 'Company Info', href: '/admin/company', description: 'Update company profile' },
    { label: 'SEO Settings', href: '/admin/seo', description: 'Site-wide SEO configuration' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back. Here&apos;s what&apos;s going on.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700">
          <Activity size={14} className="text-green-400" />
          <span className="text-sm text-gray-300">System Status: <span className="text-green-400 font-medium">Live Database</span></span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{card.label}</p>
                <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} opacity-80`}>{card.icon}</div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
              <span>View all</span>
              <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent Products */}
        <div className="col-span-2 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Recent Products</h2>
            <Link href="/admin/products" className="text-xs text-blue-400 hover:text-blue-300">
              View all →
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Product</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">SKU</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Category</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {recentProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-500 text-sm">No products yet.</td>
                </tr>
              ) : (
                recentProducts.map((p) => (
                  <tr key={String(p.id)} className="hover:bg-gray-700/20 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {p.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={String(p.image_url)} alt="" className="w-8 h-8 rounded object-cover bg-gray-700" />
                        ) : (
                          <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center">
                            <Package size={12} className="text-gray-500" />
                          </div>
                        )}
                        <span className="text-gray-200 font-medium truncate max-w-[160px]">{String(p.name_th)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-400 font-mono text-xs">{String(p.sku ?? '—')}</td>
                    <td className="px-5 py-3 text-gray-400">{String(p.category_name ?? '—')}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.is_published ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {p.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/admin/products/${p.id}`} className="text-xs text-blue-400 hover:text-blue-300">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Links */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-700">
            <h2 className="text-sm font-semibold text-white">Quick Actions</h2>
          </div>
          <div className="p-3 space-y-1">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/50 transition-colors group"
              >
                <div>
                  <p className="text-sm text-gray-200 font-medium group-hover:text-white transition-colors">{link.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{link.description}</p>
                </div>
                <ArrowRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
