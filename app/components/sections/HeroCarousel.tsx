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

      {/* ───────────────────── MOBILE (< lg) ───────────────────── */}
      <div className="flex flex-col lg:hidden">

        {/* IMAGE */}
        <div className="relative w-full aspect-[4/3] bg-neutral-50 overflow-hidden">
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
                  sizes="(max-width: 1024px) 100vw, 100vw"
                  className="object-contain"
                  priority={current === 0}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ARROWS */}
          {hasMultiple && (
            <>
              <button
                type="button"
                aria-label="Previous slide"
                title="Previous slide"
                onClick={() =>
                  setCurrent((c) => (c - 1 + slides.length) % slides.length)
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 border border-neutral-200 shadow-sm flex items-center justify-center"
              >
                <ChevronLeft size={18} />
              </button>

              <button
              type="button"
                aria-label="Next slide"
                title="Next slide"
                onClick={() => setCurrent((c) => (c + 1) % slides.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 border border-neutral-200 shadow-sm flex items-center justify-center"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* DOTS */}
          {hasMultiple && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                type="button"
                aria-label="Next slide"
                title="Next slide"
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="p-2"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      i === current
                        ? 'w-6 h-[3px] bg-neutral-800'
                        : 'w-[6px] h-[6px] bg-neutral-400'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="px-6 py-10 border-t border-neutral-200">

          {/* EYEBROW */}
          <div className="flex items-center gap-3 mb-6">
            <span className="font-body text-[11px] tracking-[0.2em] text-neutral-400">
              {(current + 1).toString().padStart(2, '0')}
            </span>
            <div className="w-8 h-px bg-neutral-300" />
            <span className="font-body text-[11px] tracking-[0.3em] uppercase text-neutral-400">
              {active.subtitle}
            </span>
          </div>

          {/* TITLE */}
          <h2 className="font-heading text-3xl leading-tight tracking-tight text-neutral-900">
            {active.title}
          </h2>

          <div className="w-8 h-px bg-neutral-900 my-6" />

          {/* DESCRIPTION */}
          <p className="font-body text-sm leading-7 text-neutral-600">
            {active.description}
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link
              href={active.ctaPrimary.href}
              className="font-body font-medium tracking-[0.14em] text-xs uppercase px-6 py-3 bg-black text-white border border-black transition hover:bg-white hover:text-black flex items-center gap-2"
            >
              {active.ctaPrimary.label}
              <ArrowRight size={14} />
            </Link>

            {active.ctaSecondary?.label && (
              <Link
                href={active.ctaSecondary.href}
                className="font-body text-xs tracking-[0.14em] uppercase text-neutral-600 border-b border-transparent hover:border-black hover:text-black pb-1"
              >
                {active.ctaSecondary.label}
              </Link>
            )}
          </div>

          {/* STATS */}
          {active.stats && (
            <div className="mt-8 pt-6 border-t border-neutral-200 flex gap-8 overflow-x-auto no-scrollbar">
              {active.stats.map((s, i) => (
                <div key={i} className="shrink-0">
                  <div className="font-heading text-2xl text-neutral-900">
                    {s.value}
                  </div>
                  <div className="font-body text-[11px] tracking-[0.2em] uppercase text-neutral-500 mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ───────────────────── DESKTOP (>= lg) ───────────────────── */}
      <div className="hidden lg:grid lg:grid-cols-2 min-h-[calc(100vh-80px)]">

        {/* LEFT */}
        <div className="flex flex-col justify-between px-20 py-16 border-r border-neutral-200">

          <div className="flex flex-col justify-center flex-1">

            <div className="flex items-center gap-4 mb-10">
              <span className="font-body text-[11px] tracking-[0.2em] text-neutral-500">
                {(current + 1).toString().padStart(2, '0')}
              </span>
              <div className="w-10 h-px bg-neutral-300" />
              <span className="font-body text-[11px] tracking-[0.35em] uppercase text-neutral-500">
                {active.subtitle}
              </span>
            </div>

            <h2 className="font-heading text-[clamp(2.8rem,5vw,5.5rem)] leading-[1.05] tracking-tight text-neutral-900">
              {active.title}
            </h2>

            <div className="w-10 h-px bg-neutral-900 my-10" />

            <p className="font-body max-w-sm text-sm leading-7 text-neutral-600">
              {active.description}
            </p>

            <div className="mt-12 flex items-center gap-6">
              <Link
                href={active.ctaPrimary.href}
                className="font-body font-medium tracking-[0.14em] text-xs uppercase px-8 py-4 bg-black text-white border border-black transition hover:bg-white hover:text-black flex items-center gap-2"
              >
                {active.ctaPrimary.label}
                <ArrowRight size={16} />
              </Link>

              {active.ctaSecondary?.label && (
                <Link
                  href={active.ctaSecondary.href}
                  className="font-body text-xs tracking-[0.14em] uppercase text-neutral-600 border-b border-transparent hover:border-black hover:text-black pb-1"
                >
                  {active.ctaSecondary.label}
                </Link>
              )}
            </div>
          </div>

          {active.stats && (
            <div className="flex gap-12 pt-12 border-t border-neutral-200">
              {active.stats.map((s, i) => (
                <div key={i}>
                  <div className="font-heading text-3xl text-neutral-900">
                    {s.value}
                  </div>
                  <div className="font-body text-[11px] tracking-[0.2em] uppercase text-neutral-500 mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="relative bg-neutral-50 overflow-hidden">

          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg,#e5e5e5 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-10 will-change-transform"
            >
              <Image
                src={active.image.src}
                alt={active.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-10"
                priority={current === 0}
              />
            </motion.div>
          </AnimatePresence>

          {hasMultiple && (
            <>
              <button
                  type="button"
                aria-label="Next slide"
                title="Next slide"
                onClick={() =>
                  setCurrent((c) => (c - 1 + slides.length) % slides.length)
                }
                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 border border-neutral-200 shadow-md flex items-center justify-center"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                aria-label="Next slide"
                title="Next slide"
                onClick={() => setCurrent((c) => (c + 1) % slides.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 border border-neutral-200 shadow-md flex items-center justify-center"
              >
                <ChevronRight size={20} />
              </button>

              <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-5 bg-gradient-to-t from-white/70 to-transparent">
                <span className="font-body text-[11px] tracking-[0.2em] text-neutral-500 tabular-nums">
                  {(current + 1).toString().padStart(2, '0')} /
                  {slides.length.toString().padStart(2, '0')}
                </span>

                <div className="flex items-center gap-2">
                  {slides.map((_, i) => (
                    <button
                        type="button"
                        aria-label="Previous slide"
                        title="Previous slide"
                      key={i}
                      onClick={() => setCurrent(i)}
                      className="p-2"
                    >
                      <span
                        className={`block rounded-full transition-all duration-300 ${
                          i === current
                            ? 'w-6 h-[3px] bg-neutral-800'
                            : 'w-[6px] h-[6px] bg-neutral-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}