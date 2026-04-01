"use client"

import type {
  CatalogFacetSection,
  CatalogFacetState,
} from "@/app/lib/catalog/view-model"

interface Props {
  locale: "th" | "en"
  search: string
  activeFilters: CatalogFacetState
  sections: CatalogFacetSection[]
  availabilityOptions: string[]
  activeAvailability: string[]
  onSearchChange: (value: string) => void
  onToggle: (key: string, value: string) => void
  onToggleAvailability: (value: string) => void
  onClear: () => void
}

const copy = {
  th: {
    eyebrow: "Filters",
    title: "กรองสินค้า",
    clear: "ล้างทั้งหมด",
    search: "ค้นหา",
    placeholder: "ชื่อสินค้า หรือ รหัสสินค้า",
    availability: "สถานะสินค้า",
    statusMap: {
      "in-stock": "พร้อมส่ง",
      "available": "พร้อมส่ง",
      "made-to-order": "สั่งผลิต",
      "mto": "สั่งผลิต",
    } as Record<string, string>,
  },
  en: {
    eyebrow: "Filters",
    title: "Refine Products",
    clear: "Clear All",
    search: "Search",
    placeholder: "Product name or SKU",
    availability: "Availability",
    statusMap: {
      "in-stock": "In Stock",
      "available": "In Stock",
      "made-to-order": "Made to Order",
      "mto": "Made to Order",
    } as Record<string, string>,
  },
} as const

export default function CatalogFilterPanel({
  locale,
  search,
  activeFilters,
  sections,
  availabilityOptions,
  activeAvailability,
  onSearchChange,
  onToggle,
  onToggleAvailability,
  onClear,
}: Props) {
  const t = copy[locale]
  const activeCount =
    Object.values(activeFilters).reduce((s, v) => s + v.length, 0) +
    activeAvailability.length

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            {t.eyebrow}
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">{t.title}</h2>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
        >
          {t.clear}
        </button>
      </div>

      {/* Search */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-700">
          {t.search}
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.placeholder}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
          />
        </label>
      </div>

      {/* Active filter pills */}
      {activeCount > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {activeAvailability.map((value) => (
            <button
              key={`avail-${value}`}
              type="button"
              onClick={() => onToggleAvailability(value)}
              className="rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-semibold tracking-wide text-white"
            >
              {t.statusMap[value] ?? value} ✕
            </button>
          ))}
          {sections.flatMap((section) =>
            (activeFilters[section.key] ?? []).map((value) => (
              <button
                key={`${section.key}-${value}`}
                type="button"
                onClick={() => onToggle(section.key, value)}
                className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold tracking-wide text-white"
              >
                {value} ✕
              </button>
            ))
          )}
        </div>
      )}

      <div className="mt-8 space-y-6">
        {/* Availability filter (special section) */}
        {availabilityOptions.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-slate-900">{t.availability}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {availabilityOptions.map((option) => {
                const isActive = activeAvailability.includes(option)
                const label = t.statusMap[option] ?? option
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onToggleAvailability(option)}
                    className={`rounded-full border px-3 py-2 text-sm transition ${
                      isActive
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-slate-300 bg-white text-slate-700"
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* Dynamic facet sections */}
        {sections.map((section) => (
          <section key={section.key}>
            <h3 className="text-sm font-semibold text-slate-900">{section.label}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {section.options.map((option) => {
                const isActive = (activeFilters[section.key] ?? []).includes(option)
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onToggle(section.key, option)}
                    className={`rounded-full border px-3 py-2 text-sm transition ${
                      isActive
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-slate-300 bg-white text-slate-700"
                    }`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </aside>
  )
}
