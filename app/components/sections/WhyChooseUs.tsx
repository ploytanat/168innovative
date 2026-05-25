import Image from "next/image"

import { uiText } from "@/app/lib/i18n/ui"
import { WhyItemView } from "@/app/lib/types/view"

import { CONTAINER, HOME, SECTION_HEADING, SECTION_PAD } from "./home-theme"

export default function WhyChooseUs({ items, locale }: { items: WhyItemView[]; locale: "th" | "en" }) {
  if (!items.length) return null

  return (
    <section className={`relative ${SECTION_PAD}`} style={{ background: HOME.surface }}>
      <div className={CONTAINER}>
        <h2 className={`${SECTION_HEADING} text-center text-[clamp(1.7rem,1.2rem+1.5vw,2.2rem)] font-bold`} style={{ color: HOME.ink }}>
          {uiText.whyChooseUs.title[locale]}
        </h2>

        <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-lg p-6"
              style={{ background: HOME.cream, border: `1px solid ${HOME.line}` }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: HOME.mint }}>
                {item.image?.src ? (
                  <div className="relative h-6 w-6">
                    <Image src={item.image.src} alt={item.image.alt || item.title} fill sizes="24px" className="object-contain" />
                  </div>
                ) : (
                  <span className="text-[16px] font-bold" style={{ color: HOME.mintInk }}>{i + 1}</span>
                )}
              </div>
              <h3 className="text-[15px] font-bold uppercase tracking-[0.02em]" style={{ color: HOME.ink }}>{item.title}</h3>
              <p className="text-[0.95rem] leading-[1.65]" style={{ color: HOME.inkMid }}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
