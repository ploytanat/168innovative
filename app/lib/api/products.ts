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
   Parse specs_json safely
   
   WordPress ACF (textarea field) escapes quotes
   when serializing to REST API, producing:
     {\"model\":\"HL020\",\"inner_diameter_mm\":2}
   
   JSON.parse() fails on this because the
   backslash-escaped quotes are invalid JSON.
   
   Fix: replace \" with " before parsing.
   Also handles: already-parsed objects (ACF
   sometimes returns the object directly),
   and double-wrapped strings.
   ───────────────────────────────────────────── */
function parseSpecsJson(raw: unknown): Record<string, unknown> | null {
  // Already an object (ACF returned parsed value)
  if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
    return raw as Record<string, unknown>
  }

  if (typeof raw !== 'string' || !raw.trim()) return null

  let str = raw.trim()

  // WP escaped: {\"key\":\"value\"} → {"key":"value"}
  if (str.includes('\\"')) {
    str = str.replace(/\\"/g, '"')
    // Sometimes WP also wraps in outer quotes: "{\"key\":...}"
    if (str.startsWith('"') && str.endsWith('"')) {
      str = str.slice(1, -1)
    }
  }

  try {
    const parsed = JSON.parse(str)
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>
    }
    return null
  } catch {
    if (process.env.NODE_ENV === 'development') {
      console.error('[specs_json parse failed] str:', str)
    }
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
   Category map  { id → slug }
   ───────────────────────────────────────────── */
const getCategoryMap = unstable_cache(
  async (): Promise<Record<number, string>> => {
    const terms = await fetchJSON<{ id: number; slug: string }[]>(
      `${BASE}/wp-json/wp/v2/product_category?per_page=100`
    )
    return Object.fromEntries(terms.map((t) => [t.id, t.slug]))
  },
  ['category-map'],
  { revalidate: 3600, tags: ['categories'] }
)

/* ─────────────────────────────────────────────
   Category ID by slug
   ───────────────────────────────────────────── */
const getCategoryIdBySlug = unstable_cache(
  async (slug: string): Promise<number | null> => {
    const terms = await fetchJSON<{ id: number }[]>(
      `${BASE}/wp-json/wp/v2/product_category?slug=${slug}`
    )
    return terms[0]?.id ?? null
  },
  ['category-id-by-slug'],
  { revalidate: 3600, tags: ['categories'] }
)

/* ─────────────────────────────────────────────
   Mapper: WPProduct → ProductView
   ───────────────────────────────────────────── */
function mapWPToProductView(
  wp: WPProduct,
  locale: Locale,
  catMap: Record<number, string>
): ProductView {
  let specs: ProductSpecView[] = []

  const parsedSpecs = parseSpecsJson(wp.acf?.specs_json)
  if (parsedSpecs) {
    specs = Object.entries(parsedSpecs)
      .filter(([key]) => !SPEC_EXCLUDE.has(key))
      .map(([key, value]) => ({
        label:
          SPEC_LABELS[key]?.[locale] ??
          key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        value: formatSpecValue(key, value),
      }))
  }

  const categoryId = wp.product_category?.[0] ?? 0
  const categorySlug = catMap[categoryId] ?? ''

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
    categorySlug,
    specs,
    price: undefined,
  }
}

/* ─────────────────────────────────────────────
   Public API
   ───────────────────────────────────────────── */

export function getProducts(locale: Locale): Promise<ProductView[]> {
  return unstable_cache(
    async () => {
      const [raw, catMap] = await Promise.all([
        fetchJSON<WPProduct[]>(`${BASE}/wp-json/wp/v2/product?per_page=8`),
        getCategoryMap(),
      ])
      return raw.map((wp) => mapWPToProductView(wp, locale, catMap))
    },
    ['products-list', locale],
    { revalidate: 3600, tags: ['products'] }
  )()
}

export function getProductsByCategory(
  slug: string,
  locale: Locale
): Promise<ProductView[]> {
  return unstable_cache(
    async () => {
      const [categoryId, catMap] = await Promise.all([
        getCategoryIdBySlug(slug),
        getCategoryMap(),
      ])
      if (!categoryId) return []

      const raw = await fetchJSON<WPProduct[]>(
        `${BASE}/wp-json/wp/v2/product?product_category=${categoryId}&per_page=100`
      )
      return raw.map((wp) => mapWPToProductView(wp, locale, catMap))
    },
    ['products-by-category', slug, locale],
    { revalidate: 3600, tags: ['products'] }
  )()
}

export function getProductBySlug(
  slug: string,
  locale: Locale
): Promise<ProductView | null> {
  return unstable_cache(
    async () => {
      const [raw, catMap] = await Promise.all([
        fetchJSON<WPProduct[]>(`${BASE}/wp-json/wp/v2/product?slug=${slug}`),
        getCategoryMap(),
      ])
      if (!raw.length) return null
      return mapWPToProductView(raw[0], locale, catMap)
    },
    ['product-by-slug', slug, locale],
    { revalidate: 3600, tags: ['products'] }
  )()
}

export async function getRelatedProducts(
  categorySlug: string,
  currentProductId: string,
  locale: Locale
): Promise<ProductView[]> {
  const all = await getProductsByCategory(categorySlug, locale)
  return all.filter((p) => p.id !== currentProductId).slice(0, 4)
}