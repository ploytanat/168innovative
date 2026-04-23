"use client";

import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import CatalogFilterPanel from "@/app/components/product/CatalogFilterPanel";
import CatalogProductCard from "@/app/components/product/CatalogProductCard";
import {
  filterCatalogProducts,
  getCatalogFacetSections,
  sortCatalogProducts,
  type CatalogFacetState,
  type SortOrder,
} from "@/app/lib/catalog/view-model";
import type { CategoryView, ProductView } from "@/app/lib/types/view";

const copy = {
  th: {
    eyebrow: "Product Catalog",
    title: "เลือกสินค้าในหมวดนี้",
    categoryLabel: "หมวดหมู่",
    item: "รายการ",
    result: "ผลลัพธ์",
    sortDefault: "ล่าสุด",
    sortAsc: "ก -> ฮ",
    sortDesc: "ฮ -> ก",
    sortMoq: "MOQ น้อย -> มาก",
    emptyTitle: "ไม่พบสินค้าที่ตรงเงื่อนไข",
    emptyHint: "ลองปรับคำค้นหาหรือตัวกรองเพื่อดูสินค้าเพิ่มเติม",
    viewGrid: "แบบตาราง",
    viewList: "แบบรายการ",
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
    sortMoq: "MOQ: Low -> High",
    emptyTitle: "No matching products",
    emptyHint: "Adjust the search term or filters to widen the result set.",
    viewGrid: "Grid",
    viewList: "List",
  },
} as const;

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
} as const;

function getSortLabel(
  sort: SortOrder,
  t: {
    sortDefault: string;
    sortAsc: string;
    sortDesc: string;
    sortMoq: string;
  },
) {
  if (sort === "asc") return t.sortAsc;
  if (sort === "desc") return t.sortDesc;
  if (sort === "moq-asc") return t.sortMoq;
  return t.sortDefault;
}

function nextSort(current: SortOrder): SortOrder {
  const cycle: SortOrder[] = ["default", "asc", "desc", "moq-asc"];
  const idx = cycle.indexOf(current);
  return cycle[(idx + 1) % cycle.length];
}

interface Props {
  category: CategoryView;
  categories: CategoryView[];
  products: ProductView[];
  searchProducts: ProductView[];
  categorySlug: string;
  totalCount: number;
  locale?: "th" | "en";
  initialQuery?: string;
  onSearchStateChange?: (isSearching: boolean) => void;
}

type ViewMode = "grid" | "list";

export default function ProductGrid({
  category,
  categories,
  products,
  searchProducts,
  categorySlug,
  totalCount,
  locale = "th",
  initialQuery,
  onSearchStateChange,
}: Props) {
  const t = copy[locale];
  const keywordOverride =
    categoryKeywordOverrides[locale][
      category.slug as keyof (typeof categoryKeywordOverrides)[typeof locale]
    ];
  const sectionTitle =
    keywordOverride?.title || category.seoTitle || category.name || t.title;
  const sectionDescription =
    keywordOverride?.description ||
    category.seoDescription ||
    category.description;

  const [query, setQuery] = useState(initialQuery ?? "");
  const [sort, setSort] = useState<SortOrder>("default");
  const [activeFilters, setActiveFilters] = useState<CatalogFacetState>({});
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const sourceProducts = searchProducts.length > 0 ? searchProducts : products;
  const sections = useMemo(
    () => getCatalogFacetSections(sourceProducts),
    [sourceProducts],
  );

  const hasActiveFilters = Object.values(activeFilters).some(
    (values) => values.length > 0,
  );
  const isInteractive = query.trim().length > 0 || hasActiveFilters;

  const filteredProducts = useMemo(() => {
    const scoped = isInteractive ? sourceProducts : products;
    return sortCatalogProducts(
      filterCatalogProducts(scoped, query, activeFilters),
      sort,
      locale,
    );
  }, [
    activeFilters,
    isInteractive,
    locale,
    products,
    query,
    sort,
    sourceProducts,
  ]);

  useEffect(() => {
    onSearchStateChange?.(isInteractive);
  }, [isInteractive, onSearchStateChange]);

  function toggleFilter(key: string, value: string) {
    setActiveFilters((current) => {
      const values = current[key] ?? [];
      return {
        ...current,
        [key]: values.includes(value)
          ? values.filter((item) => item !== value)
          : [...values, value],
      };
    });
  }

  function clearFilters() {
    setQuery("");
    setSort("default");
    setActiveFilters({});
  }

  const displayCount = isInteractive ? filteredProducts.length : totalCount;

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
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
              {t.eyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">
              {sectionTitle}
            </h2>
            {sectionDescription && (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                {sectionDescription}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>
              <span className="font-semibold text-slate-950">
                {displayCount}
              </span>{" "}
              {isInteractive ? t.result : t.item}
            </span>

            <button
              type="button"
              onClick={() => setSort(nextSort)}
              className="rounded-full border border-slate-200 px-3 py-1.5 font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
            >
              {getSortLabel(sort, t)}
            </button>

            <div className="flex overflow-hidden rounded-full border border-slate-200">
              <button
                type="button"
                aria-label={t.viewGrid}
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition ${
                  viewMode === "grid"
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <LayoutGrid className="h-4 w-4" strokeWidth={2} />
                <span className="hidden sm:inline">{t.viewGrid}</span>
              </button>
              <button
                type="button"
                aria-label={t.viewList}
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition ${
                  viewMode === "list"
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <List className="h-4 w-4" strokeWidth={2} />
                <span className="hidden sm:inline">{t.viewList}</span>
              </button>
            </div>
          </div>
        </div>

        {categories.length > 1 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">
              {t.categoryLabel}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((cat) => {
                const href =
                  locale === "en"
                    ? `/en/categories/${cat.slug}`
                    : `/categories/${cat.slug}`;
                const isActive = cat.slug === categorySlug;

                return (
                  <Link
                    key={cat.id}
                    href={href}
                    prefetch={false}
                    className={`rounded-full border px-3 py-2 text-sm transition ${
                      isActive
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center">
            <p className="text-lg font-semibold text-slate-900">
              {t.emptyTitle}
            </p>
            <p className="mt-2 text-sm text-slate-500">{t.emptyHint}</p>
          </div>
        ) : viewMode === "list" ? (
          <div className="flex flex-col gap-4">
            {filteredProducts.map((product) => (
              <CatalogProductCard
                key={product.id}
                categorySlug={categorySlug}
                locale={locale}
                product={product}
                view="list"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <CatalogProductCard
                key={product.id}
                categorySlug={categorySlug}
                locale={locale}
                product={product}
                view="grid"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
