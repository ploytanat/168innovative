import type { CatalogProduct } from '@/app/lib/catalog/mock-products'
import { groupProductsForDisplay } from '@/app/lib/catalog/mock-products'

import ProductCard from '@/app/components/catalog/ProductCard'
import ProductFamilyCard from '@/app/components/catalog/ProductFamilyCard'

interface Props {
  products: CatalogProduct[]
}

export default function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center">
        <p className="text-lg font-semibold text-slate-900">No matching products</p>
        <p className="mt-2 text-sm text-slate-500">
          Adjust the filters or search term to widen the result set.
        </p>
      </div>
    )
  }

  const groups = groupProductsForDisplay(products)

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {groups.map((group) => {
        if (group.type === 'family') {
          return (
            <ProductFamilyCard key={group.family.key} family={group.family} />
          )
        }
        return <ProductCard key={group.product.sku} product={group.product} />
      })}
    </div>
  )
}
