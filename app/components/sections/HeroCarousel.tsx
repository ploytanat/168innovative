'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { HomeHeroView } from '@/app/lib/types/view'
import BackgroundBlobs from '../ui/BackgroundBlobs'

interface HeroCarouselProps {
  hero: HomeHeroView
  locale?: 'th'
}

const SWIPE_THRESHOLD = 50

export default function HeroCarousel({ hero }: HeroCarouselProps) {
  const slides = hero.slides
  const hasMultipleSlides = slides.length > 1

  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  const slideNext = useCallback(() => {
    if (!hasMultipleSlides) return
    setDirection(1)
    setCurrent(i => (i + 1) % slides.length)
  }, [slides.length, hasMultipleSlides])

  const slidePrev = useCallback(() => {
    if (!hasMultipleSlides) return
    setDirection(-1)
    setCurrent(i => (i - 1 + slides.length) % slides.length)
  }, [slides.length, hasMultipleSlides])

  useEffect(() => {
    if (!isAutoPlay || !hasMultipleSlides) return
    const id = setInterval(slideNext, 6000)
    return () => clearInterval(id)
  }, [isAutoPlay, slideNext, hasMultipleSlides])

  if (!slides.length) return null

  const active = slides[current]

  const isFullBg = current === 0

  return (
    <section className="relative container mx-auto px-4 py-8 md:py-16 lg:py-20 flex justify-center group">
      <BackgroundBlobs />

      <div
        className="relative w-full max-w-7xl min-h-[600px] sm:min-h-[650px]
        overflow-hidden rounded-[2.5rem] md:rounded-[4rem]
        bg-white/60 border border-white backdrop-blur-xl
        shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-700"
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
      >

        {/* --- Background Layer (Full BG Slide) --- */}
        <AnimatePresence initial={false}>
          {isFullBg && (
            <motion.div
              key={`bg-${current}`}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0 z-0"
            >
              <Image
                src={active.image.src}
                alt={active.image.alt}
                fill
                priority={current === 0}
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/20 to-transparent md:from-black/50" />
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`absolute inset-0 grid items-center p-8 sm:p-12 lg:p-24 z-10
          ${isFullBg ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'}`}
        >

          {/* --- Side Image (Split Layout Slide) --- */}
          {!isFullBg && (
            <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-[280px] h-[280px] lg:w-[500px] lg:h-[500px]"
                >
                  <Image
                    src={active.image.src}
                    alt={active.image.alt}
                    fill
                    className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* --- Content Area --- */}
          <div
           className={`flex flex-col z-10 transition-all duration-500
  ${isFullBg
    ? 'items-center lg:items-start text-center lg:text-left text-white max-w-2xl'
    : 'lg:col-span-6 text-slate-900 items-center lg:items-start text-center lg:text-left'
  }`}
>
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-[11px] font-bold tracking-[0.3em] mb-6 uppercase px-4 py-1.5 rounded-full border
              ${isFullBg
                ? 'bg-white/10 border-white/20 text-white backdrop-blur-md'
                : 'bg-blue-50 border-blue-100 text-blue-600'
              }`}
            >
              {active.subtitle}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight"
            >
              {active.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`mt-6 text-lg sm:text-xl leading-relaxed max-w-lg opacity-90
              ${isFullBg ? 'text-slate-100' : 'text-slate-600'}`}
            >
              {active.description}
            </motion.p>

           <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    // แก้ไขตรงนี้: ใช้ flex-row และ gap-2 สำหรับมือถือ
    className="mt-10 flex flex-row items-center justify-center lg:justify-start gap-2 sm:gap-4 w-full sm:w-auto"
  >
    {/* First Button (Primary) */}
    <Link
      href={active.ctaPrimary.href}
      className={`group/btn flex flex-row items-center justify-center gap-2 
      px-5 py-3.5 sm:px-8 sm:py-4 rounded-2xl font-bold 
      text-sm sm:text-lg transition-all active:scale-[0.98] shadow-lg flex-1 sm:flex-none
      ${isFullBg
        ? 'bg-white text-slate-900 hover:bg-blue-50 hover:shadow-white/20'
        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200'
      }`}
    >
      <span className="truncate">{active.ctaPrimary.label}</span>
      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform shrink-0" />
    </Link>

    {/* Second Button (Secondary) */}
    <Link
      href={active.ctaSecondary.href}
      className={`flex items-center justify-center 
      px-5 py-3.5 sm:px-8 sm:py-4 rounded-2xl font-bold 
      text-sm sm:text-lg border transition-all active:scale-[0.98] flex-1 sm:flex-none
      ${isFullBg
        ? 'border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md'
        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
      }`}
    >
      <span className="truncate">{active.ctaSecondary.label}</span>
    </Link>
  </motion.div>
        </div>
</div>
        {/* --- Navigation Controls --- */}
        {hasMultipleSlides && (
          <>
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center pointer-events-none z-30">
              <button
                onClick={slidePrev}
                aria-label="Previous slide"
                title="Previous slide"
                className={`group pointer-events-auto cursor-pointer p-4 rounded-2xl transition-all duration-300 active:scale-90
                ${isFullBg ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/80 hover:bg-white text-slate-900 shadow-lg'}
                opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 backdrop-blur-md`}
              >
                <ChevronLeft size={32} strokeWidth={2.5} />
              </button>

              <button
                onClick={slideNext}
                aria-label="Next slide"
                title="Next slide"
                className={`group pointer-events-auto cursor-pointer p-4  rounded-2xl transition-all duration-300 active:scale-90
                ${isFullBg ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/80 hover:bg-white text-slate-900 shadow-lg'}
                opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 backdrop-blur-md`}
              >
                <ChevronRight size={32} strokeWidth={2.5} />
              </button>
            </div>

            {/* --- Pagination Dots --- */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30 bg-black/5 hover:bg-black/10 px-4 py-2.5 rounded-full backdrop-blur-sm transition-colors">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1)
                    setCurrent(i)
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                  title={`Go to slide ${i + 1}`}
                  className="relative flex items-center justify-center w-8 h-2 group"
                >
                  <div
                    className={`h-full rounded-full transition-all duration-300 
                    ${i === current
                      ? (isFullBg
                        ? 'w-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)] cursor-pointer' 
                        : 'w-full bg-blue-600 cursor-pointer')
                      : (isFullBg
                        ? 'w-2 bg-white/30 group-hover:bg-white/50 cursor-pointer'
                        : 'w-2 bg-slate-300 group-hover:bg-slate-400 cursor-pointer')
                    }`}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
