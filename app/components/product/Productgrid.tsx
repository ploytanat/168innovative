'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowDownAZ, ArrowUpAZ, Search, X } from 'lucide-react'

import { ProductView } from '@/app/lib/types/view'

interface Props {
  products: ProductView[]
  categorySlug: string
  totalCount: number
  locale?: 'th' | 'en'
}

type SortOrder = 'default' | 'asc' | 'desc'

const i18n = {
  th: {
    searchPlaceholder: 'ค้นหาสินค้า...',
    clearSearch: 'ล้างคำค้นหา',
    sortLabel: 'เรียงชื่อ',
    sortAsc: 'ก → ฮ',
    sortDesc: 'ฮ → ก',
    results: 'ผลลัพธ์',
    items: 'รายการ',
    noProducts: 'ไม่พบสินค้า',
    clearFilters: 'ล้างตัวกรอง',
  },
  en: {
    searchPlaceholder: 'Search products...',
    clearSearch: 'Clear search',
    sortLabel: 'Sort name',
    sortAsc: 'A → Z',
    sortDesc: 'Z → A',
    results: 'results',
    items: 'items',
    noProducts: 'No products found',
    clearFilters: 'Clear filters',
  },
}

export default function ProductGrid({
  products,
  categorySlug,
  totalCount,
  locale = 'th',
}: Props) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOrder>('default')
  const t = i18n[locale]

  const filtered = useMemo(() => {
    let result = [...products]

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
  }, [products, query, sort, locale])

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

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A7E74]" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-full border border-[#DDD4CC] bg-white/90 py-3 pl-11 pr-11 text-sm text-[#1A2535] shadow-sm outline-none transition-all placeholder:text-[#AA9D92] focus:border-[#14B8A6] focus:ring-4 focus:ring-[#14B8A6]/10"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t.clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[#7B6F66] transition-colors hover:bg-[#F3EEE8] hover:text-[#1A2535]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={cycleSort}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition-all ${
              sort !== 'default'
                ? 'border-[#14B8A6] bg-[#EAF9F7] text-[#0E7C72]'
                : 'border-[#DDD4CC] bg-white text-[#6F655D] hover:border-[#14B8A6] hover:text-[#1A2535]'
            }`}
          >
            <SortIcon className="h-4 w-4" />
            {sortLabel}
          </button>

          <div className="rounded-full border border-[#E3DBD3] bg-white px-4 py-3 text-xs font-semibold text-[#1A2535] shadow-sm">
            {displayCount}
            <span className="ml-1 font-medium text-[#8A7E74]">
              {isSearching ? t.results : t.items}
            </span>
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="rounded-[2rem] border border-[#E6DED6] bg-white px-6 py-24 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4EEE8]">
            <Search className="h-6 w-6 text-[#8D8177]" />
          </div>
          <p className="text-sm font-semibold text-[#1A2535]">{t.noProducts}</p>
          <p className="mt-2 text-sm text-[#7D7269]">
            {locale === 'th' ? 'ลองค้นหาด้วยคำอื่น หรือ ' : 'Try another keyword or '}
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={
                locale === 'en'
                  ? `/en/categories/${categorySlug}/${product.slug}`
                  : `/categories/${categorySlug}/${product.slug}`
              }
              className="group overflow-hidden rounded-[1.75rem] border border-[#E6DED6] bg-white p-2 shadow-[0_12px_35px_rgba(26,37,53,0.05)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(26,37,53,0.1)]"
            >
              <div className="relative aspect-square overflow-hidden rounded-[1.25rem] bg-[#F2ECE5]">
                {product.image?.src ? (
                  <Image
                    src={product.image.src}
                    alt={product.image.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[#A3968C]">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A2535]/14 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              <div className="px-2 pb-3 pt-4">
                <h2 className="text-sm font-semibold leading-snug text-[#1A2535] transition-colors group-hover:text-[#14B8A6]">
                  {product.name}
                </h2>
                <div className="mt-3 h-px w-10 bg-[#E2D7CE] transition-all duration-300 group-hover:w-16 group-hover:bg-[#14B8A6]" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
