"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

import CatalogFilterPanel from "@/app/components/product/CatalogFilterPanel"
import CatalogProductCard from "@/app/components/product/CatalogProductCard"
import {
  filterCatalogProducts,
  getCatalogFacetSections,
  sortCatalogProducts,
  type CatalogFacetState,
} from "@/app/lib/catalog/view-model"
import type { CategoryView, ProductView } from "@/app/lib/types/view"

interface Props {
  category: CategoryView
  categories: CategoryView[]
  products: ProductView[]
  searchProducts: ProductView[]
  categorySlug: string
  totalCount: number
  locale?: "th" | "en"
  onSearchStateChange?: (isSearching: boolean) => void
}

type SortOrder = "default" | "asc" | "desc"

const copy = {
  th: {
    eyebrow: "Product Catalog",
    title: "เลือกสินค้าในหมวดนี้",
    categoryLabel: "Category",
    item: "รายการ",
    result: "ผลลัพธ์",
    sortDefault: "ล่าสุด",
    sortAsc: "ก -> ฮ",
    sortDesc: "ฮ -> ก",
    emptyTitle: "ไม่พบสินค้าที่ตรงเงื่อนไข",
    emptyHint: "ลองปรับคำค้นหาหรือฟิลเตอร์เพื่อดูสินค้าเพิ่มเติม",
  },
  en: {
    eyebrow: "Product Catalog",
    title: "Explore this category",
    categoryLabel: "Category",
    item: "items",
    result: "results",
    sortDefault: "Default",
    sortAsc: "A -> Z",
    sortDesc: "Z -> A",
    emptyTitle: "No matching products",
    emptyHint: "Adjust the search term or filters to widen the result set.",
  },
} as const

const categoryKeywordOverrides = {
  th: {
    spout: {
      title: "จุกซอง",
      description:
        "จุกซองสำหรับซองบรรจุครีม เจล และของเหลว รองรับงานบรรจุและการใช้งานกับบรรจุภัณฑ์หลายประเภท",
    },
  },
  en: {
    spout: {
      title: "Tube Stoppers",
      description:
        "Tube stoppers for cream, gel, and liquid packaging applications with options suited to multiple pouch and tube formats.",
    },
  },
} as const

export default function ProductGrid({
  category,
  categories,
  products,
  searchProducts,
  categorySlug,
  totalCount,
  locale = "th",
  onSearchStateChange,
}: Props) {
  const t = copy[locale]
  const keywordOverride = categoryKeywordOverrides[locale][
    category.slug as keyof (typeof categoryKeywordOverrides)[typeof locale]
  ]
  const sectionTitle =
    keywordOverride?.title || category.seoTitle || category.name || t.title
  const sectionDescription =
    keywordOverride?.description || category.seoDescription || category.description
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortOrder>("default")
  const [activeFilters, setActiveFilters] = useState<CatalogFacetState>({})
  const sourceProducts = searchProducts.length > 0 ? searchProducts : products
  const sections = useMemo(() => getCatalogFacetSections(sourceProducts), [sourceProducts])
  const hasActiveFilters = Object.values(activeFilters).some((values) => values.length > 0)
  const isInteractive = query.trim().length > 0 || hasActiveFilters

  const filteredProducts = useMemo(() => {
    const scopedProducts = isInteractive ? sourceProducts : products
    return sortCatalogProducts(
      filterCatalogProducts(scopedProducts, query, activeFilters),
      sort,
      locale
    )
  }, [activeFilters, isInteractive, locale, products, query, sort, sourceProducts])

  useEffect(() => {
    onSearchStateChange?.(isInteractive)
  }, [isInteractive, onSearchStateChange])

  function toggleFilter(key: string, value: string) {
    setActiveFilters((current) => {
      const values = current[key] ?? []
      const nextValues = values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value]

      return {
        ...current,
        [key]: nextValues,
      }
    })
  }

  function clearFilters() {
    setQuery("")
    setSort("default")
    setActiveFilters({})
  }

  const displayCount = isInteractive ? filteredProducts.length : totalCount
  const sortLabel =
    sort === "asc"
      ? t.sortAsc
      : sort === "desc"
        ? t.sortDesc
        : t.sortDefault

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
      <CatalogFilterPanel
        locale={locale}
        search={query}
        activeFilters={activeFilters}
        sections={sections}
        onSearchChange={setQuery}
        onToggle={toggleFilter}
        onClear={clearFilters}
      />

      <section className="space-y-5">
        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              {t.eyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">
              {sectionTitle}
            </h2>
            {sectionDescription ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                {sectionDescription}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-500">
            <div>
              <span className="font-semibold text-slate-950">{displayCount}</span>{" "}
              {isInteractive ? t.result : t.item}
            </div>
            <button
              type="button"
              onClick={() =>
                setSort((current) =>
                  current === "default" ? "asc" : current === "asc" ? "desc" : "default"
                )
              }
              className="rounded-full border border-slate-200 px-3 py-1.5 font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
            >
              {sortLabel}
            </button>
          </div>
        </div>

        {categories.length > 1 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">{t.categoryLabel}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => {
                const href =
                  locale === "en"
                    ? `/en/categories/${category.slug}`
                    : `/categories/${category.slug}`
                const isActive = category.slug === categorySlug

                return (
                  <Link
                    key={category.id}
                    href={href}
                    prefetch={false}
                    className="rounded-full border px-3 py-2 text-sm transition"
                    style={{
                      borderColor: isActive ? "#0f172a" : "#cbd5e1",
                      background: isActive ? "#0f172a" : "#fff",
                      color: isActive ? "#fff" : "#334155",
                    }}
                  >
                    {category.name}
                  </Link>
                )
              })}
            </div>
          </div>
        ) : null}

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center">
            <p className="text-lg font-semibold text-slate-900">{t.emptyTitle}</p>
            <p className="mt-2 text-sm text-slate-500">{t.emptyHint}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <CatalogProductCard
                key={product.id}
                categorySlug={categorySlug}
                locale={locale}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
