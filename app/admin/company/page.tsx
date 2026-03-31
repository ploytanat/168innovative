import pool from '@/app/lib/db/connection'
import CompanyClient from './_client'

async function getData() {
  try {
    const [profiles] = await pool.execute('SELECT * FROM company_profiles ORDER BY id ASC LIMIT 1') as [Record<string, unknown>[], unknown]
    const profile = profiles[0] ?? null
    let contacts: Record<string, unknown>[] = []
    let gallery: Record<string, unknown>[] = []
    if (profile?.id) {
      const [c] = await pool.execute('SELECT * FROM company_contact_methods WHERE company_id = ? ORDER BY sort_order ASC', [Number(profile.id)]) as [Record<string, unknown>[], unknown]
      const [g] = await pool.execute('SELECT * FROM company_gallery_images WHERE company_id = ? ORDER BY sort_order ASC', [Number(profile.id)]) as [Record<string, unknown>[], unknown]
      contacts = c; gallery = g
    }
    return { profile, contacts, gallery }
  } catch { return { profile: null, contacts: [], gallery: [] } }
}

export default async function CompanyPage() {
  const data = await getData()
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Company</h1>
        <p className="text-gray-400 text-sm mt-1">Manage company profile and contact information</p>
      </div>
      <CompanyClient {...data} />
    </div>
  )
}
