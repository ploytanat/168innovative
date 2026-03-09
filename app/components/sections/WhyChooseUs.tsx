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
    <section className="bg-transparent py-14 shadow-sm sm:py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-xl font-bold text-[#1e3a5f] sm:mb-12 sm:text-2xl md:text-3xl">
          {uiText.whyChooseUs.title[locale]}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col items-center rounded-3xl border border-white bg-white px-5 py-6 text-center shadow-md transition-all duration-300 sm:p-7 lg:p-8 lg:hover:-translate-y-2 lg:hover:shadow-xl"
            >
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
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gray-50 text-gray-300">
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

              <h3 className="mb-2 text-sm font-bold text-gray-900 sm:text-base md:text-lg">
                {item.title}
              </h3>

              <p className="text-xs leading-relaxed text-gray-500 sm:text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
