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

  const staticPages = [
    {
      url: BASE,
      lastModified: new Date(),
    },
    {
      url: `${BASE}/about`,
      lastModified: new Date(),
    },
    {
      url: `${BASE}/products`,
      lastModified: new Date(),
    },
  ]

  const categoryUrls = categories.map((cat: any) => ({
    url: `${BASE}/categories/${cat.slug}`,
    lastModified: new Date(),
  }))

  const productUrls = products
    .filter((p: any) => p.product_category?.length)
    .map((p: any) => ({
      url: `${BASE}/categories/${categoryMap[p.product_category[0]]}/${p.slug}`,
      lastModified: new Date(),
    }))

  return [
    ...staticPages,
    ...categoryUrls,
    ...productUrls,
  ]
}