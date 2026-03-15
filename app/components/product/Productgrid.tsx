"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowDownAZ, ArrowUpAZ, Search, X } from 'lucide-react'

import { ProductView } from '@/app/lib/types/view'
import {
  COLORS,
  CTA_GRADIENT,
  GLASS,
  NAV_ACTIVE_PILL_STYLE,
  PAGE_BG,
  SOFT_IMAGE_BG,
} from '@/app/components/ui/designSystem'

interface Props {
  products: ProductView[]
  searchProducts: ProductView[]
  categorySlug: string
  totalCount: number
  locale?: 'th' | 'en'
  onSearchStateChange?: (isSearching: boolean) => void
}

type SortOrder = 'default' | 'asc' | 'desc'

const i18n = {
  th: {
       searchPlaceholder: 'ค้นหาสินค้า...',
    clearSearch: 'ล้างคำค้นหา',
    sortLabel: 'เรียงตามชื่อ',
    sortAsc: 'ก -> ฮ',
    sortDesc: 'ฮ -> ก',
    results: 'ผลลัพธ์',
    items: 'รายการ',
    noProducts: 'ไม่พบสินค้า',
    emptyHint: 'ลองค้นหาด้วยคำอื่น หรือ ',
    clearFilters: 'ล้างตัวกรอง',
  
  },
  en: {
    searchPlaceholder: 'Search products...',
    clearSearch: 'Clear search',
    sortLabel: 'Sort name',
    sortAsc: 'A -> Z',
    sortDesc: 'Z -> A',
    results: 'results',
    items: 'items',
    noProducts: 'No products found',
    emptyHint: 'Try another keyword or ',
    clearFilters: 'Clear filters',
  },
} as const

function getTone() {
  return {
    shell: 'rounded-[1rem] p-4 md:p-5',
    searchIcon: 'text-[#8a9aac]',
    searchPlaceholder: 'placeholder:text-[#8d98a9]',
    clearButton: 'text-[#5a6a7c] hover:bg-white/40',
    idleButton: 'text-[#597197]',
    mutedText: 'text-[#8a9aac]',
    emptyIconBg: 'bg-white/35',
    emptyIcon: 'text-[#8a95a4]',
    cardShadow: 'hover:shadow-[0_18px_36px_rgba(30,40,60,0.10)]',
    imageFallback: 'text-[#9aa4b2]',
    glow: 'from-white/10 via-transparent to-white/5',
  }
}

export default function ProductGrid({
  products,
  searchProducts,
  categorySlug,
  totalCount,
  locale = 'th',
  onSearchStateChange,
}: Props) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOrder>('default')
  const t = i18n[locale]
  const tone = getTone()

  const filtered = useMemo(() => {
    const source = query.trim() ? searchProducts : products
    let result = [...source]

    if (query.trim()) {
      const normalized = query.trim().toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(normalized) ||
          product.slug.toLowerCase().includes(normalized)
      )
    }

    if (sort === 'asc') {
      result.sort((a, b) =>
        a.name.localeCompare(b.name, locale === 'th' ? 'th' : 'en')
      )
    } else if (sort === 'desc') {
      result.sort((a, b) =>
        b.name.localeCompare(a.name, locale === 'th' ? 'th' : 'en')
      )
    }

    return result
  }, [products, searchProducts, query, sort, locale])

  const cycleSort = () => {
    setSort((state) =>
      state === 'default' ? 'asc' : state === 'asc' ? 'desc' : 'default'
    )
  }

  const sortLabel =
    sort === 'asc' ? t.sortAsc : sort === 'desc' ? t.sortDesc : t.sortLabel
  const SortIcon = sort === 'desc' ? ArrowUpAZ : ArrowDownAZ
  const isSearching = query.trim().length > 0
  const displayCount = isSearching ? filtered.length : totalCount

  useEffect(() => {
    onSearchStateChange?.(isSearching)
  }, [isSearching, onSearchStateChange])

  return (
    <div className={`relative overflow-hidden ${tone.shell}`} style={{ ...GLASS.secondary, background: PAGE_BG }}>
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.glow}`} />
      <div className="relative">
        <div className="mb-10 flex flex-col gap-4 md:mb-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search
              className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${tone.searchIcon}`}
            />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full rounded-[1rem] py-3 pl-11 pr-11 text-sm shadow-sm outline-none transition-all ${tone.searchPlaceholder}`}
              style={{ ...GLASS.card, color: COLORS.dark }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label={t.clearSearch}
                className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 transition-colors ${tone.clearButton}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={cycleSort}
              className={`inline-flex items-center gap-2 rounded-[1rem] px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] transition-all ${sort === 'default' ? tone.idleButton : ''}`}
              style={sort !== 'default' ? NAV_ACTIVE_PILL_STYLE : GLASS.card}
            >
              <SortIcon className="h-4 w-4" />
              {sortLabel}
            </button>

            <div
              className="rounded-[1rem] px-4 py-3 text-[13px] font-semibold shadow-sm"
              style={{ ...GLASS.stats, color: COLORS.dark }}
            >
              {displayCount}
              <span className={`ml-1 font-medium ${tone.mutedText}`}>
                {isSearching ? t.results : t.items}
              </span>
            </div>
          </div>
        </div>

        {filtered.length === 0 && (
          <div
            className="rounded-[1rem] px-6 py-24 text-center shadow-sm"
            style={GLASS.stats}
          >
            <div
              className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${tone.emptyIconBg}`}
            >
              <Search className={`h-6 w-6 ${tone.emptyIcon}`} />
            </div>
            <p className="text-sm font-semibold" style={{ color: COLORS.dark }}>{t.noProducts}</p>
            <p className={`mt-2 text-sm ${tone.mutedText}`}>
              {t.emptyHint}
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setSort('default')
                }}
                className="font-semibold underline underline-offset-4"
                style={{ color: COLORS.brandNavy }}
              >
                {t.clearFilters}
              </button>
            </p>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
            {filtered.map((product) => (
              <Link
                key={product.id}
                href={
                  locale === 'en'
                    ? `/en/categories/${categorySlug}/${product.slug}`
                    : `/categories/${categorySlug}/${product.slug}`
                }
                prefetch={false}
                className={`group overflow-hidden rounded-[1rem] p-2 transition-all duration-500 hover:-translate-y-1 ${tone.cardShadow}`}
                style={GLASS.card}
              >
                <div
                  className="relative aspect-square overflow-hidden rounded-[0.85rem]"
                  style={{ background: SOFT_IMAGE_BG }}
                >
                  {product.image?.src ? (
                    <Image
                      src={product.image.src}
                      alt={product.image.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className={`flex h-full items-center justify-center text-xs ${tone.imageFallback}`}
                    >
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A2535]/14 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                <div className="px-2.5 pb-4 pt-4.5 md:px-3 md:pb-4.5 md:pt-5">
                  <h2 className="text-sm font-semibold leading-[1.5] transition-colors group-hover:text-[#24457c]" style={{ color: COLORS.dark }}>
                    {product.name}
                  </h2>
                  <div
                    className="mt-3.5 h-px w-10 transition-all duration-300 group-hover:w-16"
                    style={{ background: CTA_GRADIENT }}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
