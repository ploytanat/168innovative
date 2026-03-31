import pool from '@/app/lib/db/connection'
import SeoClient from './_client'

async function getData() {
  try {
    const [settings] = await pool.execute('SELECT * FROM site_settings ORDER BY id ASC LIMIT 1') as [Record<string, unknown>[], unknown]
    const [pageSeo] = await pool.execute('SELECT * FROM page_seo ORDER BY page_key ASC, locale ASC') as [Record<string, unknown>[], unknown]
    return { settings: settings[0] ?? null, pageSeo }
  } catch { return { settings: null, pageSeo: [] } }
}

export default async function SeoPage() {
  const data = await getData()
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">SEO Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage site-wide and per-page SEO configuration</p>
      </div>
      <SeoClient {...data} />
    </div>
  )
}
