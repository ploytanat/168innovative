import Image from "next/image"
import Link from "next/link"

import { HOME_PRODUCT_SPOTLIGHT } from "@/app/lib/config/home-product-spotlight"
import { uiText } from "@/app/lib/i18n/ui"
import { ProductView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

const PRIMARY_META = {
  badge: { th: "สินค้าเด่น", en: "Featured Pick" },
  accentText: "#1e6645",
  accentBg: "#ddf0ea",
  imageBg: "linear-gradient(145deg, #edf8f2 0%, #fbfdfc 100%)",
  glow: "rgba(125, 196, 165, 0.24)",
}

const SECONDARY_META = {
  badge: { th: "แนะนำเพิ่มเติม", en: "Also Recommended" },
  accentText: "#7a4a1e",
  accentBg: "#f2e9dc",
  imageBg: "linear-gradient(145deg, #f8f0e5 0%, #fdfbf8 100%)",
  glow: "rgba(205, 160, 111, 0.22)",
}

const SECTION_COPY = {
  eyebrow: {
    th: "Product Focus",
    en: "Product Focus",
  },
  summary: {
    th: "คัดสินค้าบรรจุภัณฑ์เด่นให้ดูง่ายขึ้นในทุกหน้าจอ พร้อมลำดับความสำคัญที่ชัดและกดดูรายละเอียดได้เร็ว",
    en: "A cleaner, faster product showcase with clearer hierarchy and stronger visibility across every screen size.",
  },
  spoutSummary: {
    th: "รวมจุกและวาล์วสำหรับงานซองบรรจุอาหาร เครื่องดื่ม และงาน OEM ที่ต้องการภาพลักษณ์พร้อมขาย",
    en: "A focused selection of spouts and valves for food, beverage, and OEM pouch packaging.",
  },
  collectionSnapshot: {
    th: "ภาพรวมคอลเลกชัน",
    en: "Collection Snapshot",
  },
  curatedItems: {
    th: "รายการคัดสรร",
    en: "Curated items",
  },
  productGroups: {
    th: "กลุ่มสินค้า",
    en: "Product groups",
  },
  additionalProducts: {
    th: "สินค้าเพิ่มเติม",
    en: "More Products",
  },
  additionalSummary: {
    th: "เลือกดูสินค้าอื่นที่พร้อมต่อยอดเป็นคอลเลกชันเดียวกัน",
    en: "Explore the rest of the collection in a cleaner, easier-to-scan grid.",
  },
  viewProduct: {
    th: "ดูรายละเอียดสินค้า",
    en: "View product",
  },
  remainingCount: {
    th: "รายการเพิ่มเติม",
    en: "more items",
  },
  curatedCount: {
    th: "รายการแนะนำ",
    en: "featured items",
  },
} as const

type Locale = "th" | "en"
type ShowcaseMeta = typeof PRIMARY_META

interface ProductMarqueeProps {
  items: ProductView[]
  locale: Locale
}

export default function ProductMarquee({ items, locale }: ProductMarqueeProps) {
  if (!items.length) return null

  const isSpoutShowcase = items.every((item) => item.categorySlug === "spout")
  const { primaryItem, secondaryItem, gridItems } = resolveShowcaseItems(items)
  const visibleGridItems = gridItems.slice(0, 8)
  const categoryCount = new Set(items.map((item) => item.categorySlug)).size

  if (!primaryItem) return null

  const ctaHref = isSpoutShowcase ? "/categories/spout" : "/categories"
  const ctaLabel = isSpoutShowcase
    ? uiText.viewAllSpoutProducts[locale]
    : uiText.viewAllProducts[locale]
  const sectionTitle = isSpoutShowcase
    ? uiText.spoutProducts[locale]
    : uiText.featuredProducts[locale]
  const sectionSummary = isSpoutShowcase
    ? SECTION_COPY.spoutSummary[locale]
    : SECTION_COPY.summary[locale]

  return (
    <section className="relative overflow-hidden py-14 sm:py-16 lg:py-24">
      <div className="pointer-events-none absolute left-0 top-8 h-40 w-40 rounded-full bg-[rgba(46,207,196,0.1)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-[rgba(184,200,242,0.14)] blur-3xl" />

      <div className="mx-auto container px-6">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-[rgba(205,222,241,0.78)] bg-[linear-gradient(155deg,rgba(255,255,255,0.95),rgba(246,251,255,0.88)_48%,rgba(242,248,255,0.8)_100%)] px-5 py-6 shadow-[0_24px_65px_rgba(28,40,66,0.08)] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(46,207,196,0.12),transparent_24%),radial-gradient(circle_at_85%_18%,rgba(184,200,242,0.18),transparent_22%)]" />

          <div className="relative">
            <div className="mb-8 flex flex-col gap-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="eyebrow-label font-body">
                  {SECTION_COPY.eyebrow[locale]}
                </p>
                <h2 className="font-heading mt-3 text-[clamp(2rem,4vw,3.6rem)] leading-[1.05] tracking-tight text-[var(--color-ink)]">
                  {sectionTitle}
                </h2>
                <p className="font-body mt-4 max-w-xl text-sm leading-7 text-[var(--color-ink-soft)] sm:text-base sm:leading-8">
                  {sectionSummary}
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <div className="liquid-glass-pill rounded-full px-4 py-2.5 font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-[#5c6c85]">
                  {items.length} {SECTION_COPY.curatedCount[locale]}
                </div>
                <Link
                  href={withLocalePath(ctaHref, locale)}
                  className="btn-primary-soft group inline-flex items-center gap-2 rounded-full px-5 py-3 font-body text-[12px] font-semibold uppercase tracking-[0.12em]"
                >
                  <span>{ctaLabel}</span>
                  <ArrowRightIcon />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:gap-5">
              <ShowcaseCard
                item={primaryItem}
                locale={locale}
                href={getProductHref(primaryItem, locale)}
                meta={PRIMARY_META}
                actionLabel={SECTION_COPY.viewProduct[locale]}
                priority
                variant="primary"
              />

              <div className={`grid gap-4 ${secondaryItem ? "sm:grid-cols-2 xl:grid-cols-1" : ""}`}>
                {secondaryItem ? (
                  <ShowcaseCard
                    item={secondaryItem}
                    locale={locale}
                    href={getProductHref(secondaryItem, locale)}
                    meta={SECONDARY_META}
                    actionLabel={SECTION_COPY.viewProduct[locale]}
                    variant="secondary"
                  />
                ) : null}

                <div className="relative overflow-hidden rounded-[1.8rem] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(246,250,255,0.82)_100%)] p-5 shadow-[0_18px_44px_rgba(28,40,66,0.08)] sm:p-6">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(46,207,196,0.12),transparent_28%)]" />
                  <div className="relative">
                    <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6f8099]">
                      {SECTION_COPY.collectionSnapshot[locale]}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <StatCard value={items.length} label={SECTION_COPY.curatedItems[locale]} />
                      <StatCard value={categoryCount} label={SECTION_COPY.productGroups[locale]} />
                    </div>

                    {gridItems.length > 0 ? (
                      <p className="font-body mt-5 text-sm leading-7 text-[var(--color-ink-soft)]">
                        {locale === "th"
                          ? `แสดงสินค้าเพิ่มเติม ${visibleGridItems.length} รายการด้านล่าง พร้อมทางลัดไปดูคอลเลกชันทั้งหมดได้ทันที`
                          : `Showing ${visibleGridItems.length} additional products below, with a direct path to the full collection.`}
                      </p>
                    ) : (
                      <p className="font-body mt-5 text-sm leading-7 text-[var(--color-ink-soft)]">
                        {locale === "th"
                          ? "เลือกดูรายละเอียดสินค้าเด่นหรือเปิดดูทั้งคอลเลกชันเพื่อไปยังหน้าสินค้าเต็มรูปแบบ"
                          : "Open a featured product or jump into the full collection for the complete catalog view."}
                      </p>
                    )}

                    <Link
                      href={withLocalePath(ctaHref, locale)}
                      className="group mt-6 inline-flex items-center gap-2 border-b border-[#b7c8dd] pb-1 font-body text-[13px] font-semibold uppercase tracking-[0.12em] text-[#51627c] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-ink)]"
                    >
                      <span>{ctaLabel}</span>
                      <ArrowRightIcon />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {visibleGridItems.length > 0 ? (
              <div className="mt-6 rounded-[1.9rem] border border-[rgba(214,228,242,0.86)] bg-white/78 p-4 shadow-[0_18px_44px_rgba(28,40,66,0.06)] backdrop-blur sm:mt-7 sm:p-6">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6f8099]">
                      {SECTION_COPY.additionalProducts[locale]}
                    </p>
                    <h3 className="font-heading mt-2 text-xl tracking-tight text-[var(--color-ink)] sm:text-2xl">
                      {SECTION_COPY.additionalSummary[locale]}
                    </h3>
                  </div>
                  <div className="font-body text-sm text-[#6f8099]">
                    {visibleGridItems.length} {SECTION_COPY.remainingCount[locale]}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {visibleGridItems.map((item) => (
                    <ProductCard key={item.id} item={item} locale={locale} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

function resolveShowcaseItems(items: ProductView[]) {
  const orderedSpotlights = [
    items.find((item) => item.slug === HOME_PRODUCT_SPOTLIGHT.primary),
    items.find((item) => item.slug === HOME_PRODUCT_SPOTLIGHT.secondary),
  ].filter((item): item is ProductView => Boolean(item))

  const fallbackItems = items.filter(
    (item) => !orderedSpotlights.some((spotlight) => spotlight.id === item.id)
  )

  const primaryItem = orderedSpotlights[0] ?? items[0] ?? null
  const secondaryItem =
    orderedSpotlights[1] ??
    fallbackItems.find((item) => item.id !== primaryItem?.id) ??
    null

  const selectedIds = new Set(
    [primaryItem?.id, secondaryItem?.id].filter((id): id is string => Boolean(id))
  )

  return {
    primaryItem,
    secondaryItem,
    gridItems: items.filter((item) => !selectedIds.has(item.id)),
  }
}

function ShowcaseCard({
  item,
  locale,
  href,
  meta,
  actionLabel,
  priority = false,
  variant,
}: {
  item: ProductView
  locale: Locale
  href: string
  meta: ShowcaseMeta
  actionLabel: string
  priority?: boolean
  variant: "primary" | "secondary"
}) {
  const isPrimary = variant === "primary"

  return (
    <Link
      href={href}
      className="group relative isolate overflow-hidden rounded-[1.9rem] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(246,250,255,0.82)_100%)] p-4 shadow-[0_18px_44px_rgba(28,40,66,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(28,40,66,0.12)] sm:p-5"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background: `radial-gradient(circle at top right, ${meta.glow} 0%, transparent 34%), linear-gradient(145deg, rgba(255,255,255,0.94) 0%, rgba(246,250,255,0.82) 100%)`,
        }}
      />

      <div
        className={`relative grid gap-5 ${
          isPrimary
            ? "lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center"
            : "md:grid-cols-[auto_minmax(0,1fr)] md:items-center"
        }`}
      >
        <div
          className={`relative overflow-hidden rounded-[1.6rem] border border-white/75 ${
            isPrimary
              ? "aspect-[5/4] sm:aspect-square lg:order-2"
              : "aspect-square w-full md:w-40"
          }`}
        >
          <div className="absolute inset-0" style={{ background: meta.imageBg }} />
          <div className="absolute inset-x-8 top-6 h-16 rounded-full bg-white/45 blur-2xl" />
          <Image
            src={item.image.src}
            alt={item.image.alt || item.name}
            fill
            sizes={
              isPrimary
                ? "(max-width: 640px) 100vw, (max-width: 1280px) 48vw, 34vw"
                : "(max-width: 768px) 100vw, 22vw"
            }
            className="object-contain p-[12%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            priority={priority}
          />
        </div>

        <div className={isPrimary ? "lg:order-1" : "min-w-0"}>
          <span
            className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ background: meta.accentBg, color: meta.accentText }}
          >
            {!isPrimary ? (
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
            ) : null}
            {meta.badge[locale]}
          </span>

          <h3
            className={`font-heading mt-4 tracking-tight text-[var(--color-ink)] ${
              isPrimary
                ? "text-2xl leading-tight sm:text-[2rem]"
                : "text-xl leading-tight"
            }`}
          >
            {item.name}
          </h3>

          {item.description ? (
            <p
              className={`font-body mt-3 text-[var(--color-ink-soft)] ${
                isPrimary
                  ? "max-w-lg text-sm leading-7 sm:text-base sm:leading-8"
                  : "line-clamp-3 text-sm leading-7"
              }`}
            >
              {item.description}
            </p>
          ) : null}

          <div
            className={`font-body mt-5 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] ${
              isPrimary ? "text-[var(--color-ink)]" : "text-[#5f6f88]"
            }`}
          >
            <span>{actionLabel}</span>
            <ArrowRightIcon />
          </div>
        </div>
      </div>
    </Link>
  )
}

function ProductCard({
  item,
  locale,
}: {
  item: ProductView
  locale: Locale
}) {
  return (
    <Link
      href={getProductHref(item, locale)}
      className="group overflow-hidden rounded-[1.5rem] border border-[rgba(214,228,242,0.92)] bg-white/92 p-2.5 shadow-[0_14px_34px_rgba(28,40,66,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(28,40,66,0.1)]"
    >
      <div className="relative aspect-square overflow-hidden rounded-[1.2rem] bg-[linear-gradient(155deg,#f4f8fb_0%,#eef6fb_100%)]">
        <div className="absolute inset-x-6 top-4 h-10 rounded-full bg-white/60 blur-xl" />
        <Image
          src={item.image.src}
          alt={item.image.alt || item.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-[12%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
      </div>

      <div className="px-2 py-4 sm:px-2.5">
        <h4 className="font-body text-sm font-semibold leading-6 text-[var(--color-ink)] transition-colors group-hover:text-[#179ea3]">
          {item.name}
        </h4>
        {item.description ? (
          <p className="font-body mt-2 line-clamp-2 text-[13px] leading-6 text-[#6f8099]">
            {item.description}
          </p>
        ) : null}
      </div>
    </Link>
  )
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-[1.3rem] border border-[rgba(214,228,242,0.92)] bg-white/88 px-4 py-4 shadow-[0_10px_24px_rgba(28,40,66,0.04)]">
      <div className="font-heading text-2xl leading-none text-[var(--color-ink)]">
        {value}
      </div>
      <div className="font-body mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6f8099]">
        {label}
      </div>
    </div>
  )
}

function getProductHref(item: ProductView, locale: Locale) {
  return withLocalePath(`/categories/${item.categorySlug}/${item.slug}`, locale)
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
      <path
        d="M13 7l5 5m0 0l-5 5m5-5H6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
      />
    </svg>
  )
}
