"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ArrowDownAZ, ArrowRight, ArrowUpAZ, Search, X } from "lucide-react"

import { HOME } from "@/app/components/sections/home-theme"
import type { ProductView } from "@/app/lib/types/view"

interface Props {
  products: ProductView[]
  searchProducts: ProductView[]
  categorySlug: string
  totalCount: number
  locale?: "th" | "en"
  onSearchStateChange?: (isSearching: boolean) => void
}

type SortOrder = "default" | "asc" | "desc"

const i18n = {
  th: {
    searchPlaceholder: "ค้นหาสินค้า...",
    clearSearch: "ล้างคำค้นหา",
    sortLabel: "เรียงตามชื่อ",
    sortAsc: "ก → ฮ",
    sortDesc: "ฮ → ก",
    results: "ผลลัพธ์",
    items: "รายการ",
    noProducts: "ไม่พบสินค้า",
    emptyHint: "ลองค้นหาด้วยคำอื่น หรือ ",
    clearFilters: "ล้างตัวกรอง",
  },
  en: {
    searchPlaceholder: "Search products...",
    clearSearch: "Clear search",
    sortLabel: "Sort name",
    sortAsc: "A → Z",
    sortDesc: "Z → A",
    results: "results",
    items: "items",
    noProducts: "No products found",
    emptyHint: "Try another keyword or ",
    clearFilters: "Clear filters",
  },
} as const

export default function ProductGrid({
  products,
  searchProducts,
  categorySlug,
  totalCount,
  locale = "th",
  onSearchStateChange,
}: Props) {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortOrder>("default")
  const t = i18n[locale]

  const filtered = useMemo(() => {
    const source = query.trim() ? searchProducts : products
    let result = [...source]

    if (query.trim()) {
      const normalized = query.trim().toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(normalized) ||
          product.slug.toLowerCase().includes(normalized),
      )
    }

    if (sort === "asc") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name, locale === "th" ? "th" : "en"),
      )
    } else if (sort === "desc") {
      result.sort((a, b) =>
        b.name.localeCompare(a.name, locale === "th" ? "th" : "en"),
      )
    }

    return result
  }, [products, searchProducts, query, sort, locale])

  const cycleSort = () => {
    setSort((state) =>
      state === "default" ? "asc" : state === "asc" ? "desc" : "default",
    )
  }

  const sortLabel =
    sort === "asc" ? t.sortAsc : sort === "desc" ? t.sortDesc : t.sortLabel
  const SortIcon = sort === "desc" ? ArrowUpAZ : ArrowDownAZ
  const isSearching = query.trim().length > 0
  const displayCount = isSearching ? filtered.length : totalCount

  useEffect(() => {
    onSearchStateChange?.(isSearching)
  }, [isSearching, onSearchStateChange])

  return (
    <div>
      {/* Toolbar: search + sort + counter */}
      <div className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row md:items-center md:justify-between md:gap-5">
        <div className="relative w-full md:max-w-sm">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: HOME.inkSoft }}
          />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded border py-2.5 pl-10 pr-10 text-[14px] outline-none transition-colors focus:border-[#4a7a1e]"
            style={{ background: HOME.surface, borderColor: HOME.line, color: HOME.ink }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={t.clearSearch}
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded transition-colors hover:bg-[#f9f9f9]"
              style={{ color: HOME.inkSoft }}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={cycleSort}
            className="inline-flex items-center gap-2 rounded border px-3 py-2 text-[13px] font-semibold transition-colors"
            style={
              sort === "default"
                ? { background: HOME.surface, borderColor: HOME.line, color: HOME.ink }
                : { background: HOME.leaf, borderColor: HOME.leaf, color: HOME.surface }
            }
          >
            <SortIcon className="h-4 w-4" />
            {sortLabel}
          </button>

          <p className="text-[13px] font-semibold" style={{ color: HOME.ink }}>
            <span>{displayCount}</span>
            <span className="ml-1 font-medium" style={{ color: HOME.inkSoft }}>
              {isSearching ? t.results : t.items}
            </span>
          </p>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div
          className="rounded-lg px-6 py-16 text-center"
          style={{ background: HOME.mist, border: `1px solid ${HOME.line}` }}
        >
          <div
            aria-hidden
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: HOME.mintSoft, color: HOME.mintInk }}
          >
            <Search className="h-5 w-5" />
          </div>
          <p className="text-[15px] font-semibold" style={{ color: HOME.ink }}>
            {t.noProducts}
          </p>
          <p className="mt-2 text-[14px]" style={{ color: HOME.inkMid }}>
            {t.emptyHint}
            <button
              type="button"
              onClick={() => {
                setQuery("")
                setSort("default")
              }}
              className="font-semibold underline underline-offset-4"
              style={{ color: HOME.mintInk }}
            >
              {t.clearFilters}
            </button>
          </p>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 && (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {filtered.map((product) => {
            const href =
              locale === "en"
                ? `/en/categories/${categorySlug}/${product.slug}`
                : `/categories/${categorySlug}/${product.slug}`
            return (
              <li key={product.id}>
                <Link href={href} prefetch={false} className="group block">
                  <div
                    className="relative aspect-square overflow-hidden rounded-lg"
                    style={{ background: HOME.mist, border: `1px solid ${HOME.line}` }}
                  >
                    {product.image?.src ? (
                      <Image
                        src={product.image.src}
                        alt={product.image.alt || product.name}
                        fill
                        sizes="(max-width:640px) 48vw, (max-width:1024px) 32vw, 300px"
                        className="object-cover transition-transform duration-600 ease-out group-hover:scale-[1.04]"
                        style={{ filter: "saturate(0.88)" }}
                      />
                    ) : (
                      <div
                        className="flex h-full items-center justify-center text-xs"
                        style={{ color: HOME.inkSoft }}
                      >
                        No Image
                      </div>
                    )}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
                      style={{ background: "rgba(124, 179, 66, 0.08)", mixBlendMode: "multiply" }}
                    />
                    <span
                      aria-hidden
                      className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1 sm:bottom-3 sm:right-3 sm:h-9 sm:w-9"
                      style={{ background: HOME.leaf, color: HOME.surface }}
                    >
                      <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.5} />
                    </span>
                  </div>
                  <h2
                    className="mt-4 line-clamp-2 text-[14px] font-semibold leading-normal sm:text-[15px]"
                    style={{ color: HOME.ink }}
                  >
                    {product.name}
                  </h2>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
