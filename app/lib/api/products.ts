// app/lib/api/products.ts

import { unstable_cache } from 'next/cache'
import { Locale, WPProduct } from '../types/content'
import { ProductView, ProductSpecView } from '../types/view'

const BASE = process.env.WP_API_URL
if (!BASE) throw new Error('WP_API_URL is not defined')

/* ─────────────────────────────
   Shared fields (ลด payload)
   ───────────────────────────── */

const PRODUCT_FIELDS =
  'id,slug,title,acf,featured_image_url,product_category'

/* ─────────────────────────────
   Utils
   ───────────────────────────── */

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Fetch failed: ${url}`)
  return res.json() as Promise<T>
}

/* ─────────────────────────────
   Category Map (cached)
   ───────────────────────────── */

const _getCategoryMap = unstable_cache(
  async (): Promise<Record<number, string>> => {
    const terms = await fetchJSON<{ id: number; slug: string }[]>(
      `${BASE}/wp-json/wp/v2/product_category?_fields=id,slug&per_page=100`
    )
    return Object.fromEntries(terms.map((t) => [t.id, t.slug]))
  },
  ['category-map-v2'],
  { revalidate: 3600, tags: ['categories'] }
)

const _getCategoryIdBySlug = unstable_cache(
  async (slug: string): Promise<number | null> => {
    const terms = await fetchJSON<{ id: number }[]>(
      `${BASE}/wp-json/wp/v2/product_category?slug=${slug}&_fields=id`
    )
    return terms[0]?.id ?? null
  },
  ['category-id-v2'],
  { revalidate: 3600, tags: ['categories'] }
)

/* ─────────────────────────────
   Products Fetchers (optimized)
   ───────────────────────────── */

// Homepage products (limit small)
const _getProductsRaw = unstable_cache(
  async (): Promise<WPProduct[]> =>
    fetchJSON<WPProduct[]>(
      `${BASE}/wp-json/wp/v2/product?per_page=8&_fields=${PRODUCT_FIELDS}`
    ),
  ['products-home-v2'],
  { revalidate: 3600, tags: ['products'] }
)

// Products by category (limit only needed)
const _getProductsByCategoryId = unstable_cache(
  async (categoryId: number): Promise<WPProduct[]> =>
    fetchJSON<WPProduct[]>(
      `${BASE}/wp-json/wp/v2/product?product_category=${categoryId}&per_page=24&_fields=${PRODUCT_FIELDS}`
    ),
  ['products-category-v2'],
  { revalidate: 3600, tags: ['products'] }
)

// Single product
const _getProductRaw = unstable_cache(
  async (slug: string): Promise<WPProduct[]> =>
    fetchJSON<WPProduct[]>(
      `${BASE}/wp-json/wp/v2/product?slug=${slug}&_fields=${PRODUCT_FIELDS}`
    ),
  ['product-single-v2'],
  { revalidate: 3600, tags: ['products'] }
)

// Related (ดึงแค่ 4 ตัว ไม่โหลดทั้งหมวด)
const _getRelatedRaw = unstable_cache(
  async (categoryId: number): Promise<WPProduct[]> =>
    fetchJSON<WPProduct[]>(
      `${BASE}/wp-json/wp/v2/product?product_category=${categoryId}&per_page=5&_fields=${PRODUCT_FIELDS}`
    ),
  ['products-related-v2'],
  { revalidate: 3600, tags: ['products'] }
)

/* ─────────────────────────────
   Mapper
   ───────────────────────────── */

function mapWPToProductView(
  wp: WPProduct,
  locale: Locale,
  catMap: Record<number, string>
): ProductView {
  const parsedSpecs =
    typeof wp.acf?.specs_json === 'string'
      ? JSON.parse(wp.acf.specs_json.replace(/\\"/g, '"'))
      : wp.acf?.specs_json ?? null

  const specs: ProductSpecView[] = parsedSpecs
    ? Object.entries(parsedSpecs).map(([key, value]) => ({
        label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        value: Array.isArray(value) ? value.join(', ') : String(value),
      }))
    : []

  const categoryId = wp.product_category?.[0] ?? 0

  return {
    id: wp.id.toString(),
    slug: wp.slug,
    name:
      locale === 'th'
        ? wp.acf?.name_th ?? wp.title.rendered
        : wp.acf?.name_en ?? wp.title.rendered,
    description:
      locale === 'th'
        ? wp.acf?.description_th ?? ''
        : wp.acf?.description_en ?? '',
    image: {
      src: wp.featured_image_url ?? '/images/placeholder.webp',
      alt: wp.title.rendered,
    },
    categoryId: categoryId.toString(),
    categorySlug: catMap[categoryId] ?? '',
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
  locale: Locale
) {
  const categoryId = await _getCategoryIdBySlug(slug)
  if (!categoryId) return []

  const [raw, catMap] = await Promise.all([
    _getProductsByCategoryId(categoryId),
    _getCategoryMap(),
  ])

  return raw.map((wp) => mapWPToProductView(wp, locale, catMap))
}

export async function getProductBySlug(
  slug: string,
  locale: Locale
) {
  const raw = await _getProductRaw(slug)
  if (!raw.length) return null

  const catMap = await _getCategoryMap()
  return mapWPToProductView(raw[0], locale, catMap)
}

export async function getRelatedProducts(
  categorySlug: string,
  currentProductId: string,
  locale: Locale
) {
  const categoryId = await _getCategoryIdBySlug(categorySlug)
  if (!categoryId) return []

  const raw = await _getRelatedRaw(categoryId)
  const catMap = await _getCategoryMap()

  return raw
    .filter((p) => p.id.toString() !== currentProductId)
    .slice(0, 4)
    .map((wp) => mapWPToProductView(wp, locale, catMap))
}