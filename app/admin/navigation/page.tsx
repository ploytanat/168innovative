import pool from '@/app/lib/db/connection'
import NavigationClient from './_client'

async function getData() {
  try {
    const [navItems] = await pool.execute('SELECT * FROM site_navigation_items ORDER BY sort_order ASC') as [Record<string, unknown>[], unknown]
    const [groups] = await pool.execute('SELECT * FROM footer_link_groups ORDER BY sort_order ASC') as [Record<string, unknown>[], unknown]
    const enrichedGroups = await Promise.all(groups.map(async (g) => {
      const [links] = await pool.execute('SELECT * FROM footer_links WHERE group_id = ? ORDER BY sort_order ASC', [Number(g.id)]) as [Record<string, unknown>[], unknown]
      return { ...g, links }
    }))
    return { navItems, footerGroups: enrichedGroups }
  } catch { return { navItems: [], footerGroups: [] } }
}

export default async function NavigationPage() {
  const data = await getData()
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Navigation</h1>
        <p className="text-gray-400 text-sm mt-1">Manage site navigation and footer links</p>
      </div>
      <NavigationClient {...data} />
    </div>
  )
}
