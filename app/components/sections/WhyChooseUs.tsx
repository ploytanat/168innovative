import Image from "next/image"

import { uiText } from "@/app/lib/i18n/ui"
import { WhyItemView } from "@/app/lib/types/view"

interface WhyChooseUsProps {
  items: WhyItemView[]
  locale: "th" | "en"
}

export default function WhyChooseUs({ items, locale }: WhyChooseUsProps) {
  if (!items.length) return null

  return (
    <section className="relative overflow-hidden bg-transparent py-14 sm:py-16 md:py-24">
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/75 to-transparent" />
        <div className="absolute left-[-8rem] top-12 h-56 w-56 rounded-full bg-[#e7f9ee]/80 blur-3xl" />
        <div className="absolute right-[-5rem] top-20 h-48 w-48 rounded-full bg-[#f2edff]/80 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-xl font-bold text-[var(--color-ink)] sm:mb-12 sm:text-2xl md:text-3xl">
          {uiText.whyChooseUs.title[locale]}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-[rgba(205,222,241,0.72)] bg-[linear-gradient(145deg,rgba(255,255,255,0.84),rgba(241,251,255,0.78),rgba(255,241,246,0.7))] px-5 py-6 text-center shadow-xl backdrop-blur-xl transition-all duration-300 sm:p-7 lg:p-8 lg:hover:-translate-y-2 lg:hover:shadow-[0_18px_44px_rgba(28,40,66,0.14)]"
            >
              <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#2ecfc4]/45 to-transparent" />

              <div className="mb-4 flex h-16 w-16 items-center justify-center sm:mb-5 sm:h-18 sm:w-18">
                {item.image?.src ? (
                  <div className="relative h-[72px] w-[72px]">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt || item.title}
                      fill
                      sizes="72px"
                      className="object-contain transition-transform duration-300 lg:group-hover:scale-110"
                    />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#f7fbff] text-[#b9c4de]">
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <h3 className="mb-2 text-sm font-bold text-[var(--color-ink)] sm:text-base md:text-lg">
                {item.title}
              </h3>

              <p className="text-xs leading-relaxed text-[var(--color-ink-soft)] sm:text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
