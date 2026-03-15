import Image from "next/image"

import { uiText } from "@/app/lib/i18n/ui"
import { WhyItemView } from "@/app/lib/types/view"
import {
  COLORS,
  EYEBROW_PILL_STYLE,
  GLASS,
  SECTION_BORDER,
  SOFT_IMAGE_BG,
  SOFT_IMAGE_BG_ALT,
} from "@/app/components/ui/designSystem"

interface WhyChooseUsProps {
  items: WhyItemView[]
  locale: "th" | "en"
}

export default function WhyChooseUs({ items, locale }: WhyChooseUsProps) {
  if (!items.length) return null

  return (
    <section className="relative overflow-hidden py-14 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t pt-6" style={{ borderColor: SECTION_BORDER }}>
          <div className="mb-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]" style={EYEBROW_PILL_STYLE}>Core Strengths</p>
              <h2 className="font-heading mt-3 text-[clamp(1.9rem,3vw,3.2rem)] leading-[1.04]" style={{ color: COLORS.dark }}>
                {uiText.whyChooseUs.title[locale]}
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 sm:text-base sm:leading-8" style={{ color: COLORS.mid }}>
              {locale === "th"
                ? "จัดข้อมูลความแข็งแรงของทีมให้อยู่ในภาษาภาพที่คมขึ้น อ่านง่ายขึ้น และมีจังหวะ light/dark แบบ deck presentation"
                : "A cleaner light-dark presentation of the capabilities that support sourcing, communication, and production."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => {
              const iconBg = index % 2 === 0 ? SOFT_IMAGE_BG : SOFT_IMAGE_BG_ALT

              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-[0.95rem] p-5 sm:p-6"
                  style={index % 3 === 0 ? GLASS.secondary : index % 3 === 1 ? GLASS.stats : GLASS.card}
                >
                  <div
                    className="absolute inset-x-5 top-0 h-px bg-[linear-gradient(90deg,rgba(52,54,59,0.84),rgba(95,143,216,0.82),rgba(223,228,234,0.96))]"
                  />

                  <div
                    className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-[0.95rem] border"
                    style={{ ...GLASS.card, background: iconBg }}
                  >
                    {item.image?.src ? (
                      <div className="relative h-10 w-10">
                        <Image
                          src={item.image.src}
                          alt={item.image.alt || item.title}
                          fill
                          sizes="40px"
                          className="object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold leading-tight" style={{ color: COLORS.dark }}>
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7" style={{ color: COLORS.mid }}>
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
