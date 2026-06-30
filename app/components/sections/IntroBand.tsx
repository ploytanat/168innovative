import Image from "next/image"
import Link from "next/link"

import type { HeroSlideView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

import { CONTAINER, HOME } from "./home-theme"

type Locale = "th" | "en"

const COPY = {
  th: {
    eyebrow: "บรรจุภัณฑ์ของคุณ เริ่มที่นี่",
    displayWord: "MADE",
    displayWordAccent: "FOR YOU",
    heading: "บอกแค่ไอเดีย เราทำให้เป็นจริง",
    description:
      "บรรจุภัณฑ์สต็อกพร้อมส่งราคาคุ้ม หรือสั่งผลิตตามแบบในขั้นต่ำที่จับต้องได้ ทีมขายตอบกลับภายใน 24 ชั่วโมง พร้อมส่งทั่วประเทศ",
    ctaPrimary: "ดูสินค้าเลย",
    ctaSecondary: "ขอราคาฟรี",
  },
  en: {
    eyebrow: "Built around your brand",
    displayWord: "MADE",
    displayWordAccent: "FOR YOU",
    heading: "Tell us the idea. We make it real.",
    description:
      "Stock packaging ready to ship at value prices, or fully custom production with friendly MOQs. Sales replies in 24 hours, delivered nationwide.",
    ctaPrimary: "Browse catalog",
    ctaSecondary: "Get a free quote",
  },
} as const

export default function IntroBand({ locale, slides = [] }: { locale: Locale; slides?: HeroSlideView[] }) {
  const t = COPY[locale]
  // Prefer the 2nd hero banner so it doesn't duplicate the one in HomeHero.
  const featured = slides[1] ?? slides[0]

  return (
    <section className="relative overflow-hidden" style={{ background: HOME.cream }}>
      <div className={`${CONTAINER} relative py-14 sm:py-20 lg:py-24`}>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">

          {/* Stylized display type + featured banner image */}
          <div className="relative">
            <p
              aria-hidden
              className="select-none text-[clamp(3rem,1rem+10vw,7rem)] font-bold leading-[0.95]"
              style={{
                color: HOME.mintInk,
                opacity: 0.16,
                letterSpacing: "-0.02em",
              }}
            >
              {t.displayWord}
              <br />
              {t.displayWordAccent}
            </p>

            {featured && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-8"
              >
                <div className="relative aspect-[3/2] w-full">
                  <Image
                    src={featured.image.src}
                    alt={featured.image.alt || featured.title || ""}
                    fill
                    sizes="(max-width:1023px) 90vw, 50vw"
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Real content */}
          <div>
            <p
              className="text-[11px] font-bold uppercase tracking-[0.22em]"
              style={{ color: HOME.mintInk }}
            >
              {t.eyebrow}
            </p>

            <h2
              lang={locale}
              className="mt-3 text-[clamp(1.6rem,1rem+2vw,2.4rem)] font-bold leading-[1.2]"
              style={{ color: HOME.ink, letterSpacing: "-0.005em", wordBreak: "keep-all", textWrap: "balance" }}
            >
              {t.heading}
            </h2>

            <p
              className="mt-4 max-w-[44ch] text-[0.98rem] leading-[1.75] sm:text-[1.02rem]"
              style={{ color: HOME.inkMid }}
            >
              {t.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href={withLocalePath("/categories", locale)}
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] font-bold tracking-[0.03em] transition-colors sm:px-7"
                style={{ background: HOME.mintInk, color: HOME.surface }}
              >
                {t.ctaPrimary}
              </Link>
              <Link
                href={withLocalePath("/contact", locale)}
                className="inline-flex items-center justify-center rounded-full border px-6 py-3 text-[14px] font-bold tracking-[0.03em] transition-colors sm:px-7"
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
