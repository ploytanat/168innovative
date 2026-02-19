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
  locale: 'th' | 'en'
}

export default function ProductMarquee({ items, locale }: ProductMarqueeProps) {
  if (!items.length) return null

  const doubleItems = [...items, ...items]
  const marqueeRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  return (
    <section className="relative overflow-hidden bg-white py-4">

      {/* ── Blush glow orbs ── */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-rose-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-pink-100/50 blur-3xl" />

      {/* ── Subtle dot texture ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Thin rose-gold top border ── */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, #d4a0a0, #e8c4b8, #d4a0a0, transparent)' }}
      />

      {/* ── Header ── */}
      <div className="relative mb-12 px-6 text-center">
       
        <h2
          className="mt-3 text-2xl font-bold text-slate-800 sm:text-3xl"
          style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif Thai', serif", letterSpacing: '0.02em' }}
        >
          {uiText.featuredProducts[locale]}
        </h2>
        {/* Decorative divider */}
        <div className="mx-auto mt-4 flex items-center justify-center gap-2">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-rose-300" />
          <div className="h-1 w-1 rounded-full bg-rose-300" />
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-rose-300" />
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden w-full overflow-x-auto px-4 scrollbar-hide touch-pan-x">
        <div className="flex flex-nowrap gap-3 snap-x snap-mandatory pb-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={withLocalePath(
                `/categories/${item.categorySlug}/${item.slug}`,
                locale
              )}
              className="snap-start shrink-0"
            >
              <div className="w-36 rounded-2xl bg-white border border-rose-100 p-2.5 shadow-sm active:scale-95 transition-transform">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-rose-50/50">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt || item.name}
                    fill
                    sizes="144px"
                    className="object-cover"
                    draggable={false}
                  />
                </div>
                <p className="mt-2.5 text-[11px] font-medium line-clamp-1 text-center text-slate-600">
                  {item.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="relative hidden md:block overflow-hidden">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40 bg-gradient-to-l from-white to-transparent" />

        <motion.div
          ref={marqueeRef}
          className="flex gap-5 px-8 py-6 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: -2000, right: 0 }}
          dragElastic={0.08}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          animate={!isDragging ? { x: ['0%', '-50%'] } : undefined}
          transition={{ repeat: Infinity, ease: 'linear', duration: 38 }}
        >
          {doubleItems.map((item, i) => (
            <Link
              key={`${item.id}-${i}`}
              href={withLocalePath(
                `/categories/${item.categorySlug}/${item.slug}`,
                locale
              )}
              className={isDragging ? 'pointer-events-none' : 'group'}
            >
              <div className="relative w-44 shrink-0 rounded-2xl border border-rose-100 bg-white p-3 shadow-sm transition-all duration-300 group-hover:border-rose-200 group-hover:shadow-lg group-hover:-translate-y-1.5">

                {/* Hover blush fill */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-rose-50/0 to-rose-50/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative aspect-square overflow-hidden rounded-xl bg-rose-50/40">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt || item.name}
                    fill
                    sizes="176px"
                    className="object-cover select-none transition-transform duration-500 group-hover:scale-105"
                    draggable={false}
                  />
                </div>

                <p className="relative mt-3 text-[11px] font-medium text-center line-clamp-1 text-slate-500 transition-colors duration-300 group-hover:text-rose-500">
                  {item.name}
                </p>

                {/* Rose gold underline */}
                <div className="mx-auto mt-2 h-px w-0 rounded-full bg-gradient-to-r from-rose-300 to-pink-300 transition-all duration-300 group-hover:w-10" />
              </div>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* ── CTA ── */}
      <div className="mt-10 text-center">
        <Link
          href={withLocalePath('/categories', locale)}
          className="inline-flex items-center gap-2.5 rounded-full border border-rose-200 bg-white px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-400 shadow-sm transition-all duration-300 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500 hover:shadow-md"
        >
          ดูสินค้าทั้งหมด
          <span>✦</span>
        </Link>
      </div>

      {/* ── Thin rose-gold bottom border ── */}
      <div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, #d4a0a0, #e8c4b8, #d4a0a0, transparent)' }}
      />
    </section>
  )
}