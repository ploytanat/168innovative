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

export default function PromoGrid({ whys, locale }: { whys: WhyItemView[]; locale: Locale }) {
  const tiles = whys.slice(0, 4)

  return (
    <section className={`relative ${SECTION_PAD}`} style={{ background: HOME.surface }}>
      <div className={CONTAINER}>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_2fr_1.2fr]">

          <div className="flex flex-col justify-between gap-8 rounded-lg p-8 sm:p-10" style={{ background: HOME.pink }}>
            <div>
              <h2 className={`${SECTION_HEADING} text-[clamp(1.3rem,1rem+1vw,1.7rem)] font-bold`} style={{ color: HOME.ink }}>
                {COPY.consultTitle[locale]}
              </h2>
              <p className="mt-3 text-[0.92rem] leading-[1.6]" style={{ color: HOME.inkMid }}>
                {COPY.consultDesc[locale]}
              </p>
            </div>
            <Link href={withLocalePath("/contact", locale)}
              className="home-btn home-btn-accent inline-flex w-fit items-center rounded-[5px] px-6 py-3 text-[13px] font-bold">
              {COPY.consultBtn[locale]}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {tiles.map((item, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-lg p-5"
                style={{ background: HOME.cream, border: `1px solid ${HOME.line}` }}>
                <div className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: HOME.mint }}>
                  {item.image?.src ? (
                    <div className="relative h-6 w-6">
                      <Image src={item.image.src} alt={item.image.alt || item.title} fill sizes="24px" className="object-contain" />
                    </div>
                  ) : (
                    <span className="text-[15px] font-bold" style={{ color: HOME.mintInk }}>{i + 1}</span>
                  )}
                </div>
                <h3 className="text-[14px] font-bold uppercase tracking-[0.02em]" style={{ color: HOME.ink }}>
                  {item.title}
                </h3>
                <p className="text-[0.85rem] leading-[1.6]" style={{ color: HOME.inkMid }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-between gap-8 rounded-lg p-8 sm:p-10" style={{ background: HOME.yellow }}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: HOME.inkSoft }}>
                {COPY.eyebrow[locale]}
              </p>
              <h2 className={`mt-2 ${SECTION_HEADING} text-[clamp(1.3rem,1rem+1vw,1.7rem)] font-bold`} style={{ color: HOME.ink }}>
                {COPY.storyTitle[locale]}
              </h2>
              <p className="mt-3 text-[0.92rem] leading-[1.6]" style={{ color: HOME.inkMid }}>
                {COPY.storyDesc[locale]}
              </p>
            </div>
            <Link href={withLocalePath("/about", locale)}
              className="home-btn home-btn-accent inline-flex w-fit items-center rounded-[5px] px-6 py-3 text-[13px] font-bold">
              {COPY.storyBtn[locale]}
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
