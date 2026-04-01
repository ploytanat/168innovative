import CategoryProductDetailLoading from "@/app/components/product/CategoryProductDetailLoading"

export default function ProductDetailLoading() {
  return (
    <main className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-7xl px-6 pb-28 pt-6 lg:px-8">
        <div className="h-10 w-72 animate-pulse rounded-full bg-slate-100" />
        <CategoryProductDetailLoading />
      </div>
    </main>
  )
}
