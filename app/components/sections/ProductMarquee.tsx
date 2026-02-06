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

  const doubleItems = [...items, ...items, ...items]
  const marqueeRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  return (
    <section className="overflow-hidden border-y border-gray-100 shadow-md py-6">
      <h2 className="mb-4 text-center text-2xl font-bold">
        {uiText.featuredProducts[locale]}
      </h2>

      <div className="group relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent md:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent md:w-32" />

        <motion.div
          ref={marqueeRef}
          className="flex gap-6 px-4 py-4 cursor-grab active:cursor-grabbing"
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
              <div className="w-48 sm:w-52 rounded-lg border bg-[#ececec93] p-2 text-center shadow-md hover:scale-105">
                <div className="relative aspect-square w-full overflow-hidden rounded-md bg-[#f8f8f8]">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt || item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 200px"
                    className="object-cover"
                  />
                </div>

                <p className="mt-3 text-xs font-bold text-gray-800 line-clamp-1">
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
