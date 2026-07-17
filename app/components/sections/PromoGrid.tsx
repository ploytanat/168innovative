"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { WhyItemView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

import { CONTAINER, HOME, SECTION_HEADING } from "./home-theme"

type Locale = "th" | "en"

const COPY = {
  heading:    { th: "ทำไมต้องเลือก 168 INNOVATIVE", en: "Why work with 168 INNOVATIVE" },
  description: {
    th: "ทีมงานมีประสบการณ์ พร้อมบริการครบวงจรตั้งแต่ออกแบบจนถึงส่งมอบ",
    en: "Experienced team, full-service from design through delivery.",
  },
  ctaTalk:    { th: "ปรึกษาทีมงาน",      en: "Talk to our team" },
} as const

// Deliberate exception to the site's green/black/white palette — this one
// section reads as a benefits row, not brand chrome, so each icon gets its
// own identity color (tint bg + darker icon, same formula as leaf/mint).
const ICON_PALETTE = [
  { bg: HOME.mint,          ink: HOME.mintInk }, // green — price/value, ties to brand
  { bg: "#e5eef7",          ink: "#2f5f8f" },    // blue — quality/trust
  { bg: "#f1e9f5",          ink: "#7a4f96" },    // plum — OEM/custom
  { bg: "#faf0dc",          ink: "#b8752e" },    // amber — sourcing/logistics speed
] as const

export default function PromoGrid({ whys, locale }: { whys: WhyItemView[]; locale: Locale }) {
  const tiles = whys.slice(0, 6)
  const gridRef = useRef<HTMLUListElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true)
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (tiles.length === 0) return null

  return (
    <section className="relative py-12 sm:py-16" style={{ background: HOME.mist }}>
      <div className={`${CONTAINER} relative`}>

        <div className="mx-auto max-w-2xl text-center">
          <h2
            lang={locale}
            className={`font-display ${SECTION_HEADING} text-[clamp(1.75rem,1.2rem+1.8vw,2.5rem)] font-bold normal-case`}
            style={{ color: HOME.ink, wordBreak: "keep-all", textWrap: "balance" }}
          >
            {COPY.heading[locale]}
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7] sm:text-[16px] lg:text-[17px]" style={{ color: HOME.inkMid }}>
            {COPY.description[locale]}
          </p>
        </div>

        <ul ref={gridRef} className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 sm:gap-x-10 lg:mt-16 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-10">
          {tiles.map((item, i) => {
            const palette = ICON_PALETTE[i % ICON_PALETTE.length]
            return (
            <li key={i}
              className={`flex flex-col items-center text-center ${revealed ? "motion-reduce:animate-none animate-[icon-pop-reveal_450ms_cubic-bezier(0.22,1,0.36,1)_both]" : ""}`}
              style={revealed ? { animationDelay: `${(i % 4) * 90}ms` } : undefined}
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-lg transition-transform duration-300 hover:scale-105 sm:h-16 sm:w-16"
                style={{
                  background: palette.bg,
                  color: palette.ink,
                }}
              >
                {item.image?.src ? (
                  <div className="relative h-8 w-8 sm:h-9 sm:w-9">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt || item.title}
                      fill
                      sizes="36px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-[20px] font-bold sm:text-[24px]">{i + 1}</span>
                )}
              </div>

              <h3 className="mt-4 text-[16px] font-bold leading-[1.35] sm:text-[17px]" style={{ color: HOME.ink }}>
                {item.title}
              </h3>
              <p className="mt-2 max-w-[30ch] text-[14px] leading-[1.6]" style={{ color: HOME.inkMid }}>
                {item.description}
              </p>
            </li>
            )
          })}
        </ul>

        <div className="mt-12 flex justify-center lg:mt-16">
          <Link
            href={withLocalePath("/contact", locale)}
            className="home-btn home-btn-glass inline-flex items-center justify-center rounded px-7 py-3 text-[14px] font-bold tracking-[0.03em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a7a1e]"
          >
            {COPY.ctaTalk[locale]} →
          </Link>
        </div>

      </div>
    </section>
  )
}
