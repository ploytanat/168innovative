// app/components/product/ProductGrid.tsx
'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ArrowDownAZ, ArrowUpAZ, X } from 'lucide-react'
import { ProductView } from '@/app/lib/types/view'

interface Props {
  products: ProductView[]
  categorySlug: string
}

type SortOrder = 'default' | 'asc' | 'desc'

export default function ProductGrid({ products, categorySlug }: Props) {
  const [query, setQuery]       = useState('')
  const [sort, setSort]         = useState<SortOrder>('default')

  const filtered = useMemo(() => {
    let result = [...products]

    // Search
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
      )
    }

    // Sort
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
  const SortIcon  = sort === 'desc' ? ArrowUpAZ : ArrowDownAZ

  return (
    <div>
      {/* ── Toolbar ── */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาสินค้า..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm text-[#0F1E33] placeholder-[#94A3B8] shadow-sm outline-none transition-all focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#94A3B8] hover:bg-slate-100 hover:text-[#0F1E33] transition-colors"
              aria-label="ล้างคำค้นหา"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Right: sort + count */}
        <div className="flex items-center gap-3">
          {/* Sort button */}
          <button
            onClick={cycleSort}
            className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-bold transition-all ${
              sort !== 'default'
                ? 'border-[#14B8A6] bg-[#F0FDFA] text-[#14B8A6]'
                : 'border-slate-200 bg-white text-[#64748B] hover:border-[#14B8A6] hover:text-[#14B8A6]'
            }`}
          >
            <SortIcon className="h-4 w-4" />
            {sortLabel}
          </button>

          {/* Count */}
          <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 text-xs font-bold text-[#94A3B8]">
            {filtered.length}
            <span className="ml-1 font-normal">รายการ</span>
          </div>
        </div>
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F1F5F9]">
            <Search className="h-7 w-7 text-[#94A3B8]" />
          </div>
          <p className="text-sm font-semibold text-[#0F1E33]">ไม่พบสินค้า</p>
          <p className="mt-1 text-xs text-[#94A3B8]">
            ลองค้นหาด้วยคำอื่น หรือ{' '}
            <button
              onClick={() => { setQuery(''); setSort('default') }}
              className="text-[#14B8A6] underline underline-offset-2"
            >
              ล้างตัวกรอง
            </button>
          </p>
        </div>
      )}

      {/* ── Product grid ── */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/categories/${categorySlug}/${product.slug}`}
              className="group rounded-3xl bg-white p-4 shadow-sm shadow-slate-100 transition-all hover:-translate-y-1 hover:shadow-md hover:shadow-slate-200"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#EEF2F7]">
                {product.image?.src ? (
                  <Image
                    src={product.image.src}
                    alt={product.image.alt}
                    fill
                    sizes="(min-width:1280px) 20vw, (min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[#94A3B8]">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-[#14B8A6]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              <div className="mt-3 px-1">
                <h2 className="text-sm font-bold leading-snug text-[#0F1E33] transition-colors group-hover:text-[#14B8A6]">
                  {product.name}
                </h2>
                <div className="mt-1.5 h-[2px] w-0 rounded-full bg-[#14B8A6] transition-all duration-300 group-hover:w-6" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}