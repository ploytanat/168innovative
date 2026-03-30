import Link from 'next/link'

import type { ProductVariantView } from '@/app/lib/types/view'

interface Props {
  categorySlug: string
  productSlug: string
  selectedVariantSlug?: string
  variants: ProductVariantView[]
  locale: 'th' | 'en'
}

const copy = {
  th: {
    heading: 'ตัวเลือกสินค้า',
  },
  en: {
    heading: 'Product Options',
  },
} as const

function buildBasePath(
  locale: 'th' | 'en',
  categorySlug: string,
  productSlug: string
) {
  return locale === 'en'
    ? `/en/categories/${categorySlug}/${productSlug}`
    : `/categories/${categorySlug}/${productSlug}`
}

export default function ProductVariantSelector({
  categorySlug,
  productSlug,
  selectedVariantSlug,
  variants,
  locale,
}: Props) {
  if (variants.length <= 1) {
    return null
  }

  const t = copy[locale]
  const selectedVariant =
    variants.find((variant) => variant.slug === selectedVariantSlug) ?? variants[0]
  const selectedOptions = new Map(
    selectedVariant.options.map((option) => [option.groupKey, option.valueKey])
  )
  const groups = Array.from(
    new Map(
      variants.flatMap((variant) =>
        variant.options.map((option) => [option.groupKey, option.groupLabel] as const)
      )
    ).entries()
  ).map(([key, label]) => ({
    key,
    label,
    values: Array.from(
      new Map(
        variants
          .flatMap((variant) =>
            variant.options
              .filter((option) => option.groupKey === key)
              .map((option) => [option.valueKey, option.valueLabel] as const)
          )
      ).entries()
    ).map(([valueKey, valueLabel]) => ({ valueKey, valueLabel })),
  }))
  const basePath = buildBasePath(locale, categorySlug, productSlug)

  return (
    <div className="mt-8 rounded-[1rem] border border-[rgba(211,217,225,0.92)] bg-white p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7E8C9B]">
        {t.heading}
      </p>

      <div className="mt-5 space-y-5">
        {groups.map((group) => (
          <div key={group.key}>
            <p className="mb-3 text-sm font-medium text-[var(--color-ink-soft)]">
              {group.label}
            </p>

            <div className="flex flex-wrap gap-2.5">
              {group.values.map((value) => {
                const targetVariant = variants
                  .filter((variant) =>
                    variant.options.some(
                      (option) =>
                        option.groupKey === group.key &&
                        option.valueKey === value.valueKey
                    )
                  )
                  .find((variant) =>
                    Array.from(selectedOptions.entries()).every(
                      ([selectedGroupKey, selectedValueKey]) =>
                        selectedGroupKey === group.key ||
                        variant.options.some(
                          (option) =>
                            option.groupKey === selectedGroupKey &&
                            option.valueKey === selectedValueKey
                        )
                    )
                  )
                const fallbackVariant = variants.find((variant) =>
                  variant.options.some(
                    (option) =>
                      option.groupKey === group.key &&
                      option.valueKey === value.valueKey
                  )
                )
                const nextVariant = targetVariant ?? fallbackVariant
                const isActive = selectedVariant.options.some(
                  (option) =>
                    option.groupKey === group.key &&
                    option.valueKey === value.valueKey
                )

                if (!nextVariant) {
                  return (
                    <span
                      key={`${group.key}-${value.valueKey}`}
                      className="rounded-[0.9rem] border border-dashed border-[rgba(211,217,225,0.92)] px-4 py-2.5 text-sm text-slate-400"
                    >
                      {value.valueLabel}
                    </span>
                  )
                }

                const href =
                  nextVariant.slug === productSlug
                    ? basePath
                    : `${basePath}?v=${encodeURIComponent(nextVariant.slug)}`

                return (
                  <Link
                    key={`${group.key}-${value.valueKey}`}
                    href={href}
                    prefetch={false}
                    className="rounded-[0.9rem] border px-4 py-2.5 text-sm transition-colors"
                    style={{
                      borderColor: isActive
                        ? 'var(--color-accent)'
                        : 'rgba(211,217,225,0.92)',
                      background: isActive ? 'rgba(26,77,166,0.06)' : 'white',
                      color: isActive ? 'var(--color-accent)' : 'var(--color-ink)',
                    }}
                  >
                    {value.valueLabel}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
