import Link from 'next/link'

import type { CatalogProduct } from '@/app/lib/catalog/mock-products'

interface Props {
  currentProduct: CatalogProduct
  products: CatalogProduct[]
  optionKeys: string[]
}

function formatLabel(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function ProductVariantOptions({
  currentProduct,
  products,
  optionKeys,
}: Props) {
  if (products.length <= 1 || optionKeys.length === 0) {
    return null
  }

  return (
    <div className="mt-8 space-y-5 border-t border-slate-200 pt-8">
      {optionKeys.map((optionKey) => {
        const values = Array.from(
          new Map(
            products
              .map((product) => {
                const value = product.specs[optionKey]

                if (!value) {
                  return null
                }

                return [value, product] as const
              })
              .filter(
                (item): item is readonly [string, CatalogProduct] => item !== null
              )
          ).entries()
        )

        if (values.length === 0) {
          return null
        }

        return (
          <div key={optionKey}>
            <p className="mb-3 text-sm font-semibold text-slate-700">
              {formatLabel(optionKey)}
            </p>

            <div className="flex flex-wrap gap-2.5">
              {values.map(([value, product]) => {
                const isActive = product.sku === currentProduct.sku

                return (
                  <Link
                    key={`${optionKey}-${value}-${product.sku}`}
                    href={`/products/${product.sku}`}
                    className="rounded-xl border px-4 py-2 text-sm font-medium transition"
                    style={{
                      borderColor: isActive ? '#0f172a' : '#cbd5e1',
                      background: isActive ? '#0f172a' : '#fff',
                      color: isActive ? '#fff' : '#334155',
                    }}
                  >
                    {optionKey === 'diameter_mm' ? `${value} mm` : value}
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
