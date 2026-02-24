'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
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
    <section className="w-full bg-white border-t border-b border-neutral-200">
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)] "> 

        {/* LEFT SIDE */}
        <div className="flex flex-col justify-between px-8 lg:px-20 py-16 border-r border-neutral-200">

          <div className="flex flex-col justify-center flex-1 ">

            {/* Eyebrow */}
            <div className="flex items-center gap-4 mb-10">
              <span className="text-[11px] tracking-[0.2em] text-neutral-500">
                {(current + 1).toString().padStart(2, '0')}
              </span>
              <div className="w-10 h-px bg-neutral-300" />
              <span className="text-[11px] tracking-[0.35em] uppercase text-neutral-500">
                {active.subtitle}
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-[clamp(3rem,6vw,6rem)] leading-[1] font-light text-neutral-900"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {active.title}
            </h1>

            {/* Rule */}
            <div className="w-10 h-px bg-neutral-900 my-10" />

            {/* Description */}
            <p className="max-w-sm text-sm leading-7 text-neutral-500">
              {active.description}
            </p>

            {/* CTA */}
            <div className="mt-12 flex items-center gap-6">

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

          {/* Bottom stats */}
          <div className="flex gap-12 pt-12 border-t border-neutral-200">
            {active.stats?.map((s, i) => (
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

        </div>

        {/* RIGHT SIDE */}
        <div className="relative bg-neutral-50 flex items-center justify-center overflow-hidden">

          {/* Grid background */}
          <div className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg,#e5e5e5 1px, transparent 1px)',
              backgroundSize: '80px 80px'
            }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 
w-[420px] h-[520px] 
lg:w-[600px] lg:h-[680px]"
            >
              <Image
                src={active.image.src}
                alt={active.image.alt}
                fill
                className="object-contain"
                priority={current === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Slide counter */}
          {hasMultiple && (
            <div className="absolute bottom-16 right-16 flex items-center gap-3 text-[11px] tracking-[0.2em] text-neutral-500">
              <span>{(current + 1).toString().padStart(2, '0')}</span>
              <div className="w-6 h-px bg-neutral-300" />
              <span className="text-neutral-300">
                {slides.length.toString().padStart(2, '0')}
              </span>
            </div>
          )}

          {/* Dots — ใช้ padding เพิ่ม hit area ให้กดง่ายทั้ง desktop และ mobile */}
          {hasMultiple && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex cursor-pointer">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  title={`Go to slide ${i + 1}`}
                  className="group flex items-center justify-center px-2 py-4"
                >
                  <span
                    className={`block h-[2px] rounded-full transition-all duration-300 ${
                      i === current
                        ? 'w-8 bg-black'
                        : 'w-3 bg-neutral-300 group-hover:bg-neutral-500'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  )
}