"use client"

import Image from "next/image"
import Link from "next/link"

import { uiText } from "@/app/lib/i18n/ui"
import { ProductView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

/* ─────────────────────────────
   spotlight slugs
───────────────────────────── */

const PRIMARY_SLUG   = "oil-spout-os200"
const SECONDARY_SLUG = "coffee-bag-valve-hl400-40mm"

const PRIMARY_META = {
  badge:      { th: "สินค้าเด่น · Spout",        en: "Featured · Spout"   },
  accentText: "#1e6645",
  accentBg:   "#ddf0ea",
  imageBg:    "#eef4f2",
}

const SECONDARY_META = {
  badge:      { th: "สินค้าใหม่ · Coffee Valve", en: "New · Coffee Valve" },
  accentText: "#7a4a1e",
  accentBg:   "#f2e9dc",
  imageBg:    "#f7f2ec",
}

interface ProductMarqueeProps {
  items:  ProductView[]
  locale: "th" | "en"
}

export default function ProductMarquee({ items, locale }: ProductMarqueeProps) {
  if (!items.length) return null

  const isSpoutShowcase = items.every((i) => i.categorySlug === "spout")

  let primaryItem = items.find((i) => i.slug === PRIMARY_SLUG) ?? null
  const secondaryItem = items.find((i) => i.slug === SECONDARY_SLUG) ?? null
  if (!primaryItem) primaryItem = items.find((i) => i.slug !== SECONDARY_SLUG) ?? null
  if (items.length === 1) primaryItem = null

  const restItems = items.filter(
    (i) => i.slug !== PRIMARY_SLUG && i.slug !== SECONDARY_SLUG,
  )

  const ctaHref      = isSpoutShowcase ? "/categories/spout" : "/categories"
  const ctaLabel     = isSpoutShowcase ? uiText.viewAllSpoutProducts[locale] : uiText.viewAllProducts[locale]
  const sectionTitle = isSpoutShowcase ? uiText.spoutProducts[locale] : uiText.featuredProducts[locale]

  return (
    <section className="bg-[#f3f5f7] py-12">
      <div className="max-w-7xl mx-auto px-7">

        {/* ── HEADER ── */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-slate-400 mb-1.5">
              Product Focus
            </p>
            <h2 className="text-[21px] font-semibold tracking-tight text-[#1a2332] leading-tight">
              {sectionTitle}
            </h2>
          </div>
          <Link
            href={withLocalePath(ctaHref, locale)}
            className="hidden md:block text-xs font-semibold text-slate-500 border-b border-slate-300 pb-px whitespace-nowrap hover:text-slate-800 hover:border-slate-500 transition-colors"
          >
            {ctaLabel} →
          </Link>
        </div>

        {/* ═══════════════════════════
            DESKTOP ONLY
        ═══════════════════════════ */}
        <div className="hidden lg:block">

          {/* TOP ROW — two equal cards */}
          {(primaryItem || secondaryItem) && (
            <div className="grid grid-cols-2 gap-2 mb-2">

              {primaryItem && (
                <Link
                  href={withLocalePath(`/categories/${primaryItem.categorySlug}/${primaryItem.slug}`, locale)}
                  className="group bg-white border border-black/[0.09] rounded-2xl overflow-hidden flex flex-col hover:border-black/[0.18] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-200"
                >
                  <div
                    className="relative w-full overflow-hidden flex-shrink-0"
                    style={{ paddingTop: "100%", background: PRIMARY_META.imageBg }}
                  >
                    <Image
                      src={primaryItem.image.src}
                      alt={primaryItem.image.alt || primaryItem.name}
                      fill
                      sizes="50vw"
                      className="object-contain p-[10%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      priority
                    />
                  </div>
                  <div className="px-[18px] py-3.5 border-t border-black/[0.09]">
                    <span
                      className="inline-block text-[9px] font-semibold tracking-[0.16em] uppercase px-2.5 py-0.5 rounded mb-1.5"
                      style={{ background: PRIMARY_META.accentBg, color: PRIMARY_META.accentText }}
                    >
                      {PRIMARY_META.badge[locale]}
                    </span>
                    <h3 className="text-sm font-semibold text-[#1a2332] leading-snug">
                      {primaryItem.name}
                    </h3>
                    {primaryItem.description && (
                      <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        {primaryItem.description}
                      </p>
                    )}
                  </div>
                </Link>
              )}

              {secondaryItem && (
                <Link
                  href={withLocalePath(`/categories/${secondaryItem.categorySlug}/${secondaryItem.slug}`, locale)}
                  className="group bg-white border border-black/[0.09] rounded-2xl overflow-hidden flex flex-col hover:border-black/[0.18] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-200"
                >
                  <div
                    className="relative w-full overflow-hidden flex-shrink-0"
                    style={{ paddingTop: "100%", background: SECONDARY_META.imageBg }}
                  >
                    <Image
                      src={secondaryItem.image.src}
                      alt={secondaryItem.image.alt || secondaryItem.name}
                      fill
                      sizes="50vw"
                      className="object-contain p-[10%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="px-[18px] py-3.5 border-t border-black/[0.09]">
                    <span
                      className="inline-flex items-center gap-1 text-[9px] font-semibold tracking-[0.16em] uppercase px-2.5 py-0.5 rounded mb-1.5"
                      style={{ background: SECONDARY_META.accentBg, color: SECONDARY_META.accentText }}
                    >
                      <span className="inline-block w-[5px] h-[5px] rounded-full bg-current animate-pulse shrink-0" />
                      {SECONDARY_META.badge[locale]}
                    </span>
                    <h3 className="text-sm font-semibold text-[#1a2332] leading-snug">
                      {secondaryItem.name}
                    </h3>
                    {secondaryItem.description && (
                      <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        {secondaryItem.description}
                      </p>
                    )}
                  </div>
                </Link>
              )}
            </div>
          )}

          {/* MORE PRODUCTS — 2 rows of 6 */}
          {restItems.length > 0 && (
            <div className="bg-white border border-black/[0.09] rounded-2xl p-4">
              <p className="text-[9px] font-semibold tracking-[0.18em] uppercase text-slate-300 mb-3">
                {locale === "th" ? "สินค้าอื่นๆ" : "More products"}
              </p>

              <div className="grid grid-cols-6 gap-2">
                {restItems.slice(0, 6).map((item) => (
                  <ThumbCard key={item.id} item={item} locale={locale} />
                ))}
              </div>

              {restItems.length > 6 && (
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {restItems.slice(6, 12).map((item) => (
                    <ThumbCard key={item.id} item={item} locale={locale} />
                  ))}
                </div>
              )}

              {restItems.length > 12 && (
                <Link
                  href={withLocalePath(ctaHref, locale)}
                  className="block mt-2.5 text-[11px] text-slate-400 text-center underline underline-offset-[3px] decoration-slate-300"
                >
                  {locale === "th"
                    ? `ดูทั้งหมด ${restItems.length} รายการ →`
                    : `View all ${restItems.length} →`}
                </Link>
              )}
            </div>
          )}
        </div>

        {/* ═══════════════════════════
            MOBILE ONLY
        ═══════════════════════════ */}
        <div className="lg:hidden flex flex-col gap-2">

          {primaryItem && (
            <Link
              href={withLocalePath(`/categories/${primaryItem.categorySlug}/${primaryItem.slug}`, locale)}
              className="rounded-xl border border-black/[0.09] overflow-hidden bg-white flex h-[110px]"
            >
              <div
                className="relative w-[110px] shrink-0"
                style={{ background: PRIMARY_META.imageBg }}
              >
                <Image
                  src={primaryItem.image.src}
                  alt={primaryItem.image.alt || primaryItem.name}
                  fill
                  sizes="110px"
                  className="object-contain p-3.5"
                />
              </div>
              <div className="px-4 py-3.5 border-l border-black/[0.09] flex flex-col justify-center gap-1.5 min-w-0">
                <span
                  className="inline-block w-fit text-[9px] font-semibold tracking-[0.14em] uppercase px-2 py-0.5 rounded"
                  style={{ background: PRIMARY_META.accentBg, color: PRIMARY_META.accentText }}
                >
                  {PRIMARY_META.badge[locale]}
                </span>
                <h3 className="text-[13px] font-semibold text-[#1a2332] leading-snug line-clamp-2">
                  {primaryItem.name}
                </h3>
              </div>
            </Link>
          )}

          {secondaryItem && (
            <Link
              href={withLocalePath(`/categories/${secondaryItem.categorySlug}/${secondaryItem.slug}`, locale)}
              className="rounded-xl border border-black/[0.09] overflow-hidden bg-white flex h-[110px]"
            >
              <div
                className="relative w-[110px] shrink-0"
                style={{ background: SECONDARY_META.imageBg }}
              >
                <Image
                  src={secondaryItem.image.src}
                  alt={secondaryItem.image.alt || secondaryItem.name}
                  fill
                  sizes="110px"
                  className="object-contain p-3.5"
                />
              </div>
              <div className="px-4 py-3.5 border-l border-black/[0.09] flex flex-col justify-center gap-1.5 min-w-0">
                <span
                  className="inline-flex items-center w-fit gap-1 text-[9px] font-semibold tracking-[0.14em] uppercase px-2 py-0.5 rounded"
                  style={{ background: SECONDARY_META.accentBg, color: SECONDARY_META.accentText }}
                >
                  <span className="inline-block w-[5px] h-[5px] rounded-full bg-current animate-pulse shrink-0" />
                  {SECONDARY_META.badge[locale]}
                </span>
                <h3 className="text-[13px] font-semibold text-[#1a2332] leading-snug line-clamp-2">
                  {secondaryItem.name}
                </h3>
              </div>
            </Link>
          )}

          {restItems.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {restItems.slice(0, 12).map((item) => (
                <Link
                  key={item.id}
                  href={withLocalePath(`/categories/${item.categorySlug}/${item.slug}`, locale)}
                  className="shrink-0 w-[88px] rounded-[10px] border border-black/[0.09] overflow-hidden bg-white"
                >
                  <div className="relative w-[88px] h-[88px] bg-[#f3f5f7]">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt || item.name}
                      fill
                      sizes="88px"
                      className="object-contain p-[14%]"
                    />
                  </div>
                  <div className="px-1.5 pt-1 pb-1.5">
                    <p className="text-[9.5px] font-medium text-slate-500 leading-snug line-clamp-2">
                      {item.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Link
            href={withLocalePath(ctaHref, locale)}
            className="text-xs font-semibold text-slate-400 underline underline-offset-[3px] decoration-slate-300 pt-1"
          >
            {ctaLabel} →
          </Link>
        </div>

      </div>
    </section>
  )
}

/* ── Thumbnail card (desktop more products) ── */
function ThumbCard({ item, locale }: { item: ProductView; locale: "th" | "en" }) {
  return (
    <Link
      href={`/${locale}/categories/${item.categorySlug}/${item.slug}`}
      className="group border border-black/[0.09] rounded-lg overflow-hidden bg-white flex flex-col hover:border-black/[0.18] transition-colors"
    >
      <div
        className="relative w-full overflow-hidden shrink-0 bg-[#f3f5f7]"
        style={{ paddingTop: "100%" }}
      >
        <Image
          src={item.image.src}
          alt={item.image.alt || item.name}
          fill
          sizes="5rem"
          className="object-contain p-[6%] transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
        />
      </div>
      <div className="px-1.5 pt-1 pb-1.5">
        <p className="text-[9.5px] font-medium text-slate-900 leading-snug line-clamp-2">
          {item.name}
        </p>
      </div>
    </Link>
  )
}