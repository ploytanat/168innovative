import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import ProductGallery from '@/app/components/catalog/ProductGallery'
import ProductSpecs from '@/app/components/catalog/ProductSpecs'
import ProductVariantOptions from '@/app/components/catalog/ProductVariantOptions'
import {
  catalogProducts,
  getCatalogProductBySku,
  getCatalogProductFamilyBySku,
} from '@/app/lib/catalog/mock-products'

interface Props {
  params: Promise<{
    sku: string
  }>
}

export async function generateStaticParams() {
  return catalogProducts.map((product) => ({
    sku: product.sku,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sku } = await params
  const product = getCatalogProductBySku(sku)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} | 168Innovative Product Catalog`,
    description: product.description,
    keywords: product.tags,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { sku } = await params
  const product = getCatalogProductBySku(sku)
  const family = getCatalogProductFamilyBySku(sku)

  if (!product) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
        >
          Back to Catalog
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <ProductGallery images={product.images} name={product.name} />

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            {product.category}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">
            {product.name}
          </h1>

          <div className="mt-5 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            SKU: {product.sku}
          </div>

          {family ? (
            <ProductVariantOptions
              currentProduct={product}
              products={family.products}
              optionKeys={family.optionKeys}
            />
          ) : null}

          <div className="mt-8 border-t border-slate-200 pt-8">
            <h2 className="text-lg font-semibold text-slate-950">Description</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {product.description}
            </p>
          </div>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold text-slate-950">
          Specifications
        </h2>
        <ProductSpecs specs={product.specs} />
      </section>
    </main>
  )
}
