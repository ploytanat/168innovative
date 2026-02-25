import { NextResponse } from 'next/server'
import { getArticles } from '@/app/lib/api/articles'
import { getProducts } from '@/app/lib/api/products'
import { getCategories } from '@/app/lib/api/categories'

const BASE = 'https://168innovative.co.th'

export async function GET() {

  const [articles, products, categories] = await Promise.all([
    getArticles('th'),
    getProducts('th'),
    getCategories('th'),
  ])

  /* ───────── Static Pages ───────── */
  const staticPages = [
    {
      loc: BASE,
      changefreq: 'weekly',
      priority: '1.0',
    },
    {
      loc: `${BASE}/categories`,
      changefreq: 'weekly',
      priority: '0.9',
    },
    {
      loc: `${BASE}/articles`,
      changefreq: 'weekly',
      priority: '0.8',
    },
    {
      loc: `${BASE}/about`,
      changefreq: 'monthly',
      priority: '0.7',
    },
    {
      loc: `${BASE}/contact`,
      changefreq: 'monthly',
      priority: '0.7',
    },
  ]

  /* ───────── Categories ───────── */
  const categoryUrls = categories.map((cat) => ({
    loc: `${BASE}/categories/${cat.slug}`,
    changefreq: 'weekly',
    priority: '0.8',
  }))

  /* ───────── Products ───────── */
  const productUrls = products.map((p) => ({
    loc: `${BASE}/categories/${p.categorySlug}/${p.slug}`,
    changefreq: 'monthly',
    priority: '0.6',
  }))

  /* ───────── Articles ───────── */
  const articleUrls = articles.map((a) => ({
    loc: `${BASE}/articles/${a.slug}`,
    changefreq: 'weekly',
    priority: '0.7',
  }))

  const urls = [
    ...staticPages,
    ...categoryUrls,
    ...productUrls,
    ...articleUrls,
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}