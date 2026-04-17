import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { uiText } from "@/app/lib/i18n/ui"
import type { CategoryView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

// ─── Types ─────────────────────────────────────────────────────────────────

type Locale = "th" | "en"

interface CategorySectionProps {
  items: CategoryView[]
  locale: Locale
}

// ─── Copy ──────────────────────────────────────────────────────────────────

const COPY = {
  th: {
    eyebrow: "Category Showcase",
    title: "เลือกเข้าแค็ตตาล็อกตามงานที่ต้องการ",
    summary:
      "จัดหมวดสินค้าให้เห็นคอลเลกชันหลักชัดขึ้น ทั้งกลุ่มที่ใช้บ่อยในงานเครื่องสำอาง งานแพ็กเกจรีฟิล และงานประกอบ OEM",
    featuredLabel: "หมวดเด่น",
    collectionLabel: "คอลเลกชัน",
    explore: "เปิดดูหมวดนี้",
  },
  en: {
    eyebrow: "Category Showcase",
    title: "Move into the catalog by product group",
    summary:
      "Core packaging collections are grouped more clearly so customers can enter the right catalog path faster — from cosmetics to refill packaging and OEM support items.",
    featuredLabel: "Featured",
    collectionLabel: "Collection",
    explore: "Open category",
  },
} as const

// ─── Pill badge ─────────────────────────────────────────────────────────────

function Pill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 ring-1 ring-white/12">
      {label}
    </span>
  )
}

// ─── Featured card (large, left column) ────────────────────────────────────

function FeaturedCard({
  item,
  locale,
}: {
  item: CategoryView
  locale: Locale
}) {
  const copy = COPY[locale]

  return (
    <Link
      href={withLocalePath(`/categories/${item.slug}`, locale)}
      aria-label={`${copy.explore}: ${item.name}`}
      className="group relative flex min-h-[480px] flex-col overflow-hidden rounded-[1.75rem] lg:min-h-full"
    >
      {/* Image */}
      {item.image?.src ? (
        <Image
          src={item.image.src}
          alt={item.image.alt ?? item.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(.25,.46,.45,.94)] group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-100" />
      )}

      {/* Overlay — darkens more on hover */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/78
                   transition-opacity duration-500 group-hover:opacity-90"
      />

      {/* Decorative corner accent */}
      <div
        aria-hidden
        className="absolute right-5 top-5 h-[72px] w-[72px] rounded-full border border-white/12
                   opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110"
      />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <Pill label={copy.featuredLabel} />

        <h3
          className={`
            mt-4 text-white
            ${locale === "th"
              ? "font-body text-[clamp(1.5rem,2.4vw,2.1rem)] font-extrabold leading-[1.2]"
              : "font-heading text-[clamp(2rem,3.2vw,2.9rem)] font-black leading-[1.04]"
            }
            translate-y-1 transition-transform duration-300 group-hover:translate-y-0
          `}
        >
          {item.name}
        </h3>

        {item.description && (
          <p className="mt-3 max-w-lg text-sm leading-7 text-white/75 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {item.description}
          </p>
        )}

        <ExploreLink label={copy.explore} />
      </div>
    </Link>
  )
}

// ─── Small card (right grid) ────────────────────────────────────────────────

function SmallCard({
  item,
  locale,
  index,
}: {
  item: CategoryView
  locale: Locale
  index: number
}) {
  const copy = COPY[locale]

  return (
    <Link
      href={withLocalePath(`/categories/${item.slug}`, locale)}
      aria-label={`${copy.explore}: ${item.name}`}
      className="group relative flex min-h-[220px] flex-col overflow-hidden rounded-[1.4rem]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      {item.image?.src ? (
        <Image
          src={item.image.src}
          alt={item.image.alt ?? item.name}
          fill
          sizes="(max-width: 768px) 50vw, 22vw"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(.25,.46,.45,.94)] group-hover:scale-[1.06]"
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-100" />
      )}

      {/* Overlay */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/8 to-black/75
                   transition-opacity duration-400 group-hover:opacity-90"
      />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <Pill label={copy.collectionLabel} />
        <h3
          className={`
            mt-3 text-white
            ${locale === "th"
              ? "font-body text-[1.02rem] font-extrabold leading-[1.3]"
              : "font-heading text-xl font-black leading-[1.1]"
            }
            translate-y-0.5 transition-transform duration-300 group-hover:translate-y-0
          `}
        >
          {item.name}
        </h3>

        {item.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/70">
            {item.description}
          </p>
        )}

        <ExploreLink label={copy.explore} small />
      </div>
    </Link>
  )
}

// ─── Explore CTA link row ───────────────────────────────────────────────────

function ExploreLink({ label, small = false }: { label: string; small?: boolean }) {
  return (
    <span
      className={`
        mt-4 inline-flex items-center gap-1.5 font-semibold text-[#e8c898]
        ${small ? "text-[11px]" : "text-[13px]"}
        -translate-x-1 opacity-0 transition-all duration-300
        group-hover:translate-x-0 group-hover:opacity-100
      `}
    >
      {label}
      <ArrowRight
        className={small ? "h-3 w-3" : "h-4 w-4"}
        strokeWidth={2.2}
      />
    </span>
  )
}

// ─── Section header ─────────────────────────────────────────────────────────

function SectionHeader({ locale, items }: { locale: Locale; items: CategoryView[] }) {
  const copy = COPY[locale]

  return (
    <div data-animate className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div className="max-w-2xl">
        {/* Eyebrow */}
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9c6f3a]">
          {copy.eyebrow}
        </p>

        <h2
          className={`
            mt-3 text-[#1d1f22]
            ${locale === "th"
              ? "font-body text-[clamp(1.35rem,2.2vw,1.9rem)] font-extrabold leading-[1.28]"
              : "font-display text-[clamp(1.8rem,3vw,2.7rem)] font-bold leading-[1.06]"
            }
          `}
        >
          {copy.title}
        </h2>

        <p className="mt-3 max-w-[58ch] text-[14px] leading-[1.9] text-[#696e7a] sm:text-[15px]">
          {copy.summary}
        </p>
      </div>

      <Link
        href={withLocalePath("/categories", locale)}
        className="
          inline-flex items-center gap-2 rounded-full
          border border-[#d4c9b8] bg-[#fffdf9] px-4 py-2.5
          text-[12px] font-semibold text-[#3d4048]
          shadow-[0_1px_6px_rgba(29,31,34,.05)]
          transition-all duration-200 hover:border-[#9c6f3a] hover:text-[#9c6f3a]
          active:scale-[0.98]
        "
      >
        {uiText.categories.viewAll[locale]}
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
      </Link>
    </div>
  )
}

// ─── Grid layouts by item count ─────────────────────────────────────────────
//
//  4 items → featured (7col) + 3 small stacked right (5col)
//  5 items → featured (7col) + 4 small 2×2 right  (5col)  ← original
//  6 items → featured (6col) + 5 small irregular  (6col)

function CategoryGrid({ featured, rest, locale }: {
  featured: CategoryView
  rest: CategoryView[]
  locale: Locale
}) {
  // Clamp rest to max 5 so the right column never overflows
  const rightItems = rest.slice(0, 5)
  const isWide = rightItems.length <= 3

  return (
    <div className={`grid gap-4 lg:grid-cols-12`}>
      {/* Featured — wider when fewer right-side items */}
      <div data-animate="slide-left" className={isWide ? "lg:col-span-8" : "lg:col-span-7"}>
        <FeaturedCard item={featured} locale={locale} />
      </div>

      {/* Right column */}
      <div
        data-animate="slide-right"
        className={`anim-delay-120
          grid gap-4
          ${isWide ? "lg:col-span-4" : "lg:col-span-5"}
          ${rightItems.length >= 4 ? "sm:grid-cols-2" : "sm:grid-cols-1 lg:grid-cols-1"}
        `}
      >
        {rightItems.map((item, i) => (
          <SmallCard key={item.id} item={item} locale={locale} index={i} />
        ))}
      </div>
    </div>
  )
}

// ─── Root export ────────────────────────────────────────────────────────────

export default function CategorySection({
  items = [],
  locale,
}: CategorySectionProps) {
  if (items.length === 0) return null

  const [featured, ...rest] = items.slice(0, 6)
  if (!featured) return null

  return (
    <section
      aria-labelledby="category-section-heading"
      className="relative z-10 mx-auto max-w-7xl overflow-hidden px-4 py-12 sm:px-5 lg:py-16"
    >
      <SectionHeader locale={locale} items={items} />

      <CategoryGrid featured={featured} rest={rest} locale={locale} />
    </section>
  )
}