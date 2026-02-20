'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CategoryView } from '@/app/lib/types/view'
import { uiText } from '@/app/lib/i18n/ui'
import { withLocalePath } from '@/app/lib/utils/withLocalePath'
import { ArrowRight } from 'lucide-react'

interface CategorySectionProps {
  items: CategoryView[]
  locale: 'th' | 'en'
}

export default function CategorySection({
  items = [],
  locale,
}: CategorySectionProps) {
  if (items.length === 0) return null

  const displayItems = items.slice(0, 6)

  return (
    <section className="bg-[#F8F9FA] py-14 sm:py-16 md:py-24 border border-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 md:mb-14 flex flex-col items-center text-center">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            {uiText.categories.title[locale]}
          </h2>
          <div className="mt-4 h-1.5 w-16 sm:w-20 md:w-24 rounded-full bg-[#29415B]" />
        </div>

        {/* Grid */}
        <div
          className="
            mx-auto grid max-w-6xl
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            gap-4 sm:gap-6 lg:gap-8
          "
        >
          {displayItems.map((item) => (
            <Link
              key={item.id}
              href={withLocalePath(`/categories/${item.slug}`, locale)}
              className="
                group relative overflow-hidden rounded-3xl bg-white
                shadow-sm transition-all duration-500
                hover:-translate-y-2 hover:shadow-2xl
              "
            >
              {/* Image */}
              <div className="relative aspect-square w-full">
              {item.image?.src ? (
  <Image
    src={item.image.src}
    alt={item.image.alt || item.name}
    fill
    sizes="
      (max-width: 640px) 100vw,
      (max-width: 1024px) 50vw,
      33vw
    "
    className="object-cover transition-transform duration-700 group-hover:scale-110"
  />
) : (
  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 text-sm font-medium">
    {uiText.categories.noImage[locale]}
  </div>
)}


                {/* Overlay */}
                <div
                  className="
                    absolute inset-0 flex flex-col justify-end
                    bg-gradient-to-t from-black/60 via-black/20 to-transparent
                    p-5 sm:p-6
                  "
                >
                  <h3
                    className="
                      text-base sm:text-lg md:text-xl
                      font-bold text-white
                      transition-transform duration-500
                      group-hover:-translate-y-1
                    "
                  >
                    {item.name}
                  </h3>

                  {item.description && (
                    <p
                      className="
                        mt-2 text-xs sm:text-sm text-gray-200
                        line-clamp-2
                        opacity-100
                        sm:opacity-0
                        sm:group-hover:opacity-100
                        transition-all duration-500
                        sm:translate-y-3 sm:group-hover:translate-y-0
                      "
                    >
                      {item.description}
                    </p>
                  )}

                  <div
                    className="
                      mt-3 flex items-center gap-1
                      text-[10px] sm:text-xs
                      font-bold uppercase tracking-widest text-blue-400
                      opacity-100
                      sm:opacity-0
                      sm:group-hover:opacity-100
                      transition-all duration-500
                    "
                  >
                    {uiText.categories.exploreMore[locale]}

                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All */}
        <div className="mt-12 sm:mt-16 flex justify-center">
          <Link
            href={withLocalePath('/categories', locale)}
            className="
              group relative inline-flex items-center gap-3
              rounded-full bg-gray-900 px-8 sm:px-10 py-3.5 sm:py-4
              text-sm font-semibold text-white
              transition-all hover:bg-blue-500 hover:shadow-xl
              active:scale-95
            "
          >
            <span>{uiText.categories.viewAll[locale]}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  )
}
