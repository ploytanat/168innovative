import Image from "next/image"
import Link from "next/link"

import type { HeroSlideView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

import { CONTAINER, HOME } from "./home-theme"

type Locale = "th" | "en"

const COPY = {
  th: {
    displayWord: "MADE",
    displayWordAccent: "FOR YOU",
    heading: "บอกแค่ไอเดีย เราทำให้เป็นจริง",
    description:
      "บรรจุภัณฑ์สต็อกพร้อมส่งราคาคุ้ม หรือบอกแบบที่ต้องการ ให้เราช่วยหาและนำเข้าให้ในขั้นต่ำที่จับต้องได้ ทีมขายตอบกลับภายใน 24 ชั่วโมง พร้อมส่งทั่วประเทศ",
    ctaPrimary: "ดูสินค้าเลย",
    ctaSecondary: "ขอราคาฟรี",
  },
  en: {
    displayWord: "MADE",
    displayWordAccent: "FOR YOU",
    heading: "Tell us the idea. We make it real.",
    description:
      "Stock packaging ready to ship at value prices, or tell us what you need — we'll source and import it with friendly MOQs. Sales replies in 24 hours, delivered nationwide.",
    ctaPrimary: "Browse catalog",
    ctaSecondary: "Get a free quote",
  },
} as const

export default function IntroBand({ locale, slides = [] }: { locale: Locale; slides?: HeroSlideView[] }) {
  const t = COPY[locale]
  // Prefer the 2nd hero banner so it doesn't duplicate the one in HomeHero.
  const featured = slides[1] ?? slides[0]

  return (
    <section className="relative overflow-hidden" style={{ background: HOME.surface, borderTop: `1px solid ${HOME.line}`, borderBottom: `1px solid ${HOME.line}` }}>
      <div className={`${CONTAINER} relative py-12 sm:py-16`}>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">

          {/* Stylized display type + featured banner image */}
          <div className="relative">
            {/* Mobile: featured image on its own — the poster overlay is too dense on small screens */}
            {featured && (
              <div className="relative aspect-3/2 w-full sm:hidden">
                <Image
                  src={featured.image.src}
                  alt={featured.image.alt || featured.title || ""}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
            )}

            {/* Desktop poster: giant display type with image absolutely overlaid */}
            <div className="hidden sm:block">
              <p
                aria-hidden
                className="font-display select-none text-[clamp(3rem,1rem+10vw,7rem)] font-bold leading-[0.95]"
                style={{
                  color: HOME.leaf,
                  opacity: 0.35,
                }}
              >
                {t.displayWord}
                <br />
                {t.displayWordAccent}
              </p>

              {featured && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-8 top-1/2 -translate-y-1/2"
                >
                  <div className="relative aspect-3/2 w-full">
                    <Image
                      src={featured.image.src}
                      alt={featured.image.alt || featured.title || ""}
                      fill
                      sizes="50vw"
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Real content */}
          <div>
            <h2
              lang={locale}
              className="font-display text-[clamp(1.75rem,1.2rem+1.8vw,2.5rem)] font-bold leading-[1.2]"
              style={{ color: HOME.ink, wordBreak: "keep-all", textWrap: "balance" }}
            >
              {t.heading}
            </h2>

            <p
              className="mt-4 max-w-[44ch] text-[15px] leading-[1.75] sm:text-[16px] lg:text-[17px]"
              style={{ color: HOME.inkMid }}
            >
              {t.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href={withLocalePath("/categories", locale)}
                className="inline-flex items-center justify-center rounded px-6 py-3 text-[14px] font-bold tracking-[0.03em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a7a1e] sm:px-7"
                style={{ background: HOME.leaf, color: HOME.ink }}
              >
                {t.ctaPrimary}
              </Link>
              <Link
                href={withLocalePath("/contact", locale)}
                className="inline-flex items-center justify-center rounded border px-6 py-3 text-[14px] font-bold tracking-[0.03em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a7a1e] sm:px-7"
                style={{ borderColor: HOME.mintInk, color: HOME.mintInk }}
              >
                {t.ctaSecondary}
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
