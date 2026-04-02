import type { AdminProduct } from "./ProductGroupDashboard"
import ProductGroupDashboard from "./ProductGroupDashboard"

async function fetchAllWPProducts(): Promise<AdminProduct[]> {
  const wpBase = process.env.WP_API_URL?.replace(/\/+$/, "")
  const username = process.env.WP_USERNAME
  const password = process.env.WP_APP_PASSWORD

  if (!wpBase || !username || !password) return []

  const credentials = Buffer.from(`${username}:${password}`).toString("base64")

  const results: AdminProduct[] = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const url = `${wpBase}/wp-json/wp/v2/product?per_page=100&page=${page}`
    const res = await fetch(url, {
      headers: { Authorization: `Basic ${credentials}` },
      next: { revalidate: 0 },
    })

    if (!res.ok) break

    const items = await res.json()
    totalPages = parseInt(res.headers.get("X-WP-TotalPages") ?? "1", 10)

    for (const item of items) {
      const acf = item.acf ?? {}

      results.push({
        id: item.id,
        slug: item.slug,
        nameTh: acf.name_th || item.title?.rendered || item.slug,
        nameEn: acf.name_en || "",
        image: item.featured_image_url ?? "",
        categoryIds: Array.isArray(item.product_category) ? item.product_category : [],
        familyNameTh: acf.family_name_th ?? "",
        familyNameEn: acf.family_name_en ?? "",
      })
    }

    page++
  }

  return results
}

export default async function AdminProductsPage() {
  const products = await fetchAllWPProducts()
  return <ProductGroupDashboard products={products} />
}
