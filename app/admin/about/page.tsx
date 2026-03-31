import pool from '@/app/lib/db/connection'
import AboutClient from './_client'

async function getSections() {
  try {
    const [rows] = await pool.execute('SELECT * FROM about_sections ORDER BY sort_order ASC') as [Record<string, unknown>[], unknown]
    return rows
  } catch { return [] }
}

export default async function AboutPage() {
  const sections = await getSections()
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">About Page</h1>
        <p className="text-gray-400 text-sm mt-1">Manage about page sections</p>
      </div>
      <AboutClient sections={sections} />
    </div>
  )
}
