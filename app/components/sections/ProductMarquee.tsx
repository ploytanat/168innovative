import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import Placeholder from "@/app/components/ui/Placeholder"
import type { ProductView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

type Locale = "th" | "en"

interface ProductGridProps {
  items: ProductView[]
  locale: Locale
  limit?: number
  variant?: "featured" | "new" | "popular"
}

const SECTION_COPY = {
  featured: {
    th: { eyebrow: "คัดสรรพิเศษ", title: "สินค้าเด่น", viewAll: "ดูทั้งหมด" },
    en: { eyebrow: "Curated for you", title: "Featured Products", viewAll: "View all" },
  },
  new: {
    th: { eyebrow: "มาใหม่", title: "สินค้าใหม่ล่าสุด", viewAll: "ดูทั้งหมด" },
    en: { eyebrow: "Just arrived", title: "New Releases", viewAll: "View all" },
  },
  popular: {
    th: { eyebrow: "นิยมสูงสุด", title: "รุ่นยอดนิยม", viewAll: "ดูทั้งหมด" },
    en: { eyebrow: "Most requested", title: "Popular Products", viewAll: "View all" },
  },
} as const

const BADGE_CYCLE = [
  { th: "ขายดี",  en: "Best Seller", cls: "bg-[#141412] text-white" },
  { th: "นิยม",   en: "Popular",     cls: "bg-[#4c6b35] text-white" },
  { th: "OEM",    en: "OEM",         cls: "bg-[#b06b78] text-white" },
  { th: "มาใหม่", en: "New",         cls: "bg-[#3d6b5a] text-white" },
  { th: "Custom", en: "Custom",      cls: "bg-[#5a5a8a] text-white" },
] as const

function productHref(item: ProductView, locale: Locale) {
  return withLocalePath(`/categories/${item.categorySlug}/${item.slug}`, locale)
}

function variantLabel(item: ProductView, locale: Locale) {
  const n = Math.max(item.variantCount, 1)
  return locale === "th" ? `${n} แบบย่อย` : `${n} variant${n !== 1 ? "s" : ""}`
}

function ProductCard({ item, index, locale }: { item: ProductView; index: number; locale: Locale }) {
  const href = productHref(item, locale)
  const badge = BADGE_CYCLE[index % BADGE_CYCLE.length]
  const moqLabel = item.moq
    ? `MOQ ${item.moq}`
    : locale === "th" ? "สอบถาม MOQ" : "MOQ on request"

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[1.1rem] border border-[#e3e1da] bg-white transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(20,20,18,0.10)]">
      <Link href={href} className="relative block aspect-square overflow-hidden bg-[#f1f0ec]">
        {item.image?.src ? (
          <Image
            src={item.image.src}
            alt={item.image.alt ?? item.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <Placeholder label={item.name} variant="product" className="h-full w-full" />
        )}

        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${badge.cls}`}>
          {badge[locale]}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <Link href={href}>
          <h3 className="line-clamp-2 text-[13px] font-bold leading-snug text-[#141412] transition-colors duration-200 group-hover:text-[#4c6b35]">
            {item.name}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-[#f0efeb] px-2.5 py-0.5 text-[10px] font-medium text-[#5a5a54]">
            {variantLabel(item, locale)}
          </span>
          <span className="rounded-full bg-[#f0efeb] px-2.5 py-0.5 text-[10px] font-medium text-[#5a5a54]">
            {moqLabel}
          </span>
        </div>

        <Link
          href={href}
          className="mt-auto pt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#4c6b35] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        >
          {locale === "th" ? "ดูสินค้า" : "View product"}
          <ArrowRight className="h-3 w-3" strokeWidth={2.2} />
        </Link>
      </div>
    </article>
  )
}

export default function ProductGrid({
  items,
  locale,
  limit = 8,
  variant = "featured",
}: ProductGridProps) {
  if (!items.length) return null

  const shown = items.slice(0, limit)
  const copy = SECTION_COPY[variant][locale]

  return (
    <section
      aria-labelledby="product-grid-heading"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14"
    >
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#4c6b35]">
            {copy.eyebrow}
          </p>
          <h2
            id="product-grid-heading"
            className={`mt-2 text-[#141412] ${
              locale === "th"
                ? "font-body text-[clamp(1.4rem,2.5vw,2rem)] font-extrabold"
                : "font-display text-[clamp(1.6rem,2.8vw,2.4rem)] font-bold"
            }`}
          >
            {copy.title}
          </h2>
        </div>

        <Link
          href={withLocalePath("/categories", locale)}
          className="shrink-0 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#4c6b35] transition-colors duration-200 hover:text-[#374f26]"
        >
          {copy.viewAll}
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
        {shown.map((item, i) => (
          <ProductCard key={item.id} item={item} index={i} locale={locale} />
        ))}
      </div>
    </section>
  )
}
