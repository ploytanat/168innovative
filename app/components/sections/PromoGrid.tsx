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

// Distinct icon colors identify value, quality, customization and sourcing.
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
    <section className="showroom-why relative py-12 sm:py-16">
      <div className={`${CONTAINER} relative`}>

        <div className="showroom-why-heading">
          <h2
            lang={locale}
            className={`font-display ${SECTION_HEADING}  font-bold normal-case`}
            style={{ color: HOME.ink, wordBreak: "keep-all", textWrap: "balance" }}
          >
            {COPY.heading[locale]}
          </h2>
        </div>

        <ul ref={gridRef} className="showroom-why-list">
          {tiles.map((item, i) => {
            const palette = ICON_PALETTE[i % ICON_PALETTE.length]
            return (
            <li key={i}
              className={`showroom-why-item ${revealed ? "motion-reduce:animate-none animate-[icon-pop-reveal_450ms_cubic-bezier(0.22,1,0.36,1)_both]" : ""}`}
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
                  <span className="font-bold">{i + 1}</span>
                )}
              </div>

              <h3 className="mt-4 font-bold" style={{ color: HOME.ink }}>
                {item.title}
              </h3>
              <p className="mt-2 max-w-[30ch]" style={{ color: HOME.inkMid }}>
                {item.description}
              </p>
            </li>
            )
          })}
        </ul>

        <div className="mt-8 flex justify-start">
          <Link
            href={withLocalePath("/contact", locale)}
            className="showroom-primary"
          >
            {COPY.ctaTalk[locale]} →
          </Link>
        </div>

      </div>
    </section>
  )
}
