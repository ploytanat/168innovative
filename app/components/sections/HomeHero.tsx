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
    <section className="relative overflow-hidden" style={{ background: HOME.surface }}>
      <div className={`${CONTAINER} relative py-12 sm:py-16`}>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">

          {/* Copy column */}
          <div>
            <h2
              lang={locale}
              className="font-display text-[clamp(1.6rem,1rem+2vw,2.5rem)] font-bold leading-[1.2] sm:leading-[1.15]"
              style={{ color: HOME.ink, textWrap: "balance", wordBreak: "keep-all" }}
            >
              {heroTitle}
            </h2>

            <HeroBody text={slide.description || t.description} />

            <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href={slide.ctaPrimary?.href || withLocalePath("/categories", locale)}
                className="inline-flex items-center justify-center rounded px-6 py-3 text-[14px] font-bold tracking-[0.03em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a7a1e] sm:px-7"
                style={{ background: HOME.leaf, color: HOME.ink }}
              >
                {slide.ctaPrimary?.label || t.viewCatalog}
              </Link>
              <Link
                href={slide.ctaSecondary?.href || withLocalePath("/contact", locale)}
                className="inline-flex items-center justify-center rounded border px-6 py-3 text-[14px] font-bold tracking-[0.03em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a7a1e] sm:px-7"
                style={{ borderColor: HOME.line, color: HOME.ink }}
              >
                {slide.ctaSecondary?.label || t.contactSales}
              </Link>
            </div>
          </div>

          {/* Image column */}
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-lg sm:aspect-[5/4] lg:aspect-[4/3.6]"
            style={{ background: HOME.mist }}
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
    "mt-5 max-w-[44ch] text-[15px] leading-[1.75] sm:text-[16px] lg:mt-6 lg:text-[17px]"

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
              className="flex items-start gap-2 text-[15px] leading-[1.55] sm:text-[16px]"
              style={{ color: HOME.inkMid }}>
            <Check className="mt-1 h-3.5 w-3.5 shrink-0" strokeWidth={2.5} style={{ color: HOME.mintInk }} />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
