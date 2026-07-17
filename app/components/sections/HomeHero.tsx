"use client"

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"

import type { HomeHeroView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

import { CONTAINER, HOME } from "./home-theme"

type Locale = "th" | "en"

const COPY = {
  th: {
    displayWord: "168",
    displayWordAccent: "INNOVATIVE",
    fallbackTitle: "บอกแค่ไอเดีย เราจัดหาให้ครบ",
    description:
      "บรรจุภัณฑ์สต็อกพร้อมส่งราคาคุ้ม หรือบอกแบบที่ต้องการ ให้เราช่วยหาและนำเข้าให้ในขั้นต่ำที่จับต้องได้ ทีมขายตอบกลับภายใน 24 ชั่วโมง พร้อมส่งทั่วประเทศ",
    viewCatalog: "ดูสินค้าเลย",
    contactSales: "ขอราคาฟรี",
  },
  en: {
    displayWord: "168",
    displayWordAccent: "INNOVATIVE",
    fallbackTitle: "Tell us the idea. We'll source it.",
    description:
      "Stock packaging ready to ship at value prices, or tell us what you need — we'll source and import it with friendly MOQs. Sales replies in 24 hours, delivered nationwide.",
    viewCatalog: "Browse catalog",
    contactSales: "Get a free quote",
  },
} as const

export default function HomeHero({ hero, locale }: { hero: HomeHeroView; locale: Locale }) {
  const slide = hero.slides?.[0]
  const sectionRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -40])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, shouldReduceMotion ? 1 : 1.08])

  if (!slide) return null

  const t = COPY[locale]
  const heroTitle = slide.title || t.fallbackTitle

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ background: HOME.surface }}>
      <div className={`${CONTAINER} relative py-12 sm:py-16`}>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">

          {/* Image column. The "168 INNOVATIVE" wordmark sits behind the
              product shot, clipped by this column's own overflow-hidden —
              it can never reach the copy column next to it, on any
              breakpoint, because it's boxed to this element and nothing
              wider. (Earlier attempts made it a full-section watermark,
              independent of this box, which read fine over the bold
              headline but still muddied the lighter-weight description
              text wherever it drifted behind that instead — confining it
              here removes that case entirely.) The photo is a fully opaque
              studio shot with no transparent margin, so it's inset a few
              percent from the column's edges (`p-[7%]` on the img) — that
              ring is the only place anything behind it can show. The
              wordmark is sized in container-query width units (`cqw`,
              relative to this column, not the viewport) so its one-line
              rendered width sits just at the column's full edge — wider
              than the photo's inset content box, narrower than the column
              itself — letting it peek out in that ring on both sides
              instead of hiding dead-center behind the photo. Image and
              wordmark share the same parallax drift so they move together
              as one unit. */}
          <motion.div
            className="relative aspect-3/2 w-full overflow-hidden @container motion-reduce:animate-none animate-[hero-reveal-image_700ms_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ y: imageY, scale: imageScale }}
          >
            <p
              aria-hidden
              className="pointer-events-none absolute inset-0 flex select-none items-center justify-center whitespace-nowrap text-center font-display font-bold leading-none"
              style={{ color: HOME.leaf, opacity: 0.22, fontSize: "clamp(1.6rem, 12cqw, 6rem)", letterSpacing: "0.01em" }}
            >
              {t.displayWord} {t.displayWordAccent}
            </p>
            <Image
              src={slide.image.src}
              alt={slide.image.alt || heroTitle}
              fill
              priority
              sizes="(max-width:1023px) 90vw, 50vw"
              className="relative z-10 object-contain p-[7%]"
              style={{ objectPosition: "center 45%" }}
            />
          </motion.div>

          {/* Copy column */}
          <div>
            <h2
              lang={locale}
              className="font-display motion-reduce:animate-none animate-[hero-reveal_650ms_cubic-bezier(0.22,1,0.36,1)_both] max-w-[26ch] text-[clamp(1.3rem,1rem+1.1vw,1.85rem)] font-semibold leading-[1.35]"
              style={{ color: HOME.ink, textWrap: "balance", wordBreak: "keep-all" }}
            >
              {heroTitle}
            </h2>

            <div
              className="motion-reduce:animate-none animate-[hero-reveal_650ms_cubic-bezier(0.22,1,0.36,1)_both]"
              style={{ animationDelay: "120ms" }}
            >
              <HeroBody text={slide.description || t.description} />
            </div>

            <div
              className="mt-7 flex flex-wrap items-center gap-3 motion-reduce:animate-none animate-[hero-reveal_650ms_cubic-bezier(0.22,1,0.36,1)_both] sm:gap-4"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href={slide.ctaPrimary?.href || withLocalePath("/categories", locale)}
                className="home-btn home-btn-glass inline-flex items-center justify-center rounded px-6 py-3 text-[14px] font-bold tracking-[0.03em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a7a1e] sm:px-7"
              >
                {slide.ctaPrimary?.label || t.viewCatalog}
              </Link>
              <Link
                href={slide.ctaSecondary?.href || withLocalePath("/contact", locale)}
                className="home-btn home-btn-glass-outline inline-flex items-center justify-center rounded px-6 py-3 text-[14px] font-bold tracking-[0.03em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a7a1e] sm:px-7"
              >
                {slide.ctaSecondary?.label || t.contactSales}
              </Link>
            </div>
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
