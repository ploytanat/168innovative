import Image from "next/image"
import Link from "next/link"

import { HOME_PRODUCT_SPOTLIGHT } from "@/app/lib/config/home-product-spotlight"
import { uiText } from "@/app/lib/i18n/ui"
import { ProductView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

import { CONTAINER, HOME, SECTION_HEADING, SECTION_PAD } from "./home-theme"

type Locale = "th" | "en"

const COPY = {
  eyebrow:     { th: "สินค้า",                                                        en: "Products" },
  summary:     { th: "คัดบรรจุภัณฑ์เด่นที่พร้อมส่งและต่อยอดเป็นคอลเลกชันของแบรนด์คุณ", en: "A curated set of packaging ready to ship and build your brand around." },
  spoutSummary:{ th: "รวมจุกและวาล์วสำหรับงานซองบรรจุอาหาร เครื่องดื่ม และงาน OEM",     en: "Spouts and valves for food, beverage, and OEM pouch packaging." },
  featured:    { th: "สินค้าเด่น",                                                    en: "Featured" },
  viewProduct: { th: "ดูรายละเอียด",                                                  en: "View product" },
  itemsLabel:  { th: "รายการ",                                                        en: "items" },
} as const

interface ProductMarqueeProps { items: ProductView[]; locale: Locale }

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ProductMarquee({ items, locale }: ProductMarqueeProps) {
  if (!items.length) return null

  const isSpoutShowcase = items.every(i => i.categorySlug === "spout")
  const { primaryItem, gridItems } = resolveShowcaseItems(items)
  if (!primaryItem) return null

  const visibleGridItems = gridItems.slice(0, 8)

  const ctaHref      = isSpoutShowcase ? "/categories/spout" : "/categories"
  const ctaLabel     = isSpoutShowcase ? uiText.viewAllSpoutProducts[locale] : uiText.viewAllProducts[locale]
  const sectionTitle = isSpoutShowcase ? uiText.spoutProducts[locale]        : uiText.featuredProducts[locale]
  const summary      = isSpoutShowcase ? COPY.spoutSummary[locale]           : COPY.summary[locale]

  return (
    <section className={`relative ${SECTION_PAD}`} style={{ background: HOME.surface }}>
      <div className={CONTAINER}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Eyebrow label={COPY.eyebrow[locale]} />
            <h2
              className={`mt-4 ${SECTION_HEADING} font-bold text-[clamp(1.9rem,1.3rem+1.9vw,2.9rem)]`}
              style={{ color: HOME.ink }}
            >
              {sectionTitle}
            </h2>
            <p className="mt-4 text-[0.97rem] leading-[1.8]" style={{ color: HOME.inkMid }}>
              {summary}
            </p>
          </div>

          <Link
            href={withLocalePath(ctaHref, locale)}
            className="home-btn home-btn-outline group inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-5 py-3 text-[12.5px] font-semibold"
          >
            <span>{ctaLabel}</span>
            <ArrowRightIcon />
          </Link>
        </div>

        {/* ── Featured product ───────────────────────────────────── */}
        <Link
          href={getProductHref(primaryItem, locale)}
          className="home-card group mt-9 grid overflow-hidden rounded-2xl lg:mt-12 lg:grid-cols-2"
          style={{ border: `1px solid ${HOME.line}`, background: HOME.surface }}
        >
          <div
            className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[360px]"
            style={{ background: `radial-gradient(circle at 70% 22%, ${HOME.accentTint} 0%, transparent 58%), ${HOME.paper}` }}
          >
            <Image
              src={primaryItem.image.src}
              alt={primaryItem.image.alt || primaryItem.name}
              fill priority
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-contain p-8 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] sm:p-12"
            />
          </div>

          <div className="flex flex-col justify-center gap-4 p-7 sm:p-10 lg:p-12">
            <span
              className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
              style={{ background: HOME.accentTint, color: HOME.accentInk }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: HOME.accent }} />
              {COPY.featured[locale]}
            </span>

            <h3
              className={`${SECTION_HEADING} font-bold text-[clamp(1.5rem,1.1rem+1.1vw,2.15rem)]`}
              style={{ color: HOME.ink }}
            >
              {primaryItem.name}
            </h3>

            {primaryItem.description && (
              <p className="max-w-md text-[0.97rem] leading-[1.8]" style={{ color: HOME.inkMid }}>
                {primaryItem.description}
              </p>
            )}

            <span
              className="mt-1 inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: HOME.accent }}
            >
              {COPY.viewProduct[locale]}
              <ArrowRightIcon />
            </span>
          </div>
        </Link>

        {/* ── Product grid ───────────────────────────────────────── */}
        {visibleGridItems.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mt-5 lg:grid-cols-4">
            {visibleGridItems.map(item => (
              <ProductCard key={item.id} item={item} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveShowcaseItems(items: ProductView[]) {
  const spotlight = items.find(i => i.slug === HOME_PRODUCT_SPOTLIGHT.primary)
  const primaryItem = spotlight ?? items[0] ?? null
  const gridItems = items.filter(i => i.id !== primaryItem?.id)
  return { primaryItem, gridItems }
}

function getProductHref(item: ProductView, locale: Locale) {
  return withLocalePath(`/categories/${item.categorySlug}/${item.slug}`, locale)
}

// ─── ProductCard ──────────────────────────────────────────────────────────────

function ProductCard({ item, locale }: { item: ProductView; locale: Locale }) {
  return (
    <Link
      href={getProductHref(item, locale)}
      className="home-card group flex flex-col overflow-hidden rounded-xl"
      style={{ border: `1px solid ${HOME.line}`, background: HOME.surface }}
    >
      <div
        className="relative aspect-square overflow-hidden"
        style={{ background: `radial-gradient(circle at 72% 20%, ${HOME.accentTint} 0%, transparent 60%), ${HOME.paper}` }}
      >
        <Image
          src={item.image.src}
          alt={item.image.alt || item.name}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          className="object-contain p-[14%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-4 py-4">
        <h4 className="text-[0.92rem] font-semibold leading-[1.45]" style={{ color: HOME.ink }}>
          {item.name}
        </h4>
        {item.description && (
          <p className="line-clamp-2 text-[0.82rem] leading-[1.6]" style={{ color: HOME.inkSoft }}>
            {item.description}
          </p>
        )}
      </div>
    </Link>
  )
}

// ─── Bits ─────────────────────────────────────────────────────────────────────

function Eyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-9" style={{ background: HOME.accent }} />
      <span
        className="text-[11px] font-semibold uppercase tracking-[0.2em]"
        style={{ color: HOME.accent }}
      >
        {label}
      </span>
    </div>
  )
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
    >
      <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} />
    </svg>
  )
}
