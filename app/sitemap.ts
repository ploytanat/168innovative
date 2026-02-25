import { MetadataRoute } from "next"

const BASE = "https://168innovative.co.th"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

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

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                  priority: 1.0, changeFrequency: 'weekly'  },
    { url: `${BASE}/categories`,  priority: 0.9, changeFrequency: 'weekly'  },
    { url: `${BASE}/about`,       priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE}/contact`,     priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE}/articles`,    priority: 0.6, changeFrequency: 'weekly'  },
  ]

  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat: any) => ({
    url: `${BASE}/categories/${cat.slug}`,
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }))

  const productUrls: MetadataRoute.Sitemap = products
    .filter((p: any) => p.product_category?.length)
    .map((p: any) => ({
      url: `${BASE}/categories/${categoryMap[p.product_category[0]]}/${p.slug}`,
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    }))

  return [
    ...staticPages,
    ...categoryUrls,
    ...productUrls,
  ]
}