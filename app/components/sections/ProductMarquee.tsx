"use client"

import Image from "next/image"
import Link from "next/link"

import { uiText } from "@/app/lib/i18n/ui"
import { ProductView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

// ─── slugs ที่ต้องการ spotlight ───────────────────────────────────────────────
const SPOTLIGHT_SLUGS = ["spout", "coffee-bag-valve-hl400"]

interface ProductMarqueeProps {
  items: ProductView[]
  locale: "th" | "en"
}

// ─── label map สำหรับ spotlight cards ─────────────────────────────────────────
const spotlightMeta: Record<
  string,
  {
    badge: { th: string; en: string }
    accent: string          // tailwind color token (used in arbitrary values)
    accentHex: string
    accentMuted: string     // light bg
    accentText: string      // dark text on light bg
    tagline: { th: string; en: string }
    specs: { label: { th: string; en: string }; value: { th: string; en: string } }[]
  }
> = {
  spout: {
    badge: { th: "สินค้าเด่น", en: "Featured" },
    accentHex: "#0F6E56",
    accentMuted: "#E1F5EE",
    accentText: "#0F6E56",
    accent: "teal",
    tagline: {
      th: "จุกสปาวท์คุณภาพสูง · ผลิตตามสั่ง OEM",
      en: "High-quality spout caps · OEM ready",
    },
    specs: [
      { label: { th: "ขนาดปาก", en: "Mouth size" }, value: { th: "22 / 24 / 28 มม.", en: "22 / 24 / 28 mm" } },
      { label: { th: "วัสดุ", en: "Material" }, value: { th: "PE · PP · Food Grade", en: "PE · PP · Food Grade" } },
      { label: { th: "สี", en: "Color" }, value: { th: "ขาว / โปร่งใส / Custom", en: "White / Clear / Custom" } },
    ],
  },
  "coffee-bag-valve-hl400": {
    badge: { th: "สินค้าใหม่", en: "New" },
    accentHex: "#854F0B",
    accentMuted: "#FAEEDA",
    accentText: "#854F0B",
    accent: "amber",
    tagline: {
      th: "วาล์วถุงกาแฟ HL400 · ระบาย CO₂ · กันความชื้น",
      en: "HL400 coffee valve · CO₂ release · moisture barrier",
    },
    specs: [
      { label: { th: "รุ่น", en: "Model" }, value: { th: "HL400", en: "HL400" } },
      { label: { th: "ขนาด", en: "Size" }, value: { th: "40 มิลลิเมตร", en: "40 mm" } },
      { label: { th: "วัสดุ", en: "Material" }, value: { th: "PE", en: "PE" } },
    ],
  },
}

export default function ProductMarquee({ items, locale }: ProductMarqueeProps) {
  if (!items.length) return null

  const isSpoutShowcase = items.every((item) => item.categorySlug === "spout")

  // แยก spotlight ออกจาก rest
  const spotlightItems = items.filter((item) => SPOTLIGHT_SLUGS.includes(item.slug))
  const restItems = items.filter((item) => !SPOTLIGHT_SLUGS.includes(item.slug))
  const marqueeItems = [...restItems, ...restItems]

  const sectionTitle = isSpoutShowcase
    ? uiText.spoutProducts[locale]
    : uiText.featuredProducts[locale]
  const ctaHref = isSpoutShowcase ? "/categories/spout" : "/categories"
  const ctaLabel = isSpoutShowcase
    ? uiText.viewAllSpoutProducts[locale]
    : uiText.viewAllProducts[locale]

  return (
    <section className="relative overflow-hidden py-14 md:py-16">
      {/* ── ambient blobs ── */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-48 w-48 rounded-full bg-[rgba(46,207,196,0.12)] blur-[80px] md:h-96 md:w-96 md:blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 h-48 w-48 rounded-full bg-[rgba(248,167,184,0.14)] blur-[80px] md:h-96 md:w-96 md:blur-[120px]" />

      {/* ── noise texture ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      {/* ── top / bottom gradient lines ── */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(46,207,196,0.35), rgba(248,167,184,0.6), rgba(157,220,246,0.45), transparent)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6">

        {/* ════════════════════════════════════════════════
            SECTION HEADER
        ════════════════════════════════════════════════ */}
        <div className="relative mb-10 overflow-hidden rounded-[2rem] border border-[rgba(205,222,241,0.78)] bg-[linear-gradient(180deg,rgba(255,255,255,0.8)_0%,rgba(241,251,255,0.82)_48%,rgba(242,247,255,0.82)_100%)] px-6 py-8 shadow-[0_20px_60px_rgba(28,40,66,0.06)] md:mb-14 md:px-8">
          <div className="relative text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Product Focus
            </p>
            <h2 className="font-heading mt-3 text-2xl font-bold tracking-[0.02em] text-[var(--color-ink)] sm:text-3xl lg:text-4xl">
              {sectionTitle}
            </h2>
            <div className="mx-auto mt-4 flex items-center justify-center gap-2">
              <div className="h-px w-8 bg-[rgba(46,207,196,0.4)] md:w-12" />
              <div className="h-1 w-1 rounded-full bg-[rgba(202,184,242,0.82)]" />
              <div className="h-px w-8 bg-[rgba(157,220,246,0.5)] md:w-12" />
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            SPOTLIGHT HERO CARDS (Spout + Coffee Valve)
        ════════════════════════════════════════════════ */}
        {spotlightItems.length > 0 && (
          <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {spotlightItems.map((item) => {
              const meta = spotlightMeta[item.slug]
              if (!meta) return null
              return (
                <Link
                  key={item.id}
                  href={withLocalePath(`/categories/${item.categorySlug}/${item.slug}`, locale)}
                  className="group/hero block"
                >
                  <article
                    className="relative overflow-hidden rounded-[1.75rem] border border-[rgba(205,222,241,0.78)] bg-white/90 shadow-[0_20px_50px_rgba(28,40,66,0.08)] transition-all duration-500 group-hover/hero:-translate-y-1 group-hover/hero:shadow-[0_32px_70px_rgba(28,40,66,0.13)]"
                  >
                    {/* accent top bar */}
                    <div
                      className="h-[3px] w-full"
                      style={{
                        background: `linear-gradient(to right, ${meta.accentHex}88, ${meta.accentHex})`,
                      }}
                    />

                    <div className="flex flex-col sm:flex-row">
                      {/* ── image panel ── */}
                      <div
                        className="relative flex h-52 w-full items-center justify-center overflow-hidden sm:h-auto sm:w-52 sm:shrink-0"
                        style={{ background: meta.accentMuted }}
                      >
                        <div className="relative h-36 w-36 sm:h-40 sm:w-40 transition-transform duration-700 group-hover/hero:scale-105">
                          <Image
                            src={item.image.src}
                            alt={item.image.alt || item.name}
                            fill
                            sizes="(max-width: 640px) 9rem, 10rem"
                            className="object-contain drop-shadow-md"
                          />
                        </div>
                      </div>

                      {/* ── content panel ── */}
                      <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
                        <div>
                          {/* badge */}
                          <span
                            className="mb-3 inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]"
                            style={{ background: meta.accentMuted, color: meta.accentText }}
                          >
                            {meta.badge[locale]}
                          </span>

                          {/* name */}
                          <h3 className="font-heading text-lg font-bold leading-snug text-[var(--color-ink)] md:text-xl">
                            {item.name}
                          </h3>

                          {/* tagline */}
                          <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-ink-soft)]">
                            {meta.tagline[locale]}
                          </p>

                          {/* spec rows */}
                          <dl className="mt-4 divide-y divide-[rgba(205,222,241,0.5)]">
                            {meta.specs.map((spec) => (
                              <div
                                key={spec.label.en}
                                className="flex items-center justify-between py-2 text-[13px]"
                              >
                                <dt className="text-[var(--color-ink-soft)]">{spec.label[locale]}</dt>
                                <dd className="font-medium text-[var(--color-ink)]">{spec.value[locale]}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>

                        {/* CTA row */}
                        <div className="mt-5 flex items-center gap-2">
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-[13px] font-semibold text-white transition-opacity duration-200 group-hover/hero:opacity-90"
                            style={{ background: meta.accentHex }}
                          >
                            {locale === "th" ? "ดูสินค้า" : "View product"}
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                              <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <span className="text-[13px] font-medium text-[var(--color-ink-soft)] underline-offset-2 transition-colors duration-200 group-hover/hero:text-[var(--color-accent)] group-hover/hero:underline">
                            {locale === "th" ? "สอบถามราคา" : "Get a quote"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        )}

        {/* ════════════════════════════════════════════════
            DIVIDER (แสดงเมื่อมีสินค้าอื่นใน marquee)
        ════════════════════════════════════════════════ */}
        {restItems.length > 0 && (
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[rgba(205,222,241,0.6)]" />
            <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
              {locale === "th" ? "สินค้าอื่นๆ" : "More products"}
            </p>
            <div className="h-px flex-1 bg-[rgba(205,222,241,0.6)]" />
          </div>
        )}

        {/* ════════════════════════════════════════════════
            MARQUEE — mobile scrollable / desktop auto-scroll
            (แสดงเฉพาะสินค้าที่ไม่ใช่ spotlight)
        ════════════════════════════════════════════════ */}
        {restItems.length > 0 && (
          <>
            {/* mobile */}
            <div className="no-scrollbar w-full overflow-x-auto px-1 touch-pan-x lg:hidden">
              <div className="flex flex-nowrap gap-4 pb-6">
                {restItems.map((item) => (
                  <Link
                    key={item.id}
                    href={withLocalePath(`/categories/${item.categorySlug}/${item.slug}`, locale)}
                    className="shrink-0"
                  >
                    <div className="w-40 rounded-[1.6rem] border border-[rgba(205,222,241,0.78)] bg-white/86 p-3 shadow-[0_14px_34px_rgba(28,40,66,0.07)] transition-transform active:scale-95 md:w-48">
                      <div className="relative aspect-square overflow-hidden rounded-[1rem] bg-[linear-gradient(145deg,#eefbff,#f3f8ff)]">
                        <Image
                          src={item.image.src}
                          alt={item.image.alt || item.name}
                          fill
                          sizes="(max-width: 768px) 10rem, 12rem"
                          className="object-cover"
                        />
                      </div>
                      <p className="mt-3 line-clamp-1 px-1 text-center text-[13px] font-medium text-[var(--color-ink-soft)]">
                        {item.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* desktop marquee */}
            <div className="group relative hidden overflow-hidden lg:block">
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40"
                style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0))" }}
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40"
                style={{ backgroundImage: "linear-gradient(to left, rgba(255,255,255,0.95), rgba(255,255,255,0))" }}
              />

              <div className="animate-marquee gap-6 px-2 py-1">
                {marqueeItems.map((item, index) => (
                  <Link
                    key={`${item.id}-${index}`}
                    href={withLocalePath(`/categories/${item.categorySlug}/${item.slug}`, locale)}
                    className="group/item"
                  >
                    <div className="relative w-48 shrink-0 rounded-[1.75rem] border border-[rgba(205,222,241,0.78)] bg-white/86 p-3.5 shadow-[0_14px_34px_rgba(28,40,66,0.07)] transition-all duration-500 group-hover/item:-translate-y-2 group-hover/item:border-[#b9d6ec] group-hover/item:shadow-[0_26px_60px_rgba(28,40,66,0.12)]">
                      <div className="absolute inset-0 rounded-[1.75rem] bg-linear-to-b from-[#eefbff]/0 to-[#f3f8ff]/80 opacity-0 transition-opacity duration-300 group-hover/item:opacity-100" />
                      <div className="relative aspect-square overflow-hidden rounded-[1rem] bg-[linear-gradient(145deg,#eefbff,#f3f8ff)]">
                        <Image
                          src={item.image.src}
                          alt={item.image.alt || item.name}
                          fill
                          sizes="12rem"
                          className="select-none object-cover transition-transform duration-700 group-hover/item:scale-110"
                        />
                      </div>
                      <p className="relative mt-4 line-clamp-1 text-center text-[13px] font-medium text-[var(--color-ink-soft)] transition-colors duration-300 group-hover/item:text-[var(--color-accent)]">
                        {item.name}
                      </p>
                      <div className="mx-auto mt-2.5 h-px w-0 rounded-full bg-linear-to-r from-[rgba(46,207,196,0.55)] to-[rgba(157,220,246,0.75)] transition-all duration-500 group-hover/item:w-12" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════
            CTA BUTTON
        ════════════════════════════════════════════════ */}
        <div className="mt-8 text-center md:mt-10">
          <Link
            href={withLocalePath(ctaHref, locale)}
            className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(205,222,241,0.82)] bg-white/88 px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-soft)] shadow-sm transition-all duration-300 hover:border-[var(--color-accent)] hover:bg-[#f4fbfa] hover:text-[var(--color-accent)] hover:shadow-md active:scale-95"
          >
            {ctaLabel}
            <span aria-hidden="true" className="text-sm">{"→"}</span>
          </Link>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(46,207,196,0.35), rgba(248,167,184,0.6), rgba(157,220,246,0.45), transparent)",
        }}
      />
    </section>
  )
}