'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useAnimationControls } from 'framer-motion'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { ProductView } from '@/app/lib/types/view'
import { uiText } from '@/app/lib/i18n/ui'
import { withLocalePath } from '@/app/lib/utils/withLocalePath'

interface ProductMarqueeProps {
  items: ProductView[]
  locale: 'th' | 'en'
}

export default function ProductMarquee({ items, locale }: ProductMarqueeProps) {
  if (!items.length) return null

  const doubleItems = useMemo(() => [...items, ...items], [items])
  const [isDragging, setIsDragging] = useState(false)
  const controls = useAnimationControls()

  const startMarquee = useCallback(() => {
    controls.start({
      x: ['0%', '-50%'],
      transition: { repeat: Infinity, ease: 'linear', duration: 45 },
    })
  }, [controls])

  useEffect(() => {
    startMarquee()
  }, [startMarquee])

  const handleDragStart = useCallback(() => {
    setIsDragging(true)
    controls.stop()
  }, [controls])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    controls.set({ x: 0 })
    startMarquee()
  }, [controls, startMarquee])

  return (
    <section className="relative overflow-hidden bg-white py-12 md:py-4">

      {/* ── Blush glow orbs ── */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-48 w-48 md:h-96 md:w-96 rounded-full bg-rose-100/60 blur-[80px] md:blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 h-48 w-48 md:h-96 md:w-96 rounded-full bg-pink-100/50 blur-[80px] md:blur-[120px]" />

      {/* ── Subtle dot texture ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Top border ── */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, #d4a0a0, #e8c4b8, #d4a0a0, transparent)' }}
      />

      {/* ── Header ── */}
      <div className="relative mb-8 md:mb-16 px-6 text-center">
        <h2
          className="mt-3 text-2xl font-bold text-slate-800 sm:text-3xl lg:text-4xl"
          style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif Thai', serif", letterSpacing: '0.02em' }}
        >
          {uiText.featuredProducts[locale]}
        </h2>
        <div className="mx-auto mt-4 flex items-center justify-center gap-2">
          <div className="h-px w-8 bg-rose-300 md:w-12" />
          <div className="h-1 w-1 rounded-full bg-rose-300" />
          <div className="h-px w-8 bg-rose-300 md:w-12" />
        </div>
      </div>

      {/* ================= MOBILE & TABLET (Scroll) ================= */}
      <div className="lg:hidden w-full overflow-x-auto px-4 scrollbar-hide touch-pan-x">
        <div className="flex flex-nowrap gap-4 pb-6">
          {items.map((item, i) => (
            <Link
              key={item.id}
              href={withLocalePath(`/categories/${item.categorySlug}/${item.slug}`, locale)}
              className="shrink-0"
            >
              <div className="w-40 md:w-48 rounded-2xl bg-white border border-rose-100 p-3 shadow-sm active:scale-95 transition-transform">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-rose-50/50">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt || item.name}
                    fill
                    sizes="(max-width: 768px) 160px, 192px"
                    className="object-cover"
                    draggable={false}
                    priority={i < 3}
                  />
                </div>
                <p className="mt-3 text-xs font-medium line-clamp-1 text-center text-slate-600 px-1">
                  {item.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ================= DESKTOP (Marquee) ================= */}
      <div className="relative hidden lg:block overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40" style={{ backgroundImage: 'linear-gradient(to right, white, transparent)' }} />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40" style={{ backgroundImage: 'linear-gradient(to left, white, transparent)' }} />

        {/* ✅ drag layer แยกจาก animate layer */}
        <motion.div
          className="flex gap-6 px-8 py-1 cursor-grab active:cursor-grabbing"
          style={{ willChange: 'transform' }}
          drag="x"
          dragConstraints={{ left: -2500, right: 0 }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* ✅ animate layer วิ่งอิสระ ไม่ถูก drag interrupt */}
          <motion.div
            className="flex gap-6"
            style={{ willChange: 'transform' }}
            animate={controls}
          >
            {doubleItems.map((item, i) => (
              <Link
                key={`${item.id}-${i}`}
                href={withLocalePath(`/categories/${item.categorySlug}/${item.slug}`, locale)}
                className={isDragging ? 'pointer-events-none' : 'group'}
              >
                <div className="relative w-48 shrink-0 rounded-2xl border border-rose-100 bg-white p-3.5 shadow-sm transition-all duration-500 group-hover:border-rose-200 group-hover:shadow-xl group-hover:-translate-y-2" style={{ willChange: 'transform, box-shadow' }}>
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-rose-50/0 to-rose-50/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative aspect-square overflow-hidden rounded-xl bg-rose-50/40">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt || item.name}
                      fill
                      sizes="192px"
                      className="object-cover select-none transition-transform duration-700 group-hover:scale-110"
                      draggable={false}
                      priority={i < 4}
                    />
                  </div>

                  <p className="relative mt-4 text-[12px] font-medium text-center line-clamp-1 text-slate-500 transition-colors duration-300 group-hover:text-rose-500">
                    {item.name}
                  </p>
                  <div className="mx-auto mt-2.5 h-px w-0 rounded-full bg-linear-to-r from-rose-300 to-pink-300 transition-all duration-500 group-hover:w-12" />
                </div>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── CTA ── */}
      <div className="mt-8 md:mt-6 text-center">
        <Link
          href={withLocalePath('/categories', locale)}
          className="inline-flex items-center gap-2.5 rounded-full border border-rose-200 bg-white px-8 py-3 text-[11px] md:text-xs font-semibold uppercase tracking-[0.2em] text-rose-400 shadow-sm transition-all duration-300 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500 hover:shadow-md active:scale-95"
        >
          {locale === 'th' ? 'ดูสินค้าทั้งหมด' : 'View All Products'}
          <span className="text-sm">✦</span>
        </Link>
      </div>

      {/* ── Bottom border ── */}
      <div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, #d4a0a0, #e8c4b8, #d4a0a0, transparent)' }}
      />
    </section>
  )
}