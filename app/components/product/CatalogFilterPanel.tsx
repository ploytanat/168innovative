"use client";

import type {
  CatalogFacetSection,
  CatalogFacetState,
} from "@/app/lib/catalog/view-model";

interface Props {
  locale: "th" | "en";
  search: string;
  activeFilters: CatalogFacetState;
  sections: CatalogFacetSection[];
  onSearchChange: (value: string) => void;
  onToggle: (key: string, value: string) => void;
  onClear: () => void;
}

const copy = {
  th: {
    eyebrow: "Filters",
    title: "กรองสินค้า",
    clear: "ล้างทั้งหมด",
    search: "ค้นหา",
    placeholder: "ชื่อสินค้า หรือ รหัสสินค้า",
  },
  en: {
    eyebrow: "Filters",
    title: "Refine Products",
    clear: "Clear All",
    search: "Search",
    placeholder: "Product name or SKU",
  },
} as const;

export default function CatalogFilterPanel({
  locale,
  search,
  activeFilters,
  sections,
  onSearchChange,
  onToggle,
  onClear,
}: Props) {
  const t = copy[locale];
  const activeCount = Object.values(activeFilters).reduce(
    (sum, values) => sum + values.length,
    0,
  );

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            {t.eyebrow}
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            {t.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
        >
          {t.clear}
        </button>
      </div>

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

      {activeCount > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {sections.flatMap((section) =>
            (activeFilters[section.key] ?? []).map((value) => (
              <button
                key={`${section.key}-${value}`}
                type="button"
                onClick={() => onToggle(section.key, value)}
                className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold tracking-wide text-white"
              >
                {value} x
              </button>
            )),
          )}
        </div>
      )}

      <div className="mt-8 space-y-6">
        {sections.map((section) => (
          <section key={section.key}>
            <h3 className="text-sm font-semibold text-slate-900">
              {section.label}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {section.options.map((option) => {
                const isActive = (activeFilters[section.key] ?? []).includes(
                  option,
                );
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
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
