import CategoryCatalogLoading from "@/app/components/product/CategoryCatalogLoading"

export default function CategoryLoading() {
  return (
    <main className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-7xl px-6 pb-32 lg:px-8">
        <div className="mt-10 space-y-4">
          <div className="h-10 w-48 animate-pulse rounded-full bg-slate-100" />
          <div className="h-14 w-64 animate-pulse rounded bg-slate-200" />
          <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100" />
        </div>
        <CategoryCatalogLoading />
      </div>
    </main>
  )
}
