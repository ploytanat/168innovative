import { Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import type { HomeHeroView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

import { CONTAINER, HOME } from "./home-theme"

type Locale = "th" | "en"

const COPY = {
  th: {
    description:
      "บรรจุภัณฑ์เครื่องสำอางคุณภาพโรงงาน พร้อมส่งจริง สั่งผลิต OEM/ODM ตามไอเดียของคุณ จัดส่งทั่วประเทศ",
    viewCatalog: "ดูสินค้าทั้งหมด",
    contactSales: "คุยกับทีมเซลส์",
  },
  en: {
    description:
      "Factory-direct cosmetic packaging. Stock-ready, plus OEM & ODM built around your brand — delivered nationwide.",
    viewCatalog: "Browse catalog",
    contactSales: "Talk to sales",
  },
} as const

export default function HomeHero({ hero, locale }: { hero: HomeHeroView; locale: Locale }) {
  const slide = hero.slides?.[0]
  if (!slide) return null

  const t = COPY[locale]
  const heroTitle = slide.title || "168 INNOVATIVE"

  return (
    <section className="relative overflow-hidden" style={{ background: HOME.mintSoft }}>
      <div className={`${CONTAINER} relative py-10 sm:py-14 lg:py-20`}>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">

          {/* Copy column */}
          <div>
            <h1
              lang={locale}
              className="text-[clamp(1.9rem,1rem+3.4vw,3.4rem)] font-bold leading-[1.1] sm:leading-[1.08]"
              style={{ color: HOME.ink, letterSpacing: "-0.005em", textWrap: "balance" }}
            >
              {heroTitle}
            </h1>

            <HeroBody text={slide.description || t.description} />

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

          {/* Image column */}
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

        </div>
      </div>
    </section>
  )
}

function HeroBody({ text }: { text: string }) {
  const parts = text.split("✓").map(s => s.trim()).filter(Boolean)
  const [lead, ...bullets] = parts

  const leadClass =
    "mt-5 max-w-[44ch] text-[0.98rem] leading-[1.75] sm:text-[1.02rem] lg:mt-6"

  if (bullets.length === 0) {
    return (
      <p className={leadClass} style={{ color: HOME.inkMid }}>
        {lead}
      </p>
    )
  }

  return (
    <>
      <p className={leadClass} style={{ color: HOME.inkMid }}>
        {lead}
      </p>
      <ul className="mt-3 space-y-1.5 sm:mt-4">
        {bullets.map((b, i) => (
          <li key={i}
              className="flex items-start gap-2 text-[0.95rem] leading-[1.55] sm:text-[1rem]"
              style={{ color: HOME.inkMid }}>
            <Check className="mt-1 h-3.5 w-3.5 shrink-0" strokeWidth={2.5} style={{ color: HOME.mintInk }} />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
