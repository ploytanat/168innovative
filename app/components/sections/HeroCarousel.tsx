'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { HomeHeroView } from '@/app/lib/types/view'

const AUTOPLAY_MS = 6000

interface Props {
  hero: HomeHeroView
}

export default function HeroCarousel({ hero }: Props) {
  const slides = hero.slides ?? []
  const [current, setCurrent] = useState(0)
  const active = slides[current]
  const hasMultiple = slides.length > 1

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (!hasMultiple) return
    const id = setInterval(next, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [hasMultiple, next])

  if (!active) return null

  return (
    <section className="w-full bg-white border-y border-neutral-200 overflow-hidden">

      {/* ── Mobile layout (< lg) ── */}
      <div className="flex flex-col lg:hidden">

        {/* Image — top on mobile */}
        <div className="relative w-full aspect-[4/3] bg-neutral-50 overflow-hidden">
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg,#e5e5e5 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center p-8"
            >
              <div className="relative w-full h-full">
                <Image
                  src={active.image.src}
                  alt={active.image.alt}
                  fill
                  className="object-contain"
                  priority={current === 0}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next arrows + dots — mobile */}
          {hasMultiple && (
            <>
              {/* Prev */}
              <button
                type="button"
                onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
                aria-label="สไลด์ก่อนหน้า"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20
                           flex items-center justify-center
                           w-10 h-10 rounded-full
                           bg-white/80 backdrop-blur-sm
                           border border-neutral-200 shadow-sm
                           active:scale-95 transition-transform"
              >
                <ChevronLeft size={18} className="text-neutral-700" />
              </button>

              {/* Next */}
              <button
                type="button"
                onClick={() => setCurrent((c) => (c + 1) % slides.length)}
                aria-label="สไลด์ถัดไป"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20
                           flex items-center justify-center
                           w-10 h-10 rounded-full
                           bg-white/80 backdrop-blur-sm
                           border border-neutral-200 shadow-sm
                           active:scale-95 transition-transform"
              >
                <ChevronRight size={18} className="text-neutral-700" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrent(i)}
                    aria-label={`สไลด์ที่ ${i + 1}`}
                    className="p-2"
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        i === current
                          ? 'w-5 h-[3px] bg-neutral-800'
                          : 'w-[6px] h-[6px] bg-neutral-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content — below image on mobile */}
        <div className="flex flex-col px-5 py-8 border-t border-neutral-200">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[10px] tracking-[0.2em] text-neutral-400">
              {(current + 1).toString().padStart(2, '0')}
            </span>
            <div className="w-8 h-px bg-neutral-300" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400">
              {active.subtitle}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-4xl leading-[1.05] font-light text-neutral-900"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {active.title}
          </h1>

          <div className="w-8 h-px bg-neutral-900 my-5" />

          {/* Description */}
          <p className="text-sm leading-7 text-neutral-500">
            {active.description}
          </p>

          {/* CTA */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              href={active.ctaPrimary.href}
              className="flex items-center gap-2 px-6 py-3 text-xs tracking-[0.12em] uppercase bg-black text-white border border-black transition hover:bg-white hover:text-black"
            >
              {active.ctaPrimary.label}
              <ArrowRight size={13} />
            </Link>

            {active.ctaSecondary?.label && (
              <Link
                href={active.ctaSecondary.href}
                className="text-xs tracking-[0.12em] uppercase text-neutral-500 border-b border-transparent hover:border-black hover:text-black pb-1"
              >
                {active.ctaSecondary.label}
              </Link>
            )}
          </div>

          {/* Stats — mobile: horizontal scroll */}
          {active.stats && active.stats.length > 0 && (
            <div className="mt-7 pt-6 border-t border-neutral-200 flex gap-6 overflow-x-auto pb-1 no-scrollbar">
              {active.stats.map((s, i) => (
                <div key={i} className="shrink-0">
                  <div
                    className="text-2xl font-semibold text-neutral-900"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mt-1 whitespace-nowrap">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Desktop layout (>= lg) — เหมือนเดิมทุกอย่าง ── */}
      <div className="hidden lg:grid lg:grid-cols-2 min-h-[calc(100vh-80px)]">

        {/* LEFT */}
        <div className="flex flex-col justify-between px-20 py-16 border-r border-neutral-200">
          <div className="flex flex-col justify-center flex-1">

            <div className="flex items-center gap-4 mb-10">
              <span className="text-[11px] tracking-[0.2em] text-neutral-500">
                {(current + 1).toString().padStart(2, '0')}
              </span>
              <div className="w-10 h-px bg-neutral-300" />
              <span className="text-[11px] tracking-[0.35em] uppercase text-neutral-500">
                {active.subtitle}
              </span>
            </div>

            <h1
              className="text-[clamp(2.4rem,6vw,6rem)] leading-[1] font-light text-neutral-900"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {active.title}
            </h1>

            <div className="w-10 h-px bg-neutral-900 my-10" />

            <p className="max-w-sm text-sm leading-7 text-neutral-500">
              {active.description}
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-6">
              <Link
                href={active.ctaPrimary.href}
                className="flex items-center gap-2 px-8 py-4 text-xs tracking-[0.12em] uppercase bg-black text-white border border-black transition hover:bg-white hover:text-black"
              >
                {active.ctaPrimary.label}
                <ArrowRight size={14} />
              </Link>

              {active.ctaSecondary?.label && (
                <Link
                  href={active.ctaSecondary.href}
                  className="text-xs tracking-[0.12em] uppercase text-neutral-500 border-b border-transparent hover:border-black hover:text-black pb-1"
                >
                  {active.ctaSecondary.label}
                </Link>
              )}
            </div>
          </div>

          {active.stats && (
            <div className="flex flex-wrap gap-12 pt-12 border-t border-neutral-200">
              {active.stats.map((s, i) => (
                <div key={i}>
                  <div
                    className="text-3xl font-semibold text-neutral-900"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-[11px] tracking-[0.2em] uppercase text-neutral-500 mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — image fills entire panel */}
        <div className="relative bg-neutral-50 overflow-hidden">
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg,#e5e5e5 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />

          {/* Image fills full panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-10"
            >
              <Image
                src={active.image.src}
                alt={active.image.alt}
                fill
                className="object-contain p-8"
                priority={current === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next arrows */}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
                aria-label="สไลด์ก่อนหน้า"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20
                           flex items-center justify-center
                           w-11 h-11 rounded-full
                           bg-white/80 backdrop-blur-sm
                           border border-neutral-200 shadow-md
                           hover:bg-white hover:shadow-lg
                           active:scale-95 transition-all"
              >
                <ChevronLeft size={20} className="text-neutral-700" />
              </button>

              <button
                type="button"
                onClick={() => setCurrent((c) => (c + 1) % slides.length)}
                aria-label="สไลด์ถัดไป"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20
                           flex items-center justify-center
                           w-11 h-11 rounded-full
                           bg-white/80 backdrop-blur-sm
                           border border-neutral-200 shadow-md
                           hover:bg-white hover:shadow-lg
                           active:scale-95 transition-all"
              >
                <ChevronRight size={20} className="text-neutral-700" />
              </button>
            </>
          )}

          {/* Counter + dots bottom bar */}
          {hasMultiple && (
            <div className="absolute bottom-0 left-0 right-0 z-20
                            flex items-center justify-between
                            px-6 py-4
                            bg-gradient-to-t from-white/60 to-transparent">
              <span className="text-[11px] tracking-[0.2em] text-neutral-500 tabular-nums">
                {(current + 1).toString().padStart(2, '0')}
                <span className="mx-2 text-neutral-300">/</span>
                {slides.length.toString().padStart(2, '0')}
              </span>

              <div className="flex items-center gap-1">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrent(i)}
                    aria-label={`สไลด์ที่ ${i + 1}`}
                    className="p-2 group"
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        i === current
                          ? 'w-6 h-[3px] bg-neutral-800'
                          : 'w-[6px] h-[6px] bg-neutral-300 group-hover:bg-neutral-500'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}