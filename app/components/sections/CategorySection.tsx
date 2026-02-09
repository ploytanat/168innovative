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
    <section className="py-16 md:py-24 bg-[#F8F9FA]">
      <div className="container mx-auto px-4">
        {/* Header - ปรับให้ดูโมเดิร์นขึ้น */}
        <div className="mb-12 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            {uiText.categories.title[locale]}
          </h2>
          <div className="mt-4 h-1.5 w-20 rounded-full bg-blue-600 md:w-24" />
        </div>

        {/* Grid - ปรับให้รูปกับตัวหนังสือรวมกันเป็นหนึ่งเดียว */}
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-8">
          {displayItems.map((item) => (
            <Link
              key={item.id}
              href={withLocalePath(`/categories/${item.slug}`, locale)}
              className="group relative overflow-hidden rounded-[2rem] bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Image Container */}
              <div className="relative aspect-square w-full">
                {item.image?.src ? (
                  <Image
                    src={item.image.src}
                    alt={item.image.alt || item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                    No Image
                  </div>
                )}

                {/* Overlay Text - ตัวหนังสือที่อยู่กับรูปภาพ */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 transition-opacity duration-500">
                  <h3 className="text-lg font-bold text-white md:text-2xl transition-transform duration-500 group-hover:-translate-y-1">
                    {item.name}
                  </h3>
                  
                  {item.description && (
                    <p className="mt-2 line-clamp-1 text-xs text-gray-200 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 md:text-sm">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-blue-400 opacity-0 transition-all duration-500 group-hover:opacity-100">
                    Explore More <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-16 flex justify-center">
          <Link
            href={withLocalePath('/categories', locale)}
            className="group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gray-900 px-10 py-4 text-sm font-semibold text-white transition-all hover:bg-blue-600 hover:shadow-xl active:scale-95"
          >
            <span className="relative z-10">
              {uiText.categories.viewAll[locale]}
            </span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}