import Image from "next/image"
import Link from "next/link"

import type { HomeHeroView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

import { CONTAINER, HOME } from "./home-theme"

type Locale = "th" | "en"

const COPY = {
  th: {
    eyebrow: "ผู้ผลิตและจัดจำหน่าย",
    badgeTop: "ครบวงจร",
    badgeNumber: "10+",
    badgeBottom: "ปีประสบการณ์",
    description:
      "168 INNOVATIVE ผู้นำเข้าและจัดจำหน่ายบรรจุภัณฑ์เครื่องสำอาง ครบวงจรงาน OEM และ ODM พร้อมส่งจริง รองรับการสั่งผลิตตามแบบ และจัดส่งทั่วประเทศ",
    viewCatalog: "ดูสินค้าทั้งหมด",
    contactSales: "ติดต่อทีมขาย",
  },
  en: {
    eyebrow: "Manufacturer & distributor",
    badgeTop: "Full-service",
    badgeNumber: "10+",
    badgeBottom: "Years experience",
    description:
      "168 INNOVATIVE — importer and distributor of cosmetic packaging. Full-service OEM & ODM, stock-ready, custom production, nationwide delivery.",
    viewCatalog: "View catalog",
    contactSales: "Contact sales",
  },
} as const

export default function HomeHero({ hero, locale }: { hero: HomeHeroView; locale: Locale }) {
  const slide = hero.slides?.[0]
  if (!slide) return null

  const t = COPY[locale]
  const heroTitle = slide.title || "168 INNOVATIVE"
  const heroSubtitle = slide.subtitle || t.eyebrow

  return (
    <section className="relative overflow-hidden" style={{ background: HOME.surface }}>
      {/* Soft mint tint backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(circle at 85% 10%, ${HOME.mint} 0%, transparent 55%), radial-gradient(circle at 10% 90%, ${HOME.mintSoft} 0%, transparent 50%)`,
        }}
      />

      <div className={`${CONTAINER} relative py-10 sm:py-14 lg:py-20`}>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">

          {/* Copy column */}
          <div>
            <p
              className="text-[11px] font-bold uppercase tracking-[0.22em]"
              style={{ color: HOME.mintInk }}
            >
              {heroSubtitle}
            </p>

            <h1
              lang={locale}
              className="mt-4 text-[clamp(2.25rem,1.5rem+4vw,4.5rem)] font-bold leading-[1.05]"
              style={{ color: HOME.ink, letterSpacing: "-0.01em", wordBreak: "keep-all", textWrap: "balance" }}
            >
              {heroTitle}
            </h1>

            <p
              className="mt-5 max-w-[44ch] text-[0.98rem] leading-[1.75] sm:text-[1.02rem] lg:mt-6"
              style={{ color: HOME.inkMid }}
            >
              {slide.description || t.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href={slide.ctaPrimary?.href || withLocalePath("/categories", locale)}
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] font-bold tracking-[0.03em] transition-colors sm:px-7"
                style={{ background: HOME.mintInk, color: HOME.surface }}
              >
                {slide.ctaPrimary?.label || t.viewCatalog}
              </Link>
              <Link
                href={slide.ctaSecondary?.href || withLocalePath("/contact", locale)}
                className="inline-flex items-center justify-center rounded-full border px-6 py-3 text-[14px] font-bold tracking-[0.03em] transition-colors sm:px-7"
                style={{ borderColor: HOME.line, color: HOME.ink }}
              >
                {slide.ctaSecondary?.label || t.contactSales}
              </Link>
            </div>
          </div>

          {/* Image column with trust badge */}
          <div className="relative">
            <div
              className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] sm:aspect-[5/4] lg:aspect-[4/3.6]"
              style={{ background: HOME.mint }}
            >
              <Image
                src={slide.image.src}
                alt={slide.image.alt || heroTitle}
                fill
                priority
                sizes="(max-width:1023px) 100vw, 48vw"
                className="object-cover"
                style={{ objectPosition: "center 45%" }}
              />
            </div>

            {/* Trust badge — circular, top-right */}
            <div
              className="absolute -top-3 -right-3 z-10 flex flex-col items-center justify-center rounded-full text-center sm:-top-5 sm:-right-5 lg:-top-7 lg:-right-7"
              style={{
                background: HOME.mintInk,
                color: HOME.surface,
                width: "clamp(96px,18vw,168px)",
                height: "clamp(96px,18vw,168px)",
                boxShadow: "0 12px 28px rgba(46,125,50,0.28)",
              }}
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] opacity-90 sm:text-[10px]">
                {t.badgeTop}
              </span>
              <span className="text-[clamp(1.8rem,4vw,3rem)] font-bold leading-none">
                {t.badgeNumber}
              </span>
              <span className="text-[9px] font-semibold tracking-[0.08em] opacity-90 sm:text-[10px]">
                {t.badgeBottom}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
