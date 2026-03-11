"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowDownAZ, ArrowUpAZ, Search, X } from 'lucide-react'

import { ProductView } from '@/app/lib/types/view'

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
    sortLabel: 'เรียงชื่อ',
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

function getTone(locale: 'th' | 'en') {
  if (locale === 'en') {
    return {
      searchIcon: 'text-[#847A71]',
      searchBorder: 'border-[#DED8D1]',
      searchBg: 'bg-white',
      searchPlaceholder: 'placeholder:text-[#9A8E84]',
      clearButton: 'text-[#7E746C] hover:bg-[#F4F1ED]',
      idleButton: 'border-[#DED8D1] bg-white text-[#70665E] hover:border-[#14B8A6] hover:text-[#1A2535]',
      countBorder: 'border-[#E6E0D9]',
      mutedText: 'text-[#81766E]',
      emptyBorder: 'border-[#E8E2DB]',
      emptyIconBg: 'bg-[#F6F2EE]',
      emptyIcon: 'text-[#8E837A]',
      cardBorder: 'border-[#E7E1D9]',
      cardShadow: 'shadow-[0_12px_35px_rgba(26,37,53,0.05)]',
      cardHoverShadow: 'hover:shadow-[0_24px_55px_rgba(26,37,53,0.1)]',
      imageBg: 'bg-[#F5F1EC]',
      imageFallback: 'text-[#A2958A]',
      divider: 'bg-[#E4DCD3]',
    }
  }

  return {
    searchIcon: 'text-[#8A7E74]',
    searchBorder: 'border-[#DDD4CC]',
    searchBg: 'bg-white/90',
    searchPlaceholder: 'placeholder:text-[#AA9D92]',
    clearButton: 'text-[#7B6F66] hover:bg-[#F3EEE8]',
    idleButton: 'border-[#DDD4CC] bg-white text-[#6F655D] hover:border-[#14B8A6] hover:text-[#1A2535]',
    countBorder: 'border-[#E3DBD3]',
    mutedText: 'text-[#8A7E74]',
    emptyBorder: 'border-[#E6DED6]',
    emptyIconBg: 'bg-[#F4EEE8]',
    emptyIcon: 'text-[#8D8177]',
    cardBorder: 'border-[#E6DED6]',
    cardShadow: 'shadow-[0_12px_35px_rgba(26,37,53,0.05)]',
    cardHoverShadow: 'hover:shadow-[0_24px_55px_rgba(26,37,53,0.1)]',
    imageBg: 'bg-[#F2ECE5]',
    imageFallback: 'text-[#A3968C]',
    divider: 'bg-[#E2D7CE]',
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
  const tone = getTone(locale)

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
    <div>
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
            className={`w-full rounded-full border ${tone.searchBorder} ${tone.searchBg} py-3 pl-11 pr-11 text-sm text-[#1A2535] shadow-sm outline-none transition-all ${tone.searchPlaceholder} focus:border-[#14B8A6] focus:ring-4 focus:ring-[#14B8A6]/10`}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t.clearSearch}
              className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 transition-colors ${tone.clearButton} hover:text-[#1A2535]`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3.5">
          <button
            type="button"
            onClick={cycleSort}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition-all ${
              sort !== 'default'
                ? 'border-[#14B8A6] bg-[#EAF9F7] text-[#0E7C72]'
                : tone.idleButton
            }`}
          >
            <SortIcon className="h-4 w-4" />
            {sortLabel}
          </button>

          <div
            className={`rounded-full border ${tone.countBorder} bg-white px-4 py-3 text-xs font-semibold text-[#1A2535] shadow-sm`}
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
          className={`rounded-[2rem] border ${tone.emptyBorder} bg-white px-6 py-24 text-center shadow-sm`}
        >
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${tone.emptyIconBg}`}
          >
            <Search className={`h-6 w-6 ${tone.emptyIcon}`} />
          </div>
          <p className="text-sm font-semibold text-[#1A2535]">{t.noProducts}</p>
          <p className={`mt-2 text-sm ${tone.mutedText}`}>
            {t.emptyHint}
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setSort('default')
              }}
              className="font-semibold text-[#14B8A6] underline underline-offset-4"
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
              className={`group overflow-hidden rounded-[1.75rem] border ${tone.cardBorder} bg-white p-2.5 ${tone.cardShadow} transition-all duration-500 hover:-translate-y-1.5 ${tone.cardHoverShadow}`}
            >
              <div
                className={`relative aspect-square overflow-hidden rounded-[1.25rem] ${tone.imageBg}`}
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
                <h2 className="text-sm font-semibold leading-[1.5] text-[#1A2535] transition-colors group-hover:text-[#14B8A6]">
                  {product.name}
                </h2>
                <div
                  className={`mt-3.5 h-px w-10 ${tone.divider} transition-all duration-300 group-hover:w-16 group-hover:bg-[#14B8A6]`}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
