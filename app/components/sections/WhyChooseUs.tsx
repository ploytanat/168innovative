'use client'

import Image from 'next/image'
import { WhyItemView } from '@/app/lib/types/view'
import { uiText } from '@/app/lib/i18n/ui'

interface WhyChooseUsProps {
  items: WhyItemView[]
  locale: 'th' | 'en'
}

export default function WhyChooseUs({
  items,
  locale,
}: WhyChooseUsProps) {
  if (!items.length) return null

  return (
    <section className="bg-transparent py-14 sm:py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title */}
        <h2 className="mb-10 sm:mb-12 text-center text-xl sm:text-2xl md:text-3xl font-bold text-[#1e3a5f]">
          {uiText.whyChooseUs.title[locale]}
        </h2>

        {/* Grid */}
        <div
          className="
            grid gap-4 sm:gap-6 lg:gap-8
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="
                group flex flex-col items-center text-center
                rounded-3xl bg-white
                border border-gray-50
                px-5 py-6 sm:p-7 lg:p-8
                shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)]
                transition-all duration-300
                lg:hover:-translate-y-2 lg:hover:shadow-xl
              "
            >
              {/* Icon */}
              <div className="mb-4 sm:mb-5 flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center">
                {item.image?.src ? (
                  <Image
                    src={item.image.src}
                    alt={item.image.alt || item.title}
                    width={72}
                    height={72}
                    className="object-contain transition-transform duration-300 lg:group-hover:scale-110"
                  />
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

              {/* Title */}
              <h3 className="mb-2 text-sm sm:text-base md:text-lg font-bold text-gray-900">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm leading-relaxed text-gray-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
