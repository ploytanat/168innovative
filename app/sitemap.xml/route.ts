import { NextResponse } from 'next/server'

const BASE = 'https://168innovative.co.th'

export async function GET() {
  const [productsRes, categoriesRes] = await Promise.all([
    fetch(
      `${process.env.WP_API_URL}/wp-json/wp/v2/product?per_page=100&_fields=slug,product_category`,
      { next: { revalidate: 3600 } }
    ),
    fetch(
      `${process.env.WP_API_URL}/wp-json/wp/v2/product_category?_fields=id,slug&per_page=100`,
      { next: { revalidate: 3600 } }
    ),
  ])

  const products = await productsRes.json()
  const categories = await categoriesRes.json()

  const categoryMap: Record<number, string> = Object.fromEntries(
    categories.map((c: any) => [c.id, c.slug])
  )

  const staticPages = [
    { loc: BASE, changefreq: 'weekly', priority: '1.0' },
    { loc: `${BASE}/categories`, changefreq: 'weekly', priority: '0.9' },
    { loc: `${BASE}/about`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE}/contact`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE}/articles`, changefreq: 'weekly', priority: '0.6' },
  ]

  const categoryUrls = categories.map((cat: any) => ({
    loc: `${BASE}/categories/${cat.slug}`,
    changefreq: 'weekly',
    priority: '0.8',
  }))

  const productUrls = products
    .filter((p: any) => p.product_category?.length)
    .map((p: any) => ({
      loc: `${BASE}/categories/${categoryMap[p.product_category[0]]}/${p.slug}`,
      changefreq: 'monthly',
      priority: '0.6',
    }))

  const urls = [...staticPages, ...categoryUrls, ...productUrls]

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
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  })
}