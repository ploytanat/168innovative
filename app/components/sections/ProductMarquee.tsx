import Image from "next/image"
import Link from "next/link"

import {
  COLORS,
  CTA_BUTTON_STYLE,
  CTA_GRADIENT,
  EYEBROW_PILL_STYLE,
  GLASS,
} from "@/app/components/ui/designSystem"
import { HOME_PRODUCT_SPOTLIGHT } from "@/app/lib/config/home-product-spotlight"
import { uiText } from "@/app/lib/i18n/ui"
import { ProductView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

const MARQUEE_PALETTE = {
  cloud: "#F8F9FB",
  white: "#FFFFFF",
  blushHint: "#F5F0F2",
  steel: "#E2E8EE",
} as const

const MARQUEE_SECTION_BG = `linear-gradient(160deg, ${MARQUEE_PALETTE.cloud} 0%, ${MARQUEE_PALETTE.blushHint} 56%, ${MARQUEE_PALETTE.white} 100%)`

const PRIMARY_META = {
  badge:     { th: "สินค้าเด่น",       en: "Featured Pick" },
  accentText: "#3a4a5c",
  accentBg:   MARQUEE_PALETTE.steel,
  imageBg:    `radial-gradient(circle at 82% 16%,${MARQUEE_PALETTE.steel} 0%,transparent 26%), linear-gradient(145deg,${MARQUEE_PALETTE.white},${MARQUEE_PALETTE.cloud})`,
  glow:       "rgba(226,232,238,0.90)",
}

const SECONDARY_META = {
  badge:     { th: "แนะนำเพิ่มเติม",   en: "Also Recommended" },
  accentText: "#3a4a5c",
  accentBg:   MARQUEE_PALETTE.blushHint,
  imageBg:    `radial-gradient(circle at 82% 16%,${MARQUEE_PALETTE.blushHint} 0%,transparent 24%), linear-gradient(145deg,${MARQUEE_PALETTE.white},${MARQUEE_PALETTE.cloud})`,
  glow:       "rgba(245,240,242,0.90)",
}

const SECTION_COPY = {
  eyebrow:            { th: "Product Focus",                                                                           en: "Product Focus" },
  summary:            { th: "คัดสินค้าบรรจุภัณฑ์เด่นให้ดูง่ายขึ้นในทุกหน้าจอ พร้อมลำดับความสำคัญที่ชัดและกดดูรายละเอียดได้เร็ว", en: "A cleaner, faster product showcase with clearer hierarchy and stronger visibility across every screen size." },
  spoutSummary:       { th: "รวมจุกและวาล์วสำหรับงานซองบรรจุอาหาร เครื่องดื่ม และงาน OEM ที่ต้องการภาพลักษณ์พร้อมขาย",              en: "A focused selection of spouts and valves for food, beverage, and OEM pouch packaging." },
  collectionSnapshot: { th: "ภาพรวมคอลเลกชัน",                                                                        en: "Collection Snapshot" },
  curatedItems:       { th: "รายการคัดสรร",                                                                             en: "Curated items" },
  productGroups:      { th: "กลุ่มสินค้า",                                                                              en: "Product groups" },
  additionalProducts: { th: "สินค้าเพิ่มเติม",                                                                          en: "More Products" },
  additionalSummary:  { th: "เลือกดูสินค้าอื่นที่พร้อมต่อยอดเป็นคอลเลกชันเดียวกัน",                                     en: "Explore the rest of the collection in a cleaner, easier-to-scan grid." },
  viewProduct:        { th: "ดูรายละเอียดสินค้า",                                                                        en: "View product" },
  remainingCount:     { th: "รายการเพิ่มเติม",                                                                          en: "more items" },
  curatedCount:       { th: "รายการแนะนำ",                                                                              en: "featured items" },
} as const

type Locale       = "th" | "en"
type ShowcaseMeta = typeof PRIMARY_META

interface ProductMarqueeProps { items: ProductView[]; locale: Locale }

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ProductMarquee({ items, locale }: ProductMarqueeProps) {
  if (!items.length) return null

  const isSpoutShowcase = items.every(i => i.categorySlug === "spout")
  const { primaryItem, secondaryItem, gridItems } = resolveShowcaseItems(items)
  const visibleGridItems = gridItems.slice(0, 8)
  const categoryCount    = new Set(items.map(i => i.categorySlug)).size

  if (!primaryItem) return null

  const ctaHref        = isSpoutShowcase ? "/categories/spout" : "/categories"
  const ctaLabel       = isSpoutShowcase ? uiText.viewAllSpoutProducts[locale] : uiText.viewAllProducts[locale]
  const sectionTitle   = isSpoutShowcase ? uiText.spoutProducts[locale]         : uiText.featuredProducts[locale]
  const sectionSummary = isSpoutShowcase ? SECTION_COPY.spoutSummary[locale]    : SECTION_COPY.summary[locale]

  return (
    <section
      className="relative overflow-hidden py-14 sm:py-16 lg:py-24"
      style={{ background: MARQUEE_SECTION_BG }}
    >
      {/* Top edge shimmer */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.85),transparent)" }}
      />

      <div className="mx-auto max-w-7xl px-6">
        <div className="relative border-t pt-6" style={{ borderColor: MARQUEE_PALETTE.steel }}>

          {/* ── Section header ─────────────────────────────────────── */}
          <div className="mb-8 flex flex-col gap-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              {/* Eyebrow pill */}
              <span
                className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]"
                style={{
                  ...EYEBROW_PILL_STYLE,
                  background: MARQUEE_PALETTE.white,
                  border: `1px solid ${MARQUEE_PALETTE.steel}`,
                }}
              >
                {SECTION_COPY.eyebrow[locale]}
              </span>

              <h2
                className="font-heading mt-4 text-[clamp(2rem,4vw,3.6rem)] leading-[1.05] tracking-tight"
                style={{ color: COLORS.dark }}
              >
                {sectionTitle}
              </h2>

              {/* Accent divider */}
              <div
                className="my-5 h-[3px] w-12 rounded-full"
                style={{ background: CTA_GRADIENT }}
              />

              <p className="max-w-xl text-sm leading-7 sm:text-base sm:leading-8" style={{ color: COLORS.mid }}>
                {sectionSummary}
              </p>
            </div>

            {/* Right cluster */}
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <div
                className="rounded-xl px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em]"
                style={{
                  ...GLASS.card,
                  background: MARQUEE_PALETTE.white,
                  border: `1px solid ${MARQUEE_PALETTE.steel}`,
                  color: COLORS.mid,
                }}
              >
                {items.length} {SECTION_COPY.curatedCount[locale]}
              </div>

              <Link
                href={withLocalePath(ctaHref, locale)}
                className="group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[11.5px] font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
                style={CTA_BUTTON_STYLE}
              >
                <span>{ctaLabel}</span>
                <ArrowRightIcon />
              </Link>
            </div>
          </div>

          {/* ── Showcase grid ──────────────────────────────────────── */}
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:gap-5">

            <ShowcaseCard
              item={primaryItem} locale={locale} href={getProductHref(primaryItem, locale)}
              meta={PRIMARY_META} actionLabel={SECTION_COPY.viewProduct[locale]} priority variant="primary"
            />

            <div className={`grid gap-4 ${secondaryItem ? "sm:grid-cols-2 xl:grid-cols-1" : ""}`}>
              {secondaryItem && (
                <ShowcaseCard
                  item={secondaryItem} locale={locale} href={getProductHref(secondaryItem, locale)}
                  meta={SECONDARY_META} actionLabel={SECTION_COPY.viewProduct[locale]} variant="secondary"
                />
              )}

              {/* Stats / snapshot — glass tier 3 */}
              <div
                className="relative overflow-hidden rounded-2xl p-5 sm:p-6"
                style={{
                  ...GLASS.stats,
                  background: MARQUEE_PALETTE.cloud,
                  border: `1px solid ${MARQUEE_PALETTE.steel}`,
                }}
              >
                {/* Top shimmer */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.90),transparent)" }}
                />

                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.20em]"
                  style={{ color: "#5a6a7c" }}
                >
                  {SECTION_COPY.collectionSnapshot[locale]}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <StatCard value={items.length}  label={SECTION_COPY.curatedItems[locale]} />
                  <StatCard value={categoryCount} label={SECTION_COPY.productGroups[locale]} />
                </div>

                <p className="mt-5 text-sm leading-7" style={{ color: "#3a4a5c" }}>
                  {gridItems.length > 0
                    ? locale === "th"
                      ? `แสดงสินค้าเพิ่มเติม ${visibleGridItems.length} รายการด้านล่าง พร้อมทางลัดไปดูคอลเลกชันทั้งหมดได้ทันที`
                      : `Showing ${visibleGridItems.length} additional products below, with a direct path to the full collection.`
                    : locale === "th"
                      ? "เลือกดูรายละเอียดสินค้าเด่นหรือเปิดดูทั้งคอลเลกชันเพื่อไปยังหน้าสินค้าเต็มรูปแบบ"
                      : "Open a featured product or jump into the full collection for the complete catalog view."}
                </p>

                <Link
                  href={withLocalePath(ctaHref, locale)}
                  className="group mt-6 inline-flex items-center gap-2 border-b pb-1 text-[13px] font-semibold uppercase tracking-[0.12em] transition-opacity hover:opacity-70"
                  style={{ borderColor: MARQUEE_PALETTE.steel, color: "#2a3a52" }}
                >
                  <span>{ctaLabel}</span>
                  <ArrowRightIcon />
                </Link>
              </div>
            </div>
          </div>

          {/* ── Additional product grid ─────────────────────────────── */}
          {visibleGridItems.length > 0 && (
            <div
              className="mt-8 border-t pt-6 sm:mt-10 sm:pt-8"
              style={{ borderColor: MARQUEE_PALETTE.steel }}
            >
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: "#5a6a7c" }}
                  >
                    {SECTION_COPY.additionalProducts[locale]}
                  </p>
                  <h3
                    className="font-heading mt-2 text-lg tracking-tight sm:text-[1.6rem]"
                    style={{ color: "#1a2232" }}
                  >
                    {SECTION_COPY.additionalSummary[locale]}
                  </h3>
                </div>
                <p className="text-sm" style={{ color: "#5a6a7c" }}>
                  {visibleGridItems.length} {SECTION_COPY.remainingCount[locale]}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {visibleGridItems.map(item => (
                  <ProductCard key={item.id} item={item} locale={locale} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveShowcaseItems(items: ProductView[]) {
  const spotlights = [
    items.find(i => i.slug === HOME_PRODUCT_SPOTLIGHT.primary),
    items.find(i => i.slug === HOME_PRODUCT_SPOTLIGHT.secondary),
  ].filter((i): i is ProductView => Boolean(i))

  const fallbacks     = items.filter(i => !spotlights.some(s => s.id === i.id))
  const primaryItem   = spotlights[0] ?? items[0] ?? null
  const secondaryItem = spotlights[1] ?? fallbacks.find(i => i.id !== primaryItem?.id) ?? null
  const selectedIds   = new Set(
    [primaryItem?.id, secondaryItem?.id].filter((id): id is string => Boolean(id))
  )
  return { primaryItem, secondaryItem, gridItems: items.filter(i => !selectedIds.has(i.id)) }
}

function getProductHref(item: ProductView, locale: Locale) {
  return withLocalePath(`/categories/${item.categorySlug}/${item.slug}`, locale)
}

// ─── ShowcaseCard ─────────────────────────────────────────────────────────────

function ShowcaseCard({
  item, locale, href, meta, actionLabel, priority = false, variant,
}: {
  item: ProductView; locale: Locale; href: string; meta: ShowcaseMeta
  actionLabel: string; priority?: boolean; variant: "primary" | "secondary"
}) {
  const isPrimary = variant === "primary"
  const glassStyle = isPrimary ? GLASS.primary : GLASS.secondary

  return (
    <Link
      href={href}
      className="group relative isolate overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(30,40,60,0.14)]"
      style={{
        ...glassStyle,
        background: isPrimary ? MARQUEE_PALETTE.white : MARQUEE_PALETTE.cloud,
        border: `1px solid ${MARQUEE_PALETTE.steel}`,
      }}
    >
      {/* Subtle glow behind image area */}
      <div
        className="pointer-events-none absolute -top-12 -right-12 h-56 w-56 rounded-full"
        style={{ background: meta.glow, filter: "blur(52px)" }}
      />
      {/* Top shimmer */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.95),transparent)" }}
      />

      <div
        className={`relative p-5 sm:p-6 grid gap-5 ${
          isPrimary
            ? "lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center"
            : "md:grid-cols-[auto_minmax(0,1fr)] md:items-center"
        }`}
      >
        {/* Image */}
        <div
          className={`relative overflow-hidden rounded-xl ${
            isPrimary ? "aspect-[5/4] sm:aspect-square lg:order-2" : "aspect-square w-full md:w-40"
          }`}
          style={{
            background: meta.imageBg,
            border: `1px solid ${MARQUEE_PALETTE.steel}`,
          }}
        >
          <div className="absolute inset-x-8 top-6 h-14 rounded-full blur-2xl bg-white/60" />
          <Image
            src={item.image.src}
            alt={item.image.alt || item.name}
            fill
            sizes={
              isPrimary
                ? "(max-width:640px) 100vw, (max-width:1280px) 48vw, 34vw"
                : "(max-width:768px) 100vw, 22vw"
            }
            className="object-contain p-[12%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            priority={priority}
          />
        </div>

        {/* Text */}
        <div className={isPrimary ? "lg:order-1" : "min-w-0"}>
          {/* Badge */}
          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{
              background: meta.accentBg,
              color: meta.accentText,
              border: `1px solid ${MARQUEE_PALETTE.steel}`,
            }}
          >
            {!isPrimary && <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />}
            {meta.badge[locale]}
          </span>

          {/* Title */}
          <h3
            className={`font-heading mt-4 tracking-tight ${
              isPrimary ? "text-2xl leading-tight sm:text-[2rem]" : "text-xl leading-tight"
            }`}
            style={{ color: "#1a2232" }}
          >
            {item.name}
          </h3>

          {/* Accent divider — primary only */}
          {isPrimary && (
            <div
              className="my-4 h-[3px] w-10 rounded-full"
              style={{ background: "linear-gradient(90deg,#3a7bd5,#2ab8b0)" }}
            />
          )}

          {/* Description */}
          {item.description && (
            <p
              className={`text-sm leading-7 ${isPrimary ? "max-w-lg sm:text-base sm:leading-8" : "line-clamp-3 mt-2"}`}
              style={{ color: "#3a4a5c" }}
            >
              {item.description}
            </p>
          )}

          {/* CTA */}
          <div
            className="mt-5 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em]"
            style={{ color: "#2a3a52" }}
          >
            <span>{actionLabel}</span>
            <ArrowRightIcon />
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── ProductCard ──────────────────────────────────────────────────────────────

function ProductCard({ item, locale }: { item: ProductView; locale: Locale }) {
  return (
    <Link
      href={getProductHref(item, locale)}
      className="group overflow-hidden rounded-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(30,40,60,0.10)]"
      style={{
        ...GLASS.card,
        background: MARQUEE_PALETTE.white,
        border: `1px solid ${MARQUEE_PALETTE.steel}`,
      }}
    >
      {/* Image area */}
      <div
        className="relative aspect-square overflow-hidden rounded-t-xl"
        style={{
          background:
            `radial-gradient(circle at 80% 18%,${MARQUEE_PALETTE.blushHint},transparent 22%), linear-gradient(155deg,${MARQUEE_PALETTE.white} 0%,${MARQUEE_PALETTE.cloud} 100%)`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.95),transparent)" }}
        />
        <div className="absolute inset-x-6 top-4 h-10 rounded-full bg-white/80 blur-xl" />
        <Image
          src={item.image.src}
          alt={item.image.alt || item.name}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          className="object-contain p-[12%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
      </div>

      {/* Text */}
      <div className="px-3 py-4 sm:px-3.5">
        <h4 className="text-sm font-semibold leading-6" style={{ color: "#1a2232" }}>
          {item.name}
        </h4>
        {item.description && (
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-6" style={{ color: "#3a4a5c" }}>
            {item.description}
          </p>
        )}
      </div>
    </Link>
  )
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="rounded-xl px-4 py-4"
      style={{
        background: MARQUEE_PALETTE.white,
        border: `1px solid ${MARQUEE_PALETTE.steel}`,
      }}
    >
      <div
        className="font-heading text-2xl font-black leading-none"
        style={{ color: "#1a2232" }}
      >
        {value}
      </div>
      <div
        className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em]"
        style={{ color: "#5a6a7c" }}
      >
        {label}
      </div>
    </div>
  )
}

// ─── Icon ─────────────────────────────────────────────────────────────────────

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
    >
      <path
        d="M13 7l5 5m0 0l-5 5m5-5H6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
      />
    </svg>
  )
}
