import Image from "next/image"
import Link from "next/link"

import { uiText } from "@/app/lib/i18n/ui"
import { ProductView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

interface ProductMarqueeProps {
  items: ProductView[]
  locale: "th" | "en"
}

export default function ProductMarquee({
  items,
  locale,
}: ProductMarqueeProps) {
  if (!items.length) return null

  const isSpoutShowcase = items.every((item) => item.categorySlug === "spout")
  const marqueeItems = [...items, ...items]
  const sectionTitle = isSpoutShowcase
    ? uiText.spoutProducts[locale]
    : uiText.featuredProducts[locale]
  const ctaHref = isSpoutShowcase ? "/categories/spout" : "/categories"
  const ctaLabel = isSpoutShowcase
    ? uiText.viewAllSpoutProducts[locale]
    : uiText.viewAllProducts[locale]

  return (
    <section className="relative overflow-hidden py-14 md:py-16">
      <div className="pointer-events-none absolute -top-20 left-1/4 h-48 w-48 rounded-full bg-[rgba(46,207,196,0.12)] blur-[80px] md:h-96 md:w-96 md:blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 h-48 w-48 rounded-full bg-[rgba(248,167,184,0.14)] blur-[80px] md:h-96 md:w-96 md:blur-[120px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(46,207,196,0.35), rgba(248,167,184,0.6), rgba(157,220,246,0.45), transparent)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6">
        <div className="relative mb-8 overflow-hidden rounded-[2rem] border border-[rgba(205,222,241,0.78)] bg-[linear-gradient(180deg,rgba(255,255,255,0.8)_0%,rgba(241,251,255,0.82)_48%,rgba(255,241,246,0.82)_100%)] px-6 py-8 shadow-[0_20px_60px_rgba(28,40,66,0.06)] md:mb-12 md:px-8">
          <div className="relative text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Product Focus
            </p>
            <h2 className="font-heading mt-3 text-2xl font-bold tracking-[0.02em] text-[var(--color-ink)] sm:text-3xl lg:text-4xl">
              {sectionTitle}
            </h2>
            <div className="mx-auto mt-4 flex items-center justify-center gap-2">
              <div className="h-px w-8 bg-[rgba(46,207,196,0.4)] md:w-12" />
              <div className="h-1 w-1 rounded-full bg-[rgba(248,167,184,0.8)]" />
              <div className="h-px w-8 bg-[rgba(157,220,246,0.5)] md:w-12" />
            </div>
          </div>
        </div>

        <div className="no-scrollbar w-full overflow-x-auto px-1 lg:hidden touch-pan-x">
          <div className="flex flex-nowrap gap-4 pb-6">
            {items.map((item) => (
              <Link
                key={item.id}
                href={withLocalePath(
                  `/categories/${item.categorySlug}/${item.slug}`,
                  locale
                )}
                className="shrink-0"
              >
                <div className="w-40 rounded-[1.6rem] border border-[rgba(205,222,241,0.78)] bg-white/86 p-3 shadow-[0_14px_34px_rgba(28,40,66,0.07)] transition-transform active:scale-95 md:w-48">
                  <div className="relative aspect-square overflow-hidden rounded-[1rem] bg-[linear-gradient(145deg,#eefbff,#fff0f5)]">
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

        <div className="group relative hidden overflow-hidden lg:block">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0))",
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40"
            style={{
              backgroundImage:
                "linear-gradient(to left, rgba(255,255,255,0.95), rgba(255,255,255,0))",
            }}
          />

          <div className="animate-marquee gap-6 px-2 py-1">
            {marqueeItems.map((item, index) => (
              <Link
                key={`${item.id}-${index}`}
                href={withLocalePath(
                  `/categories/${item.categorySlug}/${item.slug}`,
                  locale
                )}
                className="group/item"
              >
                <div className="relative w-48 shrink-0 rounded-[1.75rem] border border-[rgba(205,222,241,0.78)] bg-white/86 p-3.5 shadow-[0_14px_34px_rgba(28,40,66,0.07)] transition-all duration-500 group-hover/item:-translate-y-2 group-hover/item:border-[#b9d6ec] group-hover/item:shadow-[0_26px_60px_rgba(28,40,66,0.12)]">
                  <div className="absolute inset-0 rounded-[1.75rem] bg-linear-to-b from-[#eefbff]/0 to-[#fff0f5]/80 opacity-0 transition-opacity duration-300 group-hover/item:opacity-100" />
                  <div className="relative aspect-square overflow-hidden rounded-[1rem] bg-[linear-gradient(145deg,#eefbff,#fff0f5)]">
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
                  <div className="mx-auto mt-2.5 h-px w-0 rounded-full bg-linear-to-r from-[rgba(46,207,196,0.55)] to-[rgba(248,167,184,0.75)] transition-all duration-500 group-hover/item:w-12" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center md:mt-6">
          <Link
            href={withLocalePath(ctaHref, locale)}
            className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(205,222,241,0.82)] bg-white/88 px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-soft)] shadow-sm transition-all duration-300 hover:border-[var(--color-accent)] hover:bg-[#f4fbfa] hover:text-[var(--color-accent)] hover:shadow-md active:scale-95"
          >
            {ctaLabel}
            <span aria-hidden="true" className="text-sm">{"->"}</span>
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
