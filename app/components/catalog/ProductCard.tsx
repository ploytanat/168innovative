import Image from 'next/image'
import Link from 'next/link'

import type { CatalogProduct } from '@/app/lib/catalog/mock-products'

interface Props {
  product: CatalogProduct
}

export default function ProductCard({ product }: Props) {
  const capacity = product.specs.capacity_ml
  const shape = product.specs.shape

  return (
    <Link
      href={`/products/${product.sku}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <Image
          src={product.images[0] ?? '/placeholder.jpg'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-slate-600">
            {product.sku}
          </span>
          {capacity ? (
            <span className="text-xs font-medium text-slate-500">{capacity} ml</span>
          ) : null}
        </div>

        <div>
          <h2 className="text-base leading-snug font-semibold text-slate-950">
            {product.name}
          </h2>
          {shape ? <p className="mt-1 text-xs capitalize text-slate-400">{shape}</p> : null}
        </div>
      </div>
    </Link>
  )
}
