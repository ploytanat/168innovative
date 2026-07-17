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
  const textY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 90])
  const imageY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -40])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, shouldReduceMotion ? 1 : 1.08])

  if (!slide) return null

  const t = COPY[locale]
  const heroTitle = slide.title || t.fallbackTitle

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ background: HOME.surface }}>
      {/* Ambient giant wordmark — a full-bleed watermark behind the whole
          hero, decoupled from the image's box entirely. Earlier versions
          tried to compose "168 INNOVATIVE" tightly behind the image itself
          (same width, vertically centered on it), which kept breaking:
          the image's height vs. the text's height mismatched on mobile
          (image spilled into the headline below), then fixing that made
          the image swallow most of the text (unreadable), then narrowing
          the image re-opened the height/overlap problem elsewhere. Each
          fix was a local patch on a structurally fragile coupling. Making
          the text a section-wide watermark — independent of the image's
          size, position, or aspect ratio — removes that coupling: it can
          bleed off either edge, never needs to "fit" a box, and the image
          is free to just be a clean, ordinary image. */}
      <motion.p
        aria-hidden
        style={{ color: HOME.leaf, y: textY }}
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-display text-[clamp(3.5rem,2rem+10vw,10rem)] font-bold leading-none opacity-[0.14] sm:opacity-[0.16]"
      >
        {t.displayWord} {t.displayWordAccent}
      </motion.p>

      <div className={`${CONTAINER} relative py-12 sm:py-16`}>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">

          {/* Image column — clean and self-contained, no longer shares its
              box with the background text. Parallax: image drifts up and
              scales in slightly as the hero scrolls past. */}
          <motion.div
            className="relative aspect-3/2 w-full motion-reduce:animate-none animate-[hero-reveal-image_700ms_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ y: imageY, scale: imageScale }}
          >
            <Image
              src={slide.image.src}
              alt={slide.image.alt || heroTitle}
              fill
              priority
              sizes="(max-width:1023px) 90vw, 50vw"
              className="object-contain"
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
