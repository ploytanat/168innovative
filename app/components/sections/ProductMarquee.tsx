'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { ProductView } from '@/app/lib/types/view'
import { uiText } from '@/app/lib/i18n/ui'
import { withLocalePath } from '@/app/lib/utils/withLocalePath'

interface ProductMarqueeProps {
  items: ProductView[]
  categorySlug: string
  locale: 'th' | 'en'
}

export default function ProductMarquee({
  items,
  categorySlug,
  locale,
}: ProductMarqueeProps) {
  if (!items.length) return null

  const doubleItems = [...items, ...items]
  const marqueeRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  return (
    <section 
      className="border-y border-white py-6"
      style={{
        // ปรับเป็นโทนเย็นตามที่คุยกันครับ: Mint Green -> Sky Blue -> Light Grey
        background: 'linear-gradient(to right, #e0f2f1, #e3f2fd, #f5f5f5)'
      }}
    >
      <h2 className="mb-6 text-center text-xl sm:text-2xl font-bold text-slate-800">
        {uiText.featuredProducts[locale]}
      </h2>

      {/* ================= MOBILE: Native Scroll ================= */}
      {/* เพิ่ม touch-pan-x และลบสิ่งกีดขวางการเลื่อนออก */}
      <div className="md:hidden w-full overflow-x-auto px-4 scrollbar-hide touch-pan-x"> 
        <div className="flex flex-nowrap gap-4 snap-x snap-mandatory pb-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={withLocalePath(
                `/categories/${categorySlug}/${item.slug}`,
                locale
              )}
              className="snap-start shrink-0 mb-2" 
            >
              <div className="w-40 rounded-xl bg-white p-2 shadow-md active:scale-95 transition-transform">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt || item.name}
                    fill
                    sizes="160px"
                    className="object-cover"
                    draggable={false}
                  />
                </div>
                <p className="mt-2 text-xs font-bold line-clamp-1 text-center text-slate-700">
                  {item.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ================= DESKTOP: Marquee (Auto-play) ================= */}
      <div className="relative hidden md:block overflow-hidden group">
        {/* Gradient Overlay ซ้าย-ขวา ให้ดูนวลๆ */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#e0f2f1] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#f5f5f5] to-transparent" />

        <motion.div
          ref={marqueeRef}
          className="flex gap-6 px-6 py-4 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: -2000, right: 0 }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          animate={!isDragging ? { x: ['0%', '-50%'] } : undefined}
          transition={{ repeat: Infinity, ease: 'linear', duration: 40 }}
        >
          {doubleItems.map((item, i) => (
            <Link
              key={`${item.id}-${i}`}
              href={withLocalePath(
                `/categories/${categorySlug}/${item.slug}`,
                locale
              )}
              className={isDragging ? 'pointer-events-none' : ''}
            >
              <div className="w-48 rounded-xl bg-white p-2 shadow-md hover:scale-105 transition-all duration-300">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt || item.name}
                    fill
                    sizes="200px"
                    className="object-cover select-none"
                    draggable={false}
                  />
                </div>
                <p className="mt-3 text-xs font-bold text-center line-clamp-1 text-slate-700">
                  {item.name}
                </p>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}