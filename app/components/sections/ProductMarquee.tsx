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
    <section className="border-y border-white  bg-[#02020218] py-6">
      <h2 className="mb-4 text-center text-xl  sm:text-2xl font-bold">
        {uiText.featuredProducts[locale]}
      </h2>

      {/* ================= MOBILE: Native Scroll ================= */}
      <div className="md:hidden overflow-x-auto px-4">
        <div className="flex gap-4 snap-x snap-mandatory">
          {items.map((item) => (
            <Link
              key={item.id}
              href={withLocalePath(
                `/categories/${categorySlug}/${item.slug}`,
                locale
              )}
              className="snap-start shrink-0"
            >
              <div className="w-40 rounded-xl bg-white p-2 shadow-md">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt || item.name}
                    fill
                    sizes="160px"
                    className="object-cover"
                    draggable={false}
                  />
                </div>
                <p className="mt-2 text-xs font-bold line-clamp-1 text-center">
                  {item.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ================= DESKTOP: Marquee ================= */}
      <div className="relative hidden md:block overflow-hidden group">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-linear-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-linear-to-l from-white to-transparent" />

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
              <div className="w-48 rounded-xl bg-white p-2 shadow-md hover:scale-105 transition">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt || item.name}
                    fill
                    sizes="200px"
                    className="object-cover select-none"
                    draggable={false}
                  />
                </div>
                <p className="mt-3 text-xs font-bold text-center line-clamp-1">
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
