// app/lib/api/products.ts

import { unstable_cache } from 'next/cache'
import { Locale, WPProduct } from '../types/content'
import { ProductView, ProductSpecView } from '../types/view'

const BASE = process.env.WP_API_URL
if (!BASE) throw new Error('WP_API_URL is not defined')

/* ─────────────────────────────────────────────
   Spec label i18n map
   ───────────────────────────────────────────── */
const SPEC_LABELS: Record<string, { th: string; en: string }> = {
  model:             { th: 'รุ่น',              en: 'Model' },
  inner_diameter_mm: { th: 'เส้นผ่านศูนย์กลาง', en: 'Inner Diameter' },
  material:          { th: 'วัสดุ',             en: 'Material' },
  application:       { th: 'การใช้งาน',         en: 'Application' },
  valve_type:        { th: 'ประเภทวาล์ว',       en: 'Valve Type' },
  size_mm:           { th: 'ขนาด',             en: 'Size' },
  size:              { th: 'ขนาด',             en: 'Size' },
  length_mm:         { th: 'ความยาว',           en: 'Length' },
  set_includes:      { th: 'ชุดประกอบด้วย',     en: 'Set Includes' },
  alternate_model:   { th: 'รุ่นอื่นที่รู้จัก', en: 'Also Known As' },
}
const SPEC_EXCLUDE = new Set(['application'])

function formatSpecValue(key: string, value: unknown): string {
  if (Array.isArray(value)) return value.join(', ')
  if (['inner_diameter_mm', 'size_mm', 'length_mm'].includes(key))
    return `${value} mm`
  return String(value)
}

/* ─────────────────────────────────────────────
   Parse specs_json
   WordPress ACF escapes quotes: {\"model\":...}
   ───────────────────────────────────────────── */
function parseSpecsJson(raw: unknown): Record<string, unknown> | null {
  if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
    return raw as Record<string, unknown>
  }
  if (typeof raw !== 'string' || !raw.trim()) return null

  let str = raw.trim()
  if (str.includes('\\"')) {
    str = str.replace(/\\"/g, '"')
    if (str.startsWith('"') && str.endsWith('"')) str = str.slice(1, -1)
  }

  try {
    const parsed = JSON.parse(str)
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null
  } catch {
    return null
  }
}

/* ─────────────────────────────────────────────
   Core fetch
   ───────────────────────────────────────────── */
async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`Fetch failed: ${url}`)
  return res.json() as Promise<T>
}

/* ─────────────────────────────────────────────
   Cached fetchers
   
   ✅ unstable_cache ต้องอยู่ระดับ module
      ไม่ใช่สร้างใหม่ทุกครั้งที่ call function
      
   Pattern: cachedFn = unstable_cache(fn, key, opts)
            แล้วค่อย export function ที่ call cachedFn
   ───────────────────────────────────────────── */

// Category map { id → slug }
const _getCategoryMap = unstable_cache(
  async (): Promise<Record<number, string>> => {
    const terms = await fetchJSON<{ id: number; slug: string }[]>(
      `${BASE}/wp-json/wp/v2/product_category?per_page=100`
    )
    return Object.fromEntries(terms.map((t) => [t.id, t.slug]))
  },
  ['category-map'],
  { revalidate: 3600, tags: ['categories'] }
)

// Category ID by slug
const _getCategoryIdBySlug = unstable_cache(
  async (slug: string): Promise<number | null> => {
    const terms = await fetchJSON<{ id: number }[]>(
      `${BASE}/wp-json/wp/v2/product_category?slug=${slug}`
    )
    return terms[0]?.id ?? null
  },
  ['category-id-by-slug'],
  { revalidate: 3600, tags: ['categories'] }
)

// Products list (homepage)
const _getProductsRaw = unstable_cache(
  async (): Promise<WPProduct[]> =>
    fetchJSON<WPProduct[]>(`${BASE}/wp-json/wp/v2/product?per_page=8`),
  ['products-raw-list'],
  { revalidate: 3600, tags: ['products'] }
)

// Products by category ID
const _getProductsByCategoryId = unstable_cache(
  async (categoryId: number): Promise<WPProduct[]> =>
    fetchJSON<WPProduct[]>(
      `${BASE}/wp-json/wp/v2/product?product_category=${categoryId}&per_page=100`
    ),
  ['products-raw-by-category'],
  { revalidate: 3600, tags: ['products'] }
)

// Single product by slug
const _getProductRaw = unstable_cache(
  async (slug: string): Promise<WPProduct[]> =>
    fetchJSON<WPProduct[]>(`${BASE}/wp-json/wp/v2/product?slug=${slug}`),
  ['product-raw-by-slug'],
  { revalidate: 3600, tags: ['products'] }
)

/* ─────────────────────────────────────────────
   Mapper
   ───────────────────────────────────────────── */
function mapWPToProductView(
  wp: WPProduct,
  locale: Locale,
  catMap: Record<number, string>
): ProductView {
  const parsedSpecs = parseSpecsJson(wp.acf?.specs_json)
  const specs: ProductSpecView[] = parsedSpecs
    ? Object.entries(parsedSpecs)
        .filter(([key]) => !SPEC_EXCLUDE.has(key))
        .map(([key, value]) => ({
          label:
            SPEC_LABELS[key]?.[locale] ??
            key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          value: formatSpecValue(key, value),
        }))
    : []

  const categoryId = wp.product_category?.[0] ?? 0

  return {
    id: wp.id.toString(),
    slug: wp.slug,
    name:
      locale === 'th'
        ? (wp.acf?.name_th ?? wp.title.rendered)
        : (wp.acf?.name_en ?? wp.title.rendered),
    description:
      locale === 'th'
        ? (wp.acf?.description_th ?? '')
        : (wp.acf?.description_en ?? ''),
    image: {
      src: wp.featured_image_url ?? '/images/placeholder.webp',
      alt:
        locale === 'th'
          ? (wp.acf?.image_alt_th ?? wp.title.rendered)
          : (wp.acf?.image_alt_en ?? wp.title.rendered),
    },
    categoryId: categoryId.toString(),
    categorySlug: catMap[categoryId] ?? '',
    specs,
    price: undefined,
  }
}

/* ─────────────────────────────────────────────
   Public API
   ───────────────────────────────────────────── */

export async function getProducts(locale: Locale): Promise<ProductView[]> {
  const [raw, catMap] = await Promise.all([
    _getProductsRaw(),
    _getCategoryMap(),
  ])
  return raw.map((wp) => mapWPToProductView(wp, locale, catMap))
}

export async function getProductsByCategory(
  slug: string,
  locale: Locale
): Promise<ProductView[]> {
  const [categoryId, catMap] = await Promise.all([
    _getCategoryIdBySlug(slug),
    _getCategoryMap(),
  ])
  if (!categoryId) return []

  const raw = await _getProductsByCategoryId(categoryId)
  return raw.map((wp) => mapWPToProductView(wp, locale, catMap))
}

export async function getProductBySlug(
  slug: string,
  locale: Locale
): Promise<ProductView | null> {
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
): Promise<ProductView[]> {
  const all = await getProductsByCategory(categorySlug, locale)
  return all.filter((p) => p.id !== currentProductId).slice(0, 4)
}