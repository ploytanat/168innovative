function SpecRowSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 px-5 py-4 text-sm">
      <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
      <div className="ml-auto h-4 w-28 animate-pulse rounded bg-slate-200" />
    </div>
  )
}

export default function CategoryProductDetailLoading() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="rounded-[1.1rem] border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
        <div className="mb-8 h-9 w-36 animate-pulse rounded-full bg-slate-100" />
        <div className="aspect-square animate-pulse rounded-[1.1rem] bg-slate-200" />
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square animate-pulse rounded-[0.9rem] bg-slate-100"
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-center p-2 lg:p-0">
        <div className="h-10 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="my-6 h-px w-12 bg-[linear-gradient(90deg,#e2e8f0,#cbd5e1,#e2e8f0)]" />
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />
        </div>

        <div className="mt-8 rounded-[1rem] border border-slate-200 bg-white p-5">
          <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-10 w-24 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-4 h-4 w-28 animate-pulse rounded bg-slate-100" />
          <div className="divide-y divide-[rgba(221,227,235,0.92)] overflow-hidden rounded-[1rem] border border-[rgba(211,217,225,0.92)] bg-white">
            {Array.from({ length: 5 }).map((_, index) => (
              <SpecRowSkeleton key={index} />
            ))}
          </div>
        </div>

        <div className="mt-10 h-14 w-56 animate-pulse rounded-[1rem] bg-slate-200" />
      </div>
    </div>
  )
}
