'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import type {
  CatalogProduct,
  CatalogProductFamilyWithProducts,
} from '@/app/lib/catalog/mock-products'

interface Props {
  family: CatalogProductFamilyWithProducts
}

function formatOptionKey(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatOptionValue(key: string, value: string) {
  if (key === 'diameter_mm') {
    return `${value} mm`
  }

  return value.replace(/\b\w/g, (char) => char.toUpperCase())
}

function findBestMatch(
  products: CatalogProduct[],
  optionKeys: string[],
  changedKey: string,
  changedValue: string,
  current: CatalogProduct
): CatalogProduct {
  const candidates = products.filter((product) => product.specs[changedKey] === changedValue)

  if (candidates.length === 0) {
    return current
  }

  const scored = candidates.map((candidate) => ({
    candidate,
    score: optionKeys.filter(
      (key) => key !== changedKey && candidate.specs[key] === current.specs[key]
    ).length,
  }))

  scored.sort((left, right) => right.score - left.score)
  return scored[0]!.candidate
}

export default function ProductFamilyCard({ family }: Props) {
  const [selectedSku, setSelectedSku] = useState(family.products[0]!.sku)
  const selected =
    family.products.find((product) => product.sku === selectedSku) ?? family.products[0]!

  function handleSelect(key: string, value: string, event: React.MouseEvent) {
    event.preventDefault()
    const next = findBestMatch(family.products, family.optionKeys, key, value, selected)
    setSelectedSku(next.sku)
  }

  const visibleOptionKeys = family.optionKeys.filter((key) => {
    const unique = new Set(family.products.map((product) => product.specs[key]).filter(Boolean))
    return unique.size >= 2
  })

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
      <Link href={`/products/${selected.sku}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            src={selected.images[0] ?? '/placeholder.jpg'}
            alt={selected.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {family.products.length > 1 ? (
            <span className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {family.products.length} variants
            </span>
          ) : null}
        </div>
      </Link>

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-slate-600">
            {selected.sku}
          </span>
          <span className="text-xs text-slate-400">{selected.category}</span>
        </div>

        <Link href={`/products/${selected.sku}`}>
          <h2 className="text-base leading-snug font-semibold text-slate-950 hover:text-slate-700">
            {family.label}
          </h2>
        </Link>

        {visibleOptionKeys.length > 0 ? (
          <div className="space-y-2.5 pt-1">
            {visibleOptionKeys.map((key) => {
              const valueMap = new Map<string, CatalogProduct>()

              for (const product of family.products) {
                const value = product.specs[key]
                if (value && !valueMap.has(value)) {
                  valueMap.set(value, product)
                }
              }

              return (
                <div key={key}>
                  <p className="mb-1.5 text-xs font-medium text-slate-500">
                    {formatOptionKey(key)}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(valueMap.entries()).map(([value, product]) => {
                      const isActive = product.specs[key] === selected.specs[key]

                      return (
                        <button
                          key={value}
                          onClick={(event) => handleSelect(key, value, event)}
                          className="rounded-lg border px-3 py-1 text-xs font-medium transition-all duration-150"
                          style={{
                            borderColor: isActive ? '#0f172a' : '#e2e8f0',
                            background: isActive ? '#0f172a' : '#f8fafc',
                            color: isActive ? '#fff' : '#475569',
                          }}
                        >
                          {formatOptionValue(key, value)}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : null}

        <Link
          href={`/products/${selected.sku}`}
          className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-950"
        >
          View Details
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  )
}
