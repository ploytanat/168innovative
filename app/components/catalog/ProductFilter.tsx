type FilterSection = {
  key: 'categories' | 'types' | 'diameters'
  label: string
  options: string[]
}

interface Props {
  search: string
  activeFilters: {
    categories: string[]
    types: string[]
    diameters: string[]
  }
  sections: FilterSection[]
  onSearchChange: (value: string) => void
  onToggle: (
    key: 'categories' | 'types' | 'diameters',
    value: string
  ) => void
  onClear: () => void
}

export default function ProductFilter({
  search,
  activeFilters,
  sections,
  onSearchChange,
  onToggle,
  onClear,
}: Props) {
  const activeCount =
    activeFilters.categories.length +
    activeFilters.types.length +
    activeFilters.diameters.length

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            Filters
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            Refine Catalog
          </h2>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
        >
          Clear
        </button>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-700">
          Search
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search SKU or name"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
          />
        </label>
      </div>

      {activeCount > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {sections.flatMap((section) =>
            activeFilters[section.key].map((value) => (
              <button
                key={`${section.key}-${value}`}
                type="button"
                onClick={() => onToggle(section.key, value)}
                className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold tracking-[0.08em] text-white"
              >
                {value}
              </button>
            ))
          )}
        </div>
      ) : null}

      <div className="mt-8 space-y-6">
        {sections.map((section) => (
          <section key={section.key}>
            <h3 className="text-sm font-semibold text-slate-900">{section.label}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {section.options.map((option) => {
                const isActive = activeFilters[section.key].includes(option)

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onToggle(section.key, option)}
                    className="rounded-full border px-3 py-2 text-sm transition"
                    style={{
                      borderColor: isActive ? '#0f172a' : '#cbd5e1',
                      background: isActive ? '#0f172a' : '#fff',
                      color: isActive ? '#fff' : '#334155',
                    }}
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
