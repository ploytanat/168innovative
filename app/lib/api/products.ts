// app/lib/api/products.ts

import { Locale, WPProduct } from '../types/content'
import { ProductView, ProductSpecView } from '../types/view'

const BASE = process.env.WP_API_URL

if (!BASE) {
  throw new Error('WP_API_URL is not defined')
}

/* ─────────────────────────────────────────────
   Spec label i18n map
   key = JSON key from specs_json
   ───────────────────────────────────────────── */
const SPEC_LABELS: Record<string, { th: string; en: string }> = {
  model:              { th: 'รุ่น',               en: 'Model' },
  inner_diameter_mm:  { th: 'เส้นผ่านศูนย์กลาง',  en: 'Inner Diameter' },
  material:           { th: 'วัสดุ',              en: 'Material' },
  application:        { th: 'การใช้งาน',          en: 'Application' },
  valve_type:         { th: 'ประเภทวาล์ว',        en: 'Valve Type' },
  size_mm:            { th: 'ขนาด',              en: 'Size' },
  size:               { th: 'ขนาด',              en: 'Size' },
  length_mm:          { th: 'ความยาว',            en: 'Length' },
  set_includes:       { th: 'ชุดประกอบด้วย',      en: 'Set Includes' },
  alternate_model:    { th: 'รุ่นอื่นที่รู้จัก',  en: 'Also Known As' },
}

/* ─────────────────────────────────────────────
   Keys to exclude from specs display
   ───────────────────────────────────────────── */
const SPEC_EXCLUDE = new Set(['application'])

/* ─────────────────────────────────────────────
   Format spec value
   ───────────────────────────────────────────── */
function formatSpecValue(key: string, value: unknown, locale: Locale): string {
  if (Array.isArray(value)) return value.join(', ')
  if (key === 'inner_diameter_mm' || key === 'size_mm') return `${value} mm`
  if (key === 'length_mm') return `${value} mm`
  return String(value)
}

/* ─────────────────────────────────────────────
   Helper: fetch with cache strategy
   ───────────────────────────────────────────── */
async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate: 60 }, // ปรับเป็น 3600 เมื่อข้อมูลนิ่งแล้ว
    ...options,
  })

  if (!res.ok) throw new Error(`Fetch failed: ${url}`)
  return res.json() as Promise<T>
}

/* ─────────────────────────────────────────────
   Category slug cache
   ───────────────────────────────────────────── */
let categoryMap: Record<string, string> | null = null

async function getCategoryMap() {
  if (categoryMap) return categoryMap

  const terms = await fetchJSON<any[]>(
    `${BASE}/wp-json/wp/v2/product_category?per_page=100`
  )

  categoryMap = {}
  terms.forEach((term) => {
    categoryMap![term.id] = term.slug
  })

  return categoryMap
}

/* ─────────────────────────────────────────────
   Mapper: WPProduct → ProductView
   ───────────────────────────────────────────── */
function mapWPToProductView(
  wp: WPProduct,
  locale: Locale,
  catMap: Record<string, string>
): ProductView {

  /* ── Parse specs_json ── */
  let specs: ProductSpecView[] = []

  if (wp.acf?.specs_json) {
    try {
      const parsed = JSON.parse(wp.acf.specs_json)

      if (Array.isArray(parsed)) {
        // Legacy format: [{ label, value }]
        specs = parsed.map((s) => ({ label: s.label ?? '', value: s.value ?? '' }))
      } else if (typeof parsed === 'object' && parsed !== null) {
        // New format: flat object from our JSON schema
        specs = Object.entries(parsed)
          .filter(([key]) => !SPEC_EXCLUDE.has(key))
          .map(([key, value]) => ({
            label:
              SPEC_LABELS[key]?.[locale] ??
              key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            value: formatSpecValue(key, value, locale),
          }))
      }
    } catch {
      specs = []
    }
  }

  /* ── Category ── */
  const categoryId = wp.product_category?.[0]?.toString() ?? ''
  const categorySlug = categoryId ? (catMap[Number(categoryId)] ?? '') : ''

  /* ── Image ── */
  const imageSrc = wp.featured_image_url ?? '/images/placeholder.webp'
  const imageAlt =
    locale === 'th'
      ? (wp.acf?.image_alt_th ?? wp.title.rendered)
      : (wp.acf?.image_alt_en ?? wp.title.rendered)

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
    image: { src: imageSrc, alt: imageAlt },
    categoryId,
    categorySlug,
    specs,
    price: undefined,
  }
}

/* ─────────────────────────────────────────────
   Public API
   ───────────────────────────────────────────── */

export async function getProducts(locale: Locale): Promise<ProductView[]> {
  const [raw, catMap] = await Promise.all([
    fetchJSON<WPProduct[]>(`${BASE}/wp-json/wp/v2/product?per_page=8`),
    getCategoryMap(),
  ])
  return raw.map((wp) => mapWPToProductView(wp, locale, catMap))
}

export async function getProductsByCategory(
  slug: string,
  locale: Locale
): Promise<ProductView[]> {
  const [terms, catMap] = await Promise.all([
    fetchJSON<any[]>(`${BASE}/wp-json/wp/v2/product_category?slug=${slug}`),
    getCategoryMap(),
  ])

  if (!terms.length) return []

  const categoryId = terms[0].id
  const raw = await fetchJSON<WPProduct[]>(
    `${BASE}/wp-json/wp/v2/product?product_category=${categoryId}&per_page=100`
  )

  return raw.map((wp) => mapWPToProductView(wp, locale, catMap))
}

export async function getProductBySlug(
  slug: string,
  locale: Locale
): Promise<ProductView | null> {
  const [raw, catMap] = await Promise.all([
    fetchJSON<WPProduct[]>(`${BASE}/wp-json/wp/v2/product?slug=${slug}`),
    getCategoryMap(),
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