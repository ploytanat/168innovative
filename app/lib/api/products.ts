// app/lib/api/products.ts

import { unstable_cache } from "next/cache"
import { Locale, WPProduct } from "../types/content"
import { ProductView, ProductSpecView } from "../types/view"

const BASE = process.env.WP_API_URL
if (!BASE) throw new Error("WP_API_URL is not defined")

const PRODUCT_FIELDS =
  "id,slug,title,acf,featured_image_url,product_category"

/* ─────────────────────────────
   Fetch helpers
───────────────────────────── */

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`Fetch failed: ${url}`)
  return res.json()
}

/* ─────────────────────────────
   Category Map
───────────────────────────── */

const _getCategoryMap = unstable_cache(
  async (): Promise<Record<number, string>> => {
    const terms = await fetchJSON<{ id: number; slug: string }[]>(
      `${BASE}/wp-json/wp/v2/product_category?_fields=id,slug&per_page=100`
    )
    return Object.fromEntries(terms.map((t) => [t.id, t.slug]))
  },
  ["category-map-v5"],
  { revalidate: 3600, tags: ["categories"] }
)

function _getCategoryIdBySlug(slug: string): Promise<number | null> {
  return unstable_cache(
    async () => {
      const terms = await fetchJSON<{ id: number }[]>(
        `${BASE}/wp-json/wp/v2/product_category?slug=${slug}&_fields=id`
      )
      return terms[0]?.id ?? null
    },
    [`category-id-${slug}`],
    { revalidate: 3600, tags: ["categories"] }
  )()
}

/* ─────────────────────────────
   Homepage products (8 items)
───────────────────────────── */

const _getProductsRaw = unstable_cache(
  async (): Promise<WPProduct[]> =>
    fetchJSON<WPProduct[]>(
      `${BASE}/wp-json/wp/v2/product?per_page=8&_fields=${PRODUCT_FIELDS}`
    ),
  ["products-home-v5"],
  { revalidate: 3600, tags: ["products"] }
)

/* ─────────────────────────────
   Category products (pagination + prefetch)
───────────────────────────── */

function _getProductsByCategoryId(
  categoryId: number,
  page: number
): Promise<{ data: WPProduct[]; totalPages: number; totalCount: number }> {
  return unstable_cache(
    async () => {
      const res = await fetch(
        `${BASE}/wp-json/wp/v2/product?product_category=${categoryId}&per_page=15&page=${page}&_fields=${PRODUCT_FIELDS}`,
        { next: { revalidate: 3600 } }
      )
      if (!res.ok) throw new Error(`Fetch failed: category ${categoryId} page ${page}`)

      const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 1)
      const totalCount = Number(res.headers.get("X-WP-Total") ?? 0)


      // เพิ่มชั่วคราว
console.log('headers X-WP-Total:', res.headers.get("X-WP-Total"))
console.log('headers X-WP-TotalPages:', res.headers.get("X-WP-TotalPages"))
      const data = (await res.json()) as WPProduct[]

      return { data, totalPages, totalCount }
    },
    [`products-category-${categoryId}-p${page}`],
    { revalidate: 3600, tags: ["products"] }
  )()
}

/* ─────────────────────────────
   Single product
───────────────────────────── */

function _getProductRaw(slug: string): Promise<WPProduct[]> {
  return unstable_cache(
    async () =>
      fetchJSON<WPProduct[]>(
        `${BASE}/wp-json/wp/v2/product?slug=${slug}&_fields=${PRODUCT_FIELDS}`
      ),
    [`product-single-${slug}`],
    { revalidate: 3600, tags: ["products"] }
  )()
}

/* ─────────────────────────────
   Related products
───────────────────────────── */

function _getRelatedRaw(categoryId: number): Promise<WPProduct[]> {
  return unstable_cache(
    async () =>
      fetchJSON<WPProduct[]>(
        `${BASE}/wp-json/wp/v2/product?product_category=${categoryId}&per_page=5&_fields=${PRODUCT_FIELDS}`
      ),
    [`products-related-${categoryId}`],
    { revalidate: 3600, tags: ["products"] }
  )()
}

/* ─────────────────────────────
   Mapper
───────────────────────────── */

function mapWPToProductView(
  wp: WPProduct,
  locale: Locale,
  catMap: Record<number, string>
): ProductView {
  const parsedSpecs =
    typeof wp.acf?.specs_json === "string"
      ? JSON.parse(wp.acf.specs_json.replace(/\\"/g, '"'))
      : wp.acf?.specs_json ?? null

  const specs: ProductSpecView[] = parsedSpecs
    ? Object.entries(parsedSpecs).map(([key, value]) => ({
        label: key,
        value: Array.isArray(value) ? value.join(", ") : String(value),
      }))
    : []

  const categoryId = wp.product_category?.[0] ?? 0

  return {
    id: wp.id.toString(),
    slug: wp.slug,
    name:
      locale === "th"
        ? wp.acf?.name_th ?? wp.title.rendered
        : wp.acf?.name_en ?? wp.title.rendered,
    description:
      locale === "th"
        ? wp.acf?.description_th ?? ""
        : wp.acf?.description_en ?? "",
    image: {
      src: wp.featured_image_url ?? "/images/placeholder.webp",
      alt: wp.title.rendered,
    },
    categoryId: categoryId.toString(),
    categorySlug: catMap[categoryId] ?? "",
    specs,
    price: undefined,
  }
}

/* ─────────────────────────────
   Public API
───────────────────────────── */

export async function getProducts(locale: Locale) {
  const [raw, catMap] = await Promise.all([
    _getProductsRaw(),
    _getCategoryMap(),
  ])

  return raw.map((wp) => mapWPToProductView(wp, locale, catMap))
}

export async function getProductsByCategory(
  slug: string,
  locale: Locale,
  page: number = 1
) {
  const [categoryId, catMap] = await Promise.all([
    _getCategoryIdBySlug(slug),
    _getCategoryMap(),
  ])

  if (!categoryId) {
    return { products: [], totalPages: 1, totalCount: 0 }
  }

  const { data, totalPages, totalCount } = await _getProductsByCategoryId(categoryId, page)

  // 🔥 Prefetch หน้าถัดไปใน background — user กดปุ๊บได้เลย
  if (page < totalPages) {
    _getProductsByCategoryId(categoryId, page + 1).catch(() => {})
  }
    console.log('จำนวนสินค้าทั้งหมด : ', totalCount)
  return {
    products: data.map((wp) => mapWPToProductView(wp, locale, catMap)),
    totalPages,
    totalCount,

  }
  
}

export async function getProductBySlug(slug: string, locale: Locale) {
  const [raw, catMap] = await Promise.all([
    _getProductRaw(slug),
    _getCategoryMap(),
  ])

  if (!raw.length) return null

  return mapWPToProductView(raw[0], locale, catMap)
}

export async function getRelatedProducts(
  categorySlug: string,
  currentProductId: string,
  locale: Locale
) {
  const [categoryId, catMap] = await Promise.all([
    _getCategoryIdBySlug(categorySlug),
    _getCategoryMap(),
  ])

  if (!categoryId) return []

  const raw = await _getRelatedRaw(categoryId)

  return raw
    .filter((p) => p.id.toString() !== currentProductId)
    .slice(0, 4)
    .map((wp) => mapWPToProductView(wp, locale, catMap))
}