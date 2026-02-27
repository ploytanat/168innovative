'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ArrowDownAZ, ArrowUpAZ, X } from 'lucide-react'
import { ProductView } from '@/app/lib/types/view'

interface Props {
  products: ProductView[]
  categorySlug: string
  totalCount: number
}

type SortOrder = 'default' | 'asc' | 'desc'

export default function ProductGrid({ products, categorySlug, totalCount }: Props) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOrder>('default')

  const filtered = useMemo(() => {
    let result = [...products]

    if (query.trim()) {
      const q = query.trim().toLowerCase()
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
      )
    }

    if (sort === 'asc') {
      result.sort((a, b) => a.name.localeCompare(b.name, 'th'))
    } else if (sort === 'desc') {
      result.sort((a, b) => b.name.localeCompare(a.name, 'th'))
    }

    return result
  }, [products, query, sort])

  const cycleSort = () => {
    setSort((s) => s === 'default' ? 'asc' : s === 'asc' ? 'desc' : 'default')
  }

  const sortLabel = sort === 'asc' ? 'ก → ฮ' : sort === 'desc' ? 'ฮ → ก' : 'เรียงชื่อ'
  const SortIcon = sort === 'desc' ? ArrowUpAZ : ArrowDownAZ

  const isSearching = query.trim().length > 0
  const displayCount = isSearching ? filtered.length : totalCount

  return (
    <div>
      {/* ── Toolbar ── */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาสินค้า..."
            className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-10 text-sm text-slate-900 placeholder-slate-500 shadow-sm outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="ล้างคำค้นหา"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Sort + Count */}
        <div className="flex items-center gap-3">
          <button
            onClick={cycleSort}
            className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-bold transition-all ${
              sort !== 'default'
                ? 'border-teal-500 bg-teal-50 text-teal-600'
                : 'border-slate-300 bg-white text-slate-700 hover:border-teal-500 hover:text-teal-600'
            }`}
          >
            <SortIcon className="h-4 w-4" />
            {sortLabel}
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700">
            {displayCount}
            <span className="ml-1 font-normal text-slate-600">
              {isSearching ? 'ผลลัพธ์' : 'รายการ'}
            </span>
          </div>
        </div>
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center border border-slate-300 rounded-2xl">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">
            <Search className="h-7 w-7 text-slate-600" />
          </div>
          <p className="text-sm font-semibold text-slate-900">ไม่พบสินค้า</p>
          <p className="mt-1 text-sm text-slate-600">
            ลองค้นหาด้วยคำอื่น หรือ{' '}
            <button
              onClick={() => { setQuery(''); setSort('default') }}
              className="text-teal-600 underline underline-offset-2"
            >
              ล้างตัวกรอง
            </button>
          </p>
        </div>
      )}

      {/* Product grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 border-t border-slate-300 py-4">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/categories/${categorySlug}/${product.slug}`}
              className="group rounded-3xl bg-white border border-slate-200 p-2 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
                {product.image?.src ? (
                  <Image
                    src={product.image.src}
                    alt={product.image.alt}
                    fill
                    sizes="(min-width:1280px) 20vw, (min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                    quality={75}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-slate-600">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-teal-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              <div className="mt-3 px-1">
                <h2 className="text-sm font-medium leading-snug text-slate-800 transition-colors group-hover:text-teal-600">
                  {product.name}
                </h2>
                <div className="mt-1.5 h-[2px] w-0 rounded-full bg-teal-500 transition-all duration-300 group-hover:w-6" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}