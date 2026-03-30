"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"

import {
  buildCategoryProductHref,
  resolveCatalogVariantForValue,
  resolveSelectedVariant,
} from "@/app/lib/catalog/view-model"
import type { ProductView } from "@/app/lib/types/view"

interface Props {
  categorySlug: string
  locale: "th" | "en"
  product: ProductView
}

function formatBadge(product: ProductView) {
  return product.sku ?? product.slug
}

export default function CatalogProductCard({
  categorySlug,
  locale,
  product,
}: Props) {
  const [selectedVariantSlug, setSelectedVariantSlug] = useState(
    product.defaultVariantSlug ?? product.variants[0]?.slug
  )
  const selectedVariant = useMemo(
    () => resolveSelectedVariant(product, selectedVariantSlug),
    [product, selectedVariantSlug]
  )
  const selectedImage = selectedVariant?.image ?? product.image
  const selectedDescription = selectedVariant?.description || product.description
  const href = buildCategoryProductHref(
    locale,
    categorySlug,
    product.slug,
    selectedVariant?.slug
  )

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
      <Link href={href} prefetch={false} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            src={selectedImage?.src || "/placeholder.jpg"}
            alt={selectedImage?.alt || product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.variantCount > 1 ? (
            <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {product.variantCount} variants
            </span>
          ) : null}
        </div>
      </Link>

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-slate-600">
            {formatBadge(product)}
          </span>
          {product.variantSummary ? (
            <span className="text-xs font-medium text-slate-500">
              {product.variantSummary}
            </span>
          ) : null}
        </div>

        <div>
          <Link href={href} prefetch={false}>
            <h3 className="text-base font-semibold leading-snug text-slate-950 hover:text-slate-700">
              {product.name}
            </h3>
          </Link>
          {selectedDescription ? (
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
              {selectedDescription}
            </p>
          ) : null}
        </div>

        {product.variantCount > 1 && product.variantGroups.length > 0 ? (
          <div className="space-y-2.5 pt-1">
            {product.variantGroups.map((group) => (
              <div key={group.key}>
                <p className="mb-1.5 text-xs font-medium text-slate-500">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.values.map((value) => {
                    const isActive = selectedVariant?.options.some(
                      (option) =>
                        option.groupKey === group.key &&
                        option.valueLabel === value.valueLabel
                    )
                    const nextVariant = selectedVariant
                      ? resolveCatalogVariantForValue(
                          product.variants,
                          product.variantGroups,
                          selectedVariant,
                          group.key,
                          value.valueLabel
                        )
                      : undefined

                    return (
                      <button
                        key={`${group.key}-${value.valueKey}`}
                        type="button"
                        onClick={() => {
                          if (nextVariant?.slug) {
                            setSelectedVariantSlug(nextVariant.slug)
                          }
                        }}
                        className="rounded-lg border px-3 py-1 text-xs font-medium transition-all duration-150"
                        style={{
                          borderColor: isActive ? "#0f172a" : "#e2e8f0",
                          background: isActive ? "#0f172a" : "#f8fafc",
                          color: isActive ? "#fff" : "#475569",
                        }}
                      >
                        {value.valueLabel}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <Link
          href={href}
          prefetch={false}
          className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-950"
        >
          View Details
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  )
}
