import Image from "next/image"
import Link from "next/link"

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

// Leaf reserved for one sparse highlight — pale tint / white outline carry the rest
const ICON_PALETTE = [
  { bg: HOME.leaf,    ink: HOME.ink },
  { bg: HOME.mint,    ink: HOME.mintInk },
  { bg: HOME.surface, ink: HOME.mintInk },
  { bg: HOME.mint,    ink: HOME.mintInk },
  { bg: HOME.surface, ink: HOME.mintInk },
  { bg: HOME.mint,    ink: HOME.mintInk },
] as const

export default function PromoGrid({ whys, locale }: { whys: WhyItemView[]; locale: Locale }) {
  const tiles = whys.slice(0, 6)
  if (tiles.length === 0) return null

  return (
    <section className="relative py-12 sm:py-16" style={{ background: HOME.surface }}>
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

        <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 sm:gap-x-10 lg:mt-16 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-12">
          {tiles.map((item, i) => {
            const palette = ICON_PALETTE[i % ICON_PALETTE.length]
            return (
            <li key={i} className="flex flex-col items-center text-center">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-lg transition-transform duration-300 hover:scale-105 sm:h-20 sm:w-20"
                style={{
                  background: palette.bg,
                  color: palette.ink,
                  border: palette.bg === HOME.surface ? `1px solid ${HOME.line}` : undefined,
                }}
              >
                {item.image?.src ? (
                  <div className="relative h-9 w-9 sm:h-11 sm:w-11">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt || item.title}
                      fill
                      sizes="44px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-[22px] font-bold sm:text-[28px]">{i + 1}</span>
                )}
              </div>

              <h3 className="mt-5 text-[17px] font-bold leading-[1.35] sm:text-[18px]" style={{ color: HOME.ink }}>
                {item.title}
              </h3>
              <p className="mt-2 max-w-[36ch] text-[15px] leading-[1.65]" style={{ color: HOME.inkMid }}>
                {item.description}
              </p>
            </li>
            )
          })}
        </ul>

        <div className="mt-12 flex justify-center lg:mt-16">
          <Link
            href={withLocalePath("/contact", locale)}
            className="inline-flex items-center justify-center rounded px-7 py-3 text-[14px] font-bold tracking-[0.03em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a7a1e]"
            style={{ background: HOME.leaf, color: HOME.ink }}
          >
            {COPY.ctaTalk[locale]} →
          </Link>
        </div>

      </div>
    </section>
  )
}
