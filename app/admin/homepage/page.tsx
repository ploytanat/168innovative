import pool from '@/app/lib/db/connection'
import HomepageClient from './_client'

async function getData() {
  try {
    const [slides] = await pool.execute('SELECT * FROM home_hero_slides ORDER BY sort_order ASC') as [Record<string, unknown>[], unknown]
    const enrichedSlides = await Promise.all(slides.map(async (s) => {
      const [stats] = await pool.execute('SELECT * FROM home_hero_slide_stats WHERE slide_id = ? ORDER BY sort_order ASC', [Number(s.id)]) as [Record<string, unknown>[], unknown]
      const [chips] = await pool.execute('SELECT * FROM home_hero_slide_chips WHERE slide_id = ? ORDER BY sort_order ASC', [Number(s.id)]) as [Record<string, unknown>[], unknown]
      return { ...s, stats, chips }
    }))

    const [ticker] = await pool.execute('SELECT * FROM home_ticker_items ORDER BY sort_order ASC') as [Record<string, unknown>[], unknown]
    const [steps] = await pool.execute('SELECT * FROM home_process_steps ORDER BY sort_order ASC') as [Record<string, unknown>[], unknown]
    const [testimonials] = await pool.execute('SELECT * FROM testimonials ORDER BY sort_order ASC') as [Record<string, unknown>[], unknown]
    const [whyItems] = await pool.execute('SELECT * FROM why_items ORDER BY sort_order ASC') as [Record<string, unknown>[], unknown]

    return { slides: enrichedSlides, ticker, steps, testimonials, whyItems }
  } catch { return { slides: [], ticker: [], steps: [], testimonials: [], whyItems: [] } }
}

export default async function HomepagePage() {
  const data = await getData()
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Homepage</h1>
        <p className="text-gray-400 text-sm mt-1">Manage all homepage sections</p>
      </div>
      <HomepageClient {...data} />
    </div>
  )
}
