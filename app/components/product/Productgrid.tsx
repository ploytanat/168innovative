"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Eye,
  LayoutGrid,
  LayoutList,
  MessageSquarePlus,
  Package,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'

import { ProductView } from '@/app/lib/types/view'
import {
  COLORS,
  CTA_GRADIENT,
  GLASS,
  NAV_ACTIVE_PILL_STYLE,
  SECTION_BACKGROUNDS,
  SOFT_IMAGE_BG,
} from '@/app/components/ui/designSystem'

interface Props {
  products: ProductView[]
  searchProducts: ProductView[]
  categorySlug: string
  categoryName?: string
  totalCount: number
  locale?: 'th' | 'en'
  onSearchStateChange?: (isSearching: boolean) => void
}

type SortOrder = 'default' | 'asc' | 'desc'
type ViewMode = 'grid' | 'list'

const i18n = {
  th: {
    searchPlaceholder: 'ชื่อสินค้า หรือ รหัสสินค้า',
    clearSearch: 'ล้างคำค้นหา',
    clearAll: 'ล้างทั้งหมด',
    sortLabel: 'เรียงตามชื่อ',
    sortAsc: 'ก -> ฮ',
    sortDesc: 'ฮ -> ก',
    results: 'ผลลัพธ์',
    items: 'รายการ',
    noProducts: 'ไม่พบสินค้า',
    emptyHint: 'ลองค้นหาด้วยคำอื่น หรือ ',
    clearFilters: 'ล้างตัวกรอง',
    filters: 'กรองสินค้า',
    sizeLabel: 'ขนาด',
    catalog: 'PRODUCT CATALOG',
    relatedTitle: 'สินค้าที่พบถึง',
    viewDetail: 'ดูรายละเอียด',
    inquire: 'สอบถามราคา',
    variants: 'variants',
    filterBy: 'กรองตาม',
    activeFilters: 'ตัวกรองที่ใช้งาน',
    price: 'ราคา',
    specs: 'สเปก',
    quickView: 'ดูเร็ว',
    showFilters: 'แสดงตัวกรอง',
    hideFilters: 'ซ่อนตัวกรอง',
  },
  en: {
    searchPlaceholder: 'Product name or code...',
    clearSearch: 'Clear search',
    clearAll: 'Clear all',
    sortLabel: 'Sort name',
    sortAsc: 'A -> Z',
    sortDesc: 'Z -> A',
    results: 'results',
    items: 'items',
    noProducts: 'No products found',
    emptyHint: 'Try another keyword or ',
    clearFilters: 'Clear filters',
    filters: 'Filters',
    sizeLabel: 'Size',
    catalog: 'PRODUCT CATALOG',
    relatedTitle: 'Products found',
    viewDetail: 'View detail',
    inquire: 'Inquire price',
    variants: 'variants',
    filterBy: 'Filter by',
    activeFilters: 'Active filters',
    price: 'Price',
    specs: 'Specs',
    quickView: 'Quick view',
    showFilters: 'Show filters',
    hideFilters: 'Hide filters',
  },
} as const

function extractSizeFromSlug(slug: string): string | null {
  const match = slug.match(/-(\d+\s*mm?)$/i)
  return match ? match[1] : null
}

function getSlugBase(slug: string): string {
  return slug.replace(/-\d+\s*mm?$/i, '')
}

function buildVariantMap(products: ProductView[]): Map<string, ProductView[]> {
  const map = new Map<string, ProductView[]>()
  for (const p of products) {
    const base = getSlugBase(p.slug)
    if (!map.has(base)) map.set(base, [])
    map.get(base)!.push(p)
  }
  return map
}

function formatPrice(price: number, locale: 'th' | 'en') {
  return price.toLocaleString(locale === 'th' ? 'th-TH' : 'en-US', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
  })
}

// Sidebar panel — shared between desktop and mobile drawer
function FilterPanel({
  t,
  query,
  setQuery,
  allSizes,
  selectedSize,
  setSelectedSize,
  isFiltering,
  clearAll,
  filtered,
  categorySlug,
  locale,
}: {
  t: (typeof i18n)[keyof typeof i18n]
  query: string
  setQuery: (v: string) => void
  allSizes: string[]
  selectedSize: string | null
  setSelectedSize: (v: string | null) => void
  isFiltering: boolean
  clearAll: () => void
  filtered: ProductView[]
  categorySlug: string
  locale: 'th' | 'en'
}) {
  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-[1.1rem] p-5"
        style={{ ...GLASS.secondary, background: SECTION_BACKGROUNDS.cool }}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: COLORS.hint }}>
              FILTERS
            </p>
            <p className="text-sm font-bold" style={{ color: COLORS.dark }}>
              {t.filters}
            </p>
          </div>
          {isFiltering && (
            <button
              type="button"
              onClick={clearAll}
              className="rounded-full px-3 py-1 text-[11px] font-semibold transition-colors hover:bg-white/60"
              style={{ color: COLORS.brandNavy }}
            >
              {t.clearAll}
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
            style={{ color: COLORS.hint }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-[0.75rem] py-2.5 pl-9 pr-9 text-sm outline-none"
            style={{ ...GLASS.card, color: COLORS.dark }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t.clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-white/40"
            >
              <X className="h-3 w-3" style={{ color: COLORS.soft }} />
            </button>
          )}
        </div>

        {/* Size filter */}
        {allSizes.length > 0 && (
          <div>
            <p className="mb-2.5 text-xs font-semibold" style={{ color: COLORS.mid }}>
              {t.sizeLabel}
            </p>
            <div className="flex flex-wrap gap-2">
              {allSizes.map((size) => {
                const active = selectedSize === size
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(active ? null : size)}
                    className="rounded-[0.6rem] px-3 py-1.5 text-xs font-semibold transition-all"
                    style={
                      active
                        ? { background: COLORS.dark, color: '#fff', border: `1px solid ${COLORS.dark}` }
                        : { ...GLASS.card, color: COLORS.mid, border: '1px solid rgba(211,217,225,0.9)' }
                    }
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* สินค้าที่พบถึง */}
      {filtered.length > 0 && isFiltering && (
        <div className="rounded-[1.1rem] p-4" style={GLASS.stats}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: COLORS.hint }}>
            {t.relatedTitle}
          </p>
          <div className="flex flex-col gap-2">
            {filtered.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                href={locale === 'en' ? `/en/categories/${categorySlug}/${p.slug}` : `/categories/${categorySlug}/${p.slug}`}
                prefetch={false}
                className="group flex items-center gap-3 rounded-[0.75rem] p-2 transition-colors hover:bg-white/50"
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[0.5rem]" style={{ background: SOFT_IMAGE_BG }}>
                  {p.image?.src ? (
                    <Image src={p.image.src} alt={p.image.alt} fill sizes="40px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="h-4 w-4" style={{ color: COLORS.hint }} />
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium leading-snug group-hover:text-[#24457c]" style={{ color: COLORS.dark }}>
                  {p.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProductGrid({
  products,
  searchProducts,
  categorySlug,
  categoryName,
  totalCount,
  locale = 'th',
  onSearchStateChange,
}: Props) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOrder>('default')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const t = i18n[locale]

  const variantMap = useMemo(() => buildVariantMap(searchProducts), [searchProducts])

  const allSizes = useMemo(() => {
    const sizes = new Set<string>()
    for (const p of searchProducts) {
      const size = extractSizeFromSlug(p.slug)
      if (size) sizes.add(size)
    }
    return Array.from(sizes).sort()
  }, [searchProducts])

  const filtered = useMemo(() => {
    const source = query.trim() ? searchProducts : products
    let result = [...source]

    if (query.trim()) {
      const normalized = query.trim().toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(normalized) ||
          p.slug.toLowerCase().includes(normalized)
      )
    }

    if (selectedSize) {
      result = result.filter((p) => extractSizeFromSlug(p.slug) === selectedSize)
    }

    if (sort === 'asc') {
      result.sort((a, b) => a.name.localeCompare(b.name, locale === 'th' ? 'th' : 'en'))
    } else if (sort === 'desc') {
      result.sort((a, b) => b.name.localeCompare(a.name, locale === 'th' ? 'th' : 'en'))
    }

    return result
  }, [products, searchProducts, query, sort, selectedSize, locale])

  const isFiltering = query.trim().length > 0 || selectedSize !== null
  const displayCount = isFiltering ? filtered.length : totalCount

  useEffect(() => {
    onSearchStateChange?.(query.trim().length > 0)
  }, [query, onSearchStateChange])

  const clearAll = () => {
    setQuery('')
    setSort('default')
    setSelectedSize(null)
  }

  const cycleSort = () => {
    setSort((s) => (s === 'default' ? 'asc' : s === 'asc' ? 'desc' : 'default'))
  }

  const sortLabel = sort === 'asc' ? t.sortAsc : sort === 'desc' ? t.sortDesc : t.sortLabel
  const SortIcon = sort === 'desc' ? ArrowUpAZ : ArrowDownAZ

  const filterPanelProps = {
    t,
    query,
    setQuery,
    allSizes,
    selectedSize,
    setSelectedSize,
    isFiltering,
    clearAll,
    filtered,
    categorySlug,
    locale,
  }

  return (
    <>
      {/* Mobile filter drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          {/* Drawer */}
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[85dvh] overflow-y-auto rounded-t-[1.5rem] p-5"
            style={{ ...GLASS.primary, background: 'rgba(248,251,255,0.97)' }}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold" style={{ color: COLORS.dark }}>{t.filters}</p>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                aria-label={t.hideFilters}
                className="rounded-full p-2 transition-colors hover:bg-white/60"
              >
                <X className="h-4 w-4" style={{ color: COLORS.soft }} />
              </button>
            </div>
            <FilterPanel {...filterPanelProps} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* ─── Desktop Sidebar ─── */}
        <aside className="hidden lg:block lg:w-60 lg:shrink-0">
          <FilterPanel {...filterPanelProps} />
        </aside>

        {/* ─── Main Content ─── */}
        <div className="min-w-0 flex-1">
          {/* Header toolbar */}
          <div
            className="mb-5 rounded-[1.1rem] px-5 py-4"
            style={{ ...GLASS.secondary, background: SECTION_BACKGROUNDS.cool }}
          >
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: COLORS.hint }}>
              {t.catalog}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-heading text-xl font-bold sm:text-2xl" style={{ color: COLORS.dark }}>
                {categoryName ?? categorySlug}
              </h2>
              <div className="flex items-center gap-2">
                {/* Mobile filter toggle */}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-[0.75rem] px-3 py-2 text-[13px] font-semibold transition-all lg:hidden"
                  style={isFiltering ? NAV_ACTIVE_PILL_STYLE : { ...GLASS.card, color: COLORS.brandMuted }}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  {t.filters}
                  {isFiltering && (
                    <span
                      className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
                      style={{ background: COLORS.brandNavy }}
                    >
                      {(query.trim() ? 1 : 0) + (selectedSize ? 1 : 0)}
                    </span>
                  )}
                </button>

                {/* Count */}
                <div className="rounded-[0.75rem] px-3 py-2 text-[13px] font-semibold" style={{ ...GLASS.stats, color: COLORS.dark }}>
                  {displayCount}
                  <span className="ml-1 font-medium" style={{ color: COLORS.hint }}>
                    {isFiltering ? t.results : t.items}
                  </span>
                </div>

                {/* Sort */}
                <button
                  type="button"
                  onClick={cycleSort}
                  className="inline-flex items-center gap-1.5 rounded-[0.75rem] px-3 py-2 text-[13px] font-semibold transition-all"
                  style={sort !== 'default' ? NAV_ACTIVE_PILL_STYLE : { ...GLASS.card, color: COLORS.brandMuted }}
                >
                  <SortIcon className="h-3.5 w-3.5" />
                  {sortLabel}
                </button>

                {/* View toggle */}
                <div className="flex overflow-hidden rounded-[0.75rem]" style={{ ...GLASS.card }}>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className="p-2 transition-colors"
                    style={{ color: viewMode === 'grid' ? COLORS.brandNavy : COLORS.hint, background: viewMode === 'grid' ? 'rgba(255,255,255,0.7)' : 'transparent' }}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className="p-2 transition-colors"
                    style={{ color: viewMode === 'list' ? COLORS.brandNavy : COLORS.hint, background: viewMode === 'list' ? 'rgba(255,255,255,0.7)' : 'transparent' }}
                    aria-label="List view"
                  >
                    <LayoutList className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {isFiltering && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold" style={{ color: COLORS.hint }}>{t.activeFilters}:</span>
                {query.trim() && (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ background: 'rgba(36,69,124,0.10)', color: COLORS.brandNavy, border: '1px solid rgba(36,69,124,0.18)' }}
                  >
                    <Search className="h-3 w-3" />
                    &ldquo;{query.trim()}&rdquo;
                    <button type="button" onClick={() => setQuery('')} aria-label={t.clearSearch} className="ml-0.5 rounded-full transition-colors hover:bg-white/60">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                )}
                {selectedSize && (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ background: 'rgba(36,69,124,0.10)', color: COLORS.brandNavy, border: '1px solid rgba(36,69,124,0.18)' }}
                  >
                    {t.sizeLabel}: {selectedSize}
                    <button type="button" onClick={() => setSelectedSize(null)} aria-label={t.clearFilters} className="ml-0.5 rounded-full transition-colors hover:bg-white/60">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="rounded-[1rem] px-6 py-24 text-center" style={GLASS.stats}>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/35">
                <Search className="h-6 w-6" style={{ color: COLORS.hint }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: COLORS.dark }}>{t.noProducts}</p>
              <p className="mt-2 text-sm" style={{ color: COLORS.hint }}>
                {t.emptyHint}
                <button type="button" onClick={clearAll} className="font-semibold underline underline-offset-4" style={{ color: COLORS.brandNavy }}>
                  {t.clearFilters}
                </button>
              </p>
            </div>
          )}

          {/* Grid view */}
          {filtered.length > 0 && viewMode === 'grid' && (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
              {filtered.map((product, idx) => {
                const base = getSlugBase(product.slug)
                const siblings = (variantMap.get(base) ?? []).filter((v) => v.id !== product.id)
                const productSize = extractSizeFromSlug(product.slug)
                const hasVariants = siblings.length > 0
                const productUrl = locale === 'en'
                  ? `/en/categories/${categorySlug}/${product.slug}`
                  : `/categories/${categorySlug}/${product.slug}`
                const topSpecs = product.specs?.slice(0, 2) ?? []

                return (
                  <div
                    key={product.id}
                    className="group flex flex-col overflow-hidden rounded-[1rem] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(30,40,60,0.13)]"
                    style={{
                      ...GLASS.card,
                      animationDelay: `${idx * 40}ms`,
                    }}
                  >
                    {/* Image with hover overlay */}
                    <div className="relative aspect-square overflow-hidden rounded-t-[0.85rem]" style={{ background: SOFT_IMAGE_BG }}>
                      <Link href={productUrl} prefetch={false} className="block h-full w-full">
                        {product.image?.src ? (
                          <Image
                            src={product.image.src}
                            alt={product.image.alt}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package className="h-12 w-12 opacity-30" style={{ color: COLORS.soft }} />
                          </div>
                        )}
                      </Link>

                      {/* Hover overlay with quick actions */}
                      <div className="absolute inset-0 flex translate-y-2 flex-col items-center justify-end gap-2 pb-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,30,50,0.55) 0%, transparent 60%)' }} />
                        <div className="relative z-10 flex gap-2">
                          <Link
                            href={`${locale === 'en' ? '/en' : ''}/contact?product=${encodeURIComponent(product.name)}`}
                            prefetch={false}
                            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white transition-transform hover:scale-105"
                            style={{ background: 'rgba(255,255,255,0.20)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.35)' }}
                          >
                            <MessageSquarePlus className="h-3 w-3" />
                            {t.inquire}
                          </Link>
                          <Link
                            href={productUrl}
                            prefetch={false}
                            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white transition-transform hover:scale-105"
                            style={{ background: CTA_GRADIENT }}
                          >
                            <Eye className="h-3 w-3" />
                            {t.viewDetail}
                          </Link>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="absolute left-2 top-2 flex flex-col gap-1">
                        {hasVariants && (
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: 'rgba(26,34,50,0.75)', color: '#fff' }}>
                            {siblings.length + 1} {t.variants}
                          </span>
                        )}
                        {product.price != null && (
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: CTA_GRADIENT, color: '#fff' }}>
                            {formatPrice(product.price, locale)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="flex flex-1 flex-col px-3 pb-3.5 pt-3">
                      {/* Spec chips */}
                      {topSpecs.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1">
                          {topSpecs.map((spec) => (
                            <span
                              key={spec.label}
                              className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                              style={{ background: 'rgba(30,40,60,0.06)', color: COLORS.soft }}
                            >
                              {spec.label}: {spec.value}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Name */}
                      <Link href={productUrl} prefetch={false}>
                        <h2 className="text-sm font-semibold leading-snug transition-colors group-hover:text-[#24457c]" style={{ color: COLORS.dark }}>
                          {product.name}
                        </h2>
                      </Link>

                      {/* Description */}
                      {product.description && (
                        <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed" style={{ color: COLORS.hint }}>
                          {product.description}
                        </p>
                      )}

                      {/* Variant size buttons */}
                      {hasVariants && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {productSize && (
                            <Link
                              href={productUrl}
                              prefetch={false}
                              className="rounded-[0.5rem] px-2.5 py-1 text-[11px] font-semibold"
                              style={{ background: COLORS.dark, color: '#fff' }}
                            >
                              {productSize}
                            </Link>
                          )}
                          {siblings.map((sibling) => {
                            const siblingSize = extractSizeFromSlug(sibling.slug)
                            const siblingUrl = locale === 'en' ? `/en/categories/${categorySlug}/${sibling.slug}` : `/categories/${categorySlug}/${sibling.slug}`
                            return (
                              <Link
                                key={sibling.id}
                                href={siblingUrl}
                                prefetch={false}
                                className="rounded-[0.5rem] px-2.5 py-1 text-[11px] font-semibold transition-colors hover:bg-white/70"
                                style={{ ...GLASS.stats, color: COLORS.mid }}
                              >
                                {siblingSize ?? sibling.name}
                              </Link>
                            )
                          })}
                        </div>
                      )}

                      <div className="flex-1" />

                      {/* CTA row */}
                      <div className="mt-3 flex gap-2">
                        <Link
                          href={`${locale === 'en' ? '/en' : ''}/contact?product=${encodeURIComponent(product.name)}`}
                          prefetch={false}
                          className="flex flex-1 items-center justify-center gap-1 rounded-[0.6rem] py-2 text-[11px] font-semibold transition-colors hover:bg-white/70"
                          style={{ ...GLASS.stats, color: COLORS.mid }}
                        >
                          <MessageSquarePlus className="h-3 w-3" />
                          {t.inquire}
                        </Link>
                        <Link
                          href={productUrl}
                          prefetch={false}
                          className="flex flex-1 items-center justify-center gap-1 rounded-[0.6rem] py-2 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
                          style={{ background: CTA_GRADIENT }}
                        >
                          {t.viewDetail} &rsaquo;
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* List view */}
          {filtered.length > 0 && viewMode === 'list' && (
            <div className="flex flex-col gap-3">
              {filtered.map((product) => {
                const base = getSlugBase(product.slug)
                const siblings = (variantMap.get(base) ?? []).filter((v) => v.id !== product.id)
                const productSize = extractSizeFromSlug(product.slug)
                const productUrl = locale === 'en'
                  ? `/en/categories/${categorySlug}/${product.slug}`
                  : `/categories/${categorySlug}/${product.slug}`
                const topSpecs = product.specs?.slice(0, 3) ?? []

                return (
                  <div
                    key={product.id}
                    className="group flex gap-4 overflow-hidden rounded-[1rem] p-3 transition-all hover:shadow-[0_8px_24px_rgba(30,40,60,0.09)]"
                    style={GLASS.card}
                  >
                    {/* Image */}
                    <Link href={productUrl} prefetch={false} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[0.75rem]" style={{ background: SOFT_IMAGE_BG }}>
                      {product.image?.src ? (
                        <Image src={product.image.src} alt={product.image.alt} fill sizes="96px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="h-8 w-8 opacity-30" style={{ color: COLORS.soft }} />
                        </div>
                      )}
                    </Link>

                    {/* Content */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        {/* Spec chips row */}
                        {topSpecs.length > 0 && (
                          <div className="mb-1.5 flex flex-wrap items-center gap-1">
                            {topSpecs.map((spec) => (
                              <span
                                key={spec.label}
                                className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                                style={{ background: 'rgba(30,40,60,0.06)', color: COLORS.soft }}
                              >
                                {spec.label}: {spec.value}
                              </span>
                            ))}
                            {product.price != null && (
                              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: CTA_GRADIENT, color: '#fff' }}>
                                {formatPrice(product.price, locale)}
                              </span>
                            )}
                          </div>
                        )}
                        <Link href={productUrl} prefetch={false}>
                          <h2 className="text-sm font-semibold leading-snug transition-colors group-hover:text-[#24457c]" style={{ color: COLORS.dark }}>
                            {product.name}
                          </h2>
                        </Link>
                        {product.description && (
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed" style={{ color: COLORS.hint }}>
                            {product.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {/* Variant size buttons */}
                        {productSize && (
                          <span className="rounded-[0.5rem] px-2.5 py-1 text-[11px] font-semibold" style={{ background: COLORS.dark, color: '#fff' }}>
                            {productSize}
                          </span>
                        )}
                        {siblings.map((sibling) => {
                          const siblingSize = extractSizeFromSlug(sibling.slug)
                          const siblingUrl = locale === 'en' ? `/en/categories/${categorySlug}/${sibling.slug}` : `/categories/${categorySlug}/${sibling.slug}`
                          return (
                            <Link
                              key={sibling.id}
                              href={siblingUrl}
                              prefetch={false}
                              className="rounded-[0.5rem] px-2.5 py-1 text-[11px] font-semibold transition-colors hover:bg-white/70"
                              style={{ ...GLASS.stats, color: COLORS.mid }}
                            >
                              {siblingSize ?? sibling.name}
                            </Link>
                          )
                        })}

                        <div className="ml-auto flex gap-2">
                          <Link
                            href={`${locale === 'en' ? '/en' : ''}/contact?product=${encodeURIComponent(product.name)}`}
                            prefetch={false}
                            className="inline-flex items-center gap-1 rounded-[0.6rem] px-3 py-1.5 text-[11px] font-semibold transition-colors hover:bg-white/70"
                            style={{ ...GLASS.stats, color: COLORS.mid }}
                          >
                            <MessageSquarePlus className="h-3 w-3" />
                            {t.inquire}
                          </Link>
                          <Link
                            href={productUrl}
                            prefetch={false}
                            className="inline-flex items-center gap-1 rounded-[0.6rem] px-3 py-1.5 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
                            style={{ background: CTA_GRADIENT }}
                          >
                            {t.viewDetail} &rsaquo;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
