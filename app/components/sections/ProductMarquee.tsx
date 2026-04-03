import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { uiText } from "@/app/lib/i18n/ui"
import type { ProductView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

// ─── Types ──────────────────────────────────────────────────────────────────

type Locale = "th" | "en"

interface ProductGridProps {
  items: ProductView[]
  locale: Locale
  /**
   * Max items to show. Defaults to 10 — fills 2 rows of 5 on desktop.
   * Pass 5 for a single tight row, 15 for a fuller catalog preview.
   */
  limit?: number
  /** Section heading variant */
  variant?: "featured" | "new" | "popular"
}

// ─── Static data ─────────────────────────────────────────────────────────────

const BADGE_CYCLE = [
  { label: { th: "ขายดี",  en: "Best Seller" }, style: "bg-[#c47b8a] text-white" },
  { label: { th: "นิยม",   en: "Popular" },     style: "bg-[#d4956a] text-white" },
  { label: { th: "OEM",    en: "OEM" },         style: "bg-[#6b94c7] text-white" },
  { label: { th: "ใหม่",   en: "New" },         style: "bg-[#5a8e6d] text-white" },
  { label: { th: "Custom", en: "Custom" },      style: "bg-[#9b8ec4] text-white" },
] as const

const VARIANT_COPY = {
  featured: { th: "สินค้าแนะนำ", en: "Featured" },
  new:      { th: "สินค้าใหม่",  en: "New arrivals" },
  popular:  { th: "ยอดนิยม",    en: "Most popular" },
} as const

const HEADING_COPY = {
  featured: { th: "สินค้ายอดนิยม",     en: "Featured products" },
  new:      { th: "สินค้าเข้าใหม่",    en: "Just arrived" },
  popular:  { th: "สินค้าที่ขายดีที่สุด", en: "Best sellers" },
} as const

// ─── Helpers ─────────────────────────────────────────────────────────────────

function productHref(item: ProductView, locale: Locale) {
  return withLocalePath(`/categories/${item.categorySlug}/${item.slug}`, locale)
}

// ─── ImageBox — handles missing src gracefully ───────────────────────────────

function ImageBox({
  item,
  href,
  badge,
  locale,
}: {
  item: ProductView
  href: string
  badge: (typeof BADGE_CYCLE)[number]
  locale: Locale
}) {
  return (
    <Link href={href} tabIndex={-1} aria-hidden className="block">
      <div className="relative aspect-square overflow-hidden bg-[#f0ebe4]">
        {item.image?.src ? (
          <Image
            src={item.image.src}
            alt={item.image.alt ?? item.name}
            fill
            sizes="(max-width:640px) 100vw, (max-width:1280px) 25vw, 18vw"
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.05]"
          />
        ) : (
          // Placeholder — color-matched to badge
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <span className="font-body text-4xl font-black text-[#1e2535]">
              {item.name.slice(0, 2)}
            </span>
          </div>
        )}

        <span
          className={`
            absolute left-2 top-2 rounded px-2 py-1
            text-[9px] font-extrabold uppercase tracking-wide
            ${badge.style}
          `}
        >
          {badge.label[locale]}
        </span>
      </div>
    </Link>
  )
}

// ─── Feature lines ────────────────────────────────────────────────────────────

function FeatureLines({ item, locale }: { item: ProductView; locale: Locale }) {
  const lines: string[] =
    locale === "th"
      ? [
          "รองรับ OEM/ODM ครบวงจร",
          item.moq ? `MOQ ${item.moq} ชิ้น` : "มีหลายรุ่นและสเปคให้เลือก",
          "ขอราคาและตัวอย่างได้",
        ]
      : [
          "OEM/ODM support available",
          item.moq ? `MOQ ${item.moq} pcs` : "Multiple specs and options",
          "Quote and sample available",
        ]

  return (
    <ul className="mb-3 flex flex-col gap-1" aria-label="Product features">
      {lines.map((line) => (
        <li key={line} className="flex items-start gap-1.5 text-[11px] text-[#4a5568]">
          <span className="mt-px shrink-0 font-bold text-[#4a7c59]" aria-hidden>✓</span>
          <span>{line}</span>
        </li>
      ))}
    </ul>
  )
}

// ─── Product card ─────────────────────────────────────────────────────────────

function ProductCard({
  item,
  index,
  locale,
}: {
  item: ProductView
  index: number
  locale: Locale
}) {
  const href  = productHref(item, locale)
  const badge = BADGE_CYCLE[index % BADGE_CYCLE.length]

  return (
    <article
      className="
        group flex flex-col overflow-hidden rounded-[10px]
        border border-black/[0.05] bg-white
        shadow-[0_2px_12px_rgba(0,0,0,.07)]
        transition-all duration-200
        hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,.11)]
      "
    >
      <ImageBox item={item} href={href} badge={badge} locale={locale} />

      <div className="flex flex-1 flex-col p-3">
        {/* Name — links to product page */}
        <Link href={href} className="mb-2 block">
          <h3
            className={`
              min-h-[3em] text-[12px] font-semibold text-[#1e2535]
              transition-colors duration-150 group-hover:text-[#c47b8a]
              ${locale === "th" ? "font-body leading-[1.55]" : "leading-[1.4]"}
            `}
          >
            {item.name}
          </h3>
        </Link>

        <FeatureLines item={item} locale={locale} />

        {/* Push CTA to bottom */}
        <div className="mt-auto">
          <Link
            href={withLocalePath("/contact", locale)}
            className="
              block rounded-[7px] bg-[#c47b8a] px-3 py-2
              text-center text-[11px] font-bold text-white
              transition-opacity duration-150 hover:opacity-90
              active:scale-[0.98]
            "
          >
            {locale === "th" ? "📋 ขอใบเสนอราคา" : "Request a Quote"}
          </Link>
        </div>
      </div>
    </article>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({
  locale,
  variant,
  totalShown,
  totalAvailable,
}: {
  locale: Locale
  variant: NonNullable<ProductGridProps["variant"]>
  totalShown: number
  totalAvailable: number
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="rounded bg-[#c47b8a] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.05em] text-white">
          {VARIANT_COPY[variant][locale]}
        </span>
        <h2
          className={`text-[#1e2535] ${
            locale === "th"
              ? "font-body text-[1.15rem] font-extrabold leading-[1.35] sm:text-[1.25rem]"
              : "font-heading text-[1.25rem] font-extrabold"
          }`}
        >
          {HEADING_COPY[variant][locale]}
        </h2>
        {totalAvailable > totalShown && (
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">
            {totalShown} / {totalAvailable}
          </span>
        )}
      </div>

      <Link
        href={withLocalePath("/categories", locale)}
        className="
          inline-flex items-center gap-1.5 rounded-full
          border border-black/[0.08] bg-white px-3.5 py-1.5
          text-[12px] font-bold text-[#4a7c59]
          transition-all duration-150 hover:bg-neutral-50 hover:shadow-sm
          active:scale-[0.98]
        "
      >
        {uiText.viewAllProducts[locale]}
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
      </Link>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function ProductGrid({
  items,
  locale,
  limit = 10,
  variant = "featured",
}: ProductGridProps) {
  if (!items.length) return null

  const shown = items.slice(0, limit)

  return (
    <section
      aria-labelledby="product-grid-heading"
      className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-5 lg:py-10"
    >
      <SectionHeader
        locale={locale}
        variant={variant}
        totalShown={shown.length}
        totalAvailable={items.length}
      />

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {shown.map((item, index) => (
          <ProductCard key={item.id} item={item} index={index} locale={locale} />
        ))}
      </div>
    </section>
  )
}