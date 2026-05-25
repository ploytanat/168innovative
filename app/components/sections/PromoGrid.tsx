import Image from "next/image"
import Link from "next/link"

import { WhyItemView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

import { CONTAINER, HOME, SECTION_HEADING, SECTION_PAD } from "./home-theme"

type Locale = "th" | "en"

const COPY = {
  consultTitle: { th: "ปรึกษาเรื่องบรรจุภัณฑ์กับเรา", en: "Talk packaging with us" },
  consultDesc:  { th: "ทีมงานพร้อมช่วยเลือกบรรจุภัณฑ์และวางแผนงาน OEM / ODM ให้แบรนด์ของคุณ", en: "Our team helps you choose packaging and plan OEM / ODM work for your brand." },
  consultBtn:   { th: "ติดต่อทีมงาน",      en: "Contact our team" },
  storyTitle:   { th: "เรื่องราวของเรา",    en: "Our story" },
  storyDesc:    { th: "รู้จัก 168 Innovative ให้มากขึ้น", en: "Get to know 168 Innovative." },
  storyBtn:     { th: "เกี่ยวกับเรา",        en: "About us" },
  eyebrow:      { th: "ทำไมต้องเรา",         en: "Why us" },
} as const

const TILE_BG = [
  "rgba(253,227,204,0.55)",   // peach
  "rgba(216,234,212,0.55)",   // sage
  "rgba(244,234,208,0.55)",   // cream/sand
  "rgba(223,230,245,0.55)",   // periwinkle
] as const

const glass = (bg: string) => ({
  background: bg,
  backdropFilter: "blur(16px) saturate(140%)",
  WebkitBackdropFilter: "blur(16px) saturate(140%)",
  border: "1px solid rgba(255,255,255,0.55)",
  boxShadow: "0 10px 28px rgba(20,22,28,0.06), inset 0 1px 0 rgba(255,255,255,0.65)",
})

export default function PromoGrid({ whys, locale }: { whys: WhyItemView[]; locale: Locale }) {
  const tiles = whys.slice(0, 4)

  return (
    <section className={`relative overflow-hidden ${SECTION_PAD}`} style={{ background: HOME.surface }}>
      {/* Colourful blurred backdrop blobs — what the glass panels sample */}
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-16 h-[420px] w-[420px] rounded-full" style={{ background: "#fce4ec", filter: "blur(80px)", opacity: 0.7 }} />
      <div aria-hidden className="pointer-events-none absolute right-1/3 top-8 h-[380px] w-[380px] rounded-full" style={{ background: "#dfe6f5", filter: "blur(80px)", opacity: 0.6 }} />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 left-1/3 h-[360px] w-[360px] rounded-full" style={{ background: "#d8ead4", filter: "blur(80px)", opacity: 0.55 }} />
      <div aria-hidden className="pointer-events-none absolute -bottom-16 -right-20 h-[420px] w-[420px] rounded-full" style={{ background: "#fde3cc", filter: "blur(80px)", opacity: 0.6 }} />

      <div className={`${CONTAINER} relative`}>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_2fr_1.2fr]">

          <div className="flex flex-col justify-between gap-8 rounded-lg p-8 sm:p-10" style={glass("rgba(252,228,236,0.55)")}>
            <div>
              <h2 className={`${SECTION_HEADING} text-[clamp(1.5rem,1.1rem+1.2vw,2rem)] font-bold`} style={{ color: HOME.ink }}>
                {COPY.consultTitle[locale]}
              </h2>
              <p className="mt-3 text-[1rem] leading-[1.6]" style={{ color: HOME.inkMid }}>
                {COPY.consultDesc[locale]}
              </p>
            </div>
            <Link href={withLocalePath("/contact", locale)}
              className="home-btn home-btn-accent inline-flex w-fit items-center rounded-[5px] px-6 py-3 text-[14px] font-bold">
              {COPY.consultBtn[locale]}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {tiles.map((item, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-lg p-5"
                style={glass(TILE_BG[i % TILE_BG.length])}>
                <div className="flex h-11 w-11 items-center justify-center rounded-full"
                  style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 2px 6px rgba(20,22,28,0.06)" }}>
                  {item.image?.src ? (
                    <div className="relative h-6 w-6">
                      <Image src={item.image.src} alt={item.image.alt || item.title} fill sizes="24px" className="object-contain" />
                    </div>
                  ) : (
                    <span className="text-[16px] font-bold" style={{ color: HOME.mintInk }}>{i + 1}</span>
                  )}
                </div>
                <h3 className="text-[15px] font-bold uppercase tracking-[0.02em]" style={{ color: HOME.ink }}>
                  {item.title}
                </h3>
                <p className="text-[0.95rem] leading-[1.6]" style={{ color: HOME.inkMid }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-between gap-8 rounded-lg p-8 sm:p-10" style={glass("rgba(232,223,238,0.55)")}>
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: HOME.inkSoft }}>
                {COPY.eyebrow[locale]}
              </p>
              <h2 className={`mt-2 ${SECTION_HEADING} text-[clamp(1.5rem,1.1rem+1.2vw,2rem)] font-bold`} style={{ color: HOME.ink }}>
                {COPY.storyTitle[locale]}
              </h2>
              <p className="mt-3 text-[1rem] leading-[1.6]" style={{ color: HOME.inkMid }}>
                {COPY.storyDesc[locale]}
              </p>
            </div>
            <Link href={withLocalePath("/about", locale)}
              className="home-btn home-btn-accent inline-flex w-fit items-center rounded-[5px] px-6 py-3 text-[14px] font-bold">
              {COPY.storyBtn[locale]}
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
