import pool from '@/app/lib/db/connection'
import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'
import ArticlesClient from './_client'

async function getArticles(search: string) {
  try {
    let sql = `
      SELECT a.id, a.slug, a.title_th, a.title_en, a.cover_image_url,
             a.author_name, a.reading_time_minutes, a.published_at, a.is_published
      FROM articles a
      WHERE 1=1
    `
    const params: string[] = []
    if (search) { sql += ' AND (a.title_th LIKE ? OR a.title_en LIKE ?)'; params.push(`%${search}%`, `%${search}%`) }
    sql += ' ORDER BY a.published_at DESC, a.id DESC'
    const [rows] = await pool.execute(sql, params) as [Record<string, unknown>[], unknown]
    return rows
  } catch { return [] }
}

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const { search = '' } = await searchParams
  const articles = await getArticles(search)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Articles</h1>
          <p className="text-gray-400 text-sm mt-1">{articles.length} total articles</p>
        </div>
        <Link href="/admin/articles/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus size={16} /> New Article
        </Link>
      </div>

      <form className="flex items-center gap-3">
        <input type="text" name="search" defaultValue={search} placeholder="Search articles..."
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64" />
        <button type="submit" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg">Filter</button>
        {search && <Link href="/admin/articles" className="px-4 py-2 text-gray-400 hover:text-white text-sm">Clear</Link>}
      </form>

      {articles.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-16 text-center">
          <FileText size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">No articles found</p>
          <Link href="/admin/articles/new" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg">
            <Plus size={16} /> New Article
          </Link>
        </div>
      ) : (
        <ArticlesClient articles={articles} />
      )}
    </div>
  )
}
