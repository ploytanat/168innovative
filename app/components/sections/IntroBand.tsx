import Link from "next/link"

import { withLocalePath } from "@/app/lib/utils/withLocalePath"

import { CONTAINER, HOME } from "./home-theme"

type Locale = "th" | "en"

const COPY = {
  th: {
    eyebrow: "บริการครบวงจร",
    displayWord: "ENJOY",
    displayWordAccent: "YOUR PACKAGING",
    heading: "รับผลิตและออกแบบบรรจุภัณฑ์เครื่องสำอาง ครบวงจร",
    description:
      "ตั้งแต่งานสต็อกพร้อมส่ง ไปจนถึงงานสั่งผลิตตามแบบ เลือกขนาด สี และรายละเอียดได้ตามคอนเซปต์แบรนด์ พร้อมทีมแนะนำที่ปรึกษาตลอดกระบวนการ",
    ctaPrimary: "ดูบริการ",
    ctaSecondary: "ขอใบเสนอราคา",
  },
  en: {
    eyebrow: "Full-service",
    displayWord: "ENJOY",
    displayWordAccent: "YOUR PACKAGING",
    heading: "Cosmetic packaging — designed, sourced, produced.",
    description:
      "From stock-ready packaging to fully custom production. Choose size, color, and finish around your brand concept — with a sales team guiding every step.",
    ctaPrimary: "Our services",
    ctaSecondary: "Request a quote",
  },
} as const

export default function IntroBand({ locale }: { locale: Locale }) {
  const t = COPY[locale]

  return (
    <section className="relative overflow-hidden" style={{ background: HOME.cream }}>
      <div className={`${CONTAINER} relative py-14 sm:py-20 lg:py-24`}>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">

          {/* Stylized display type — decorative anchor */}
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

            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-6 top-1/2 -translate-y-1/2"
            >
              <div
                className="aspect-[3/2] w-full rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${HOME.mint} 0%, ${HOME.mintSoft} 100%)`,
                  opacity: 0.65,
                }}
              />
            </div>
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
