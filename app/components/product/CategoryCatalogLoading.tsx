interface CategoryCatalogLoadingProps {
  showCategorySwitcher?: boolean
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="aspect-[4/3] animate-pulse bg-slate-200" />
      <div className="space-y-3 p-5">
        <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  )
}

export default function CategoryCatalogLoading({
  showCategorySwitcher = true,
}: CategoryCatalogLoadingProps) {
  return (
    <section className="mt-14 md:mt-16">
      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-6 w-40 animate-pulse rounded bg-slate-100" />
          <div className="mt-6 h-12 animate-pulse rounded-2xl bg-slate-100" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-10 animate-pulse rounded-full bg-slate-100"
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
            <div className="mt-3 h-8 w-72 animate-pulse rounded bg-slate-200" />
          </div>

          {showCategorySwitcher ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="h-5 w-24 animate-pulse rounded bg-slate-100" />
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-10 w-28 animate-pulse rounded-full bg-slate-100"
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
