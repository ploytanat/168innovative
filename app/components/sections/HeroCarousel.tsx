'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { HomeHeroView } from '@/app/lib/types/view'
import BackgroundBlobs from '../ui/BackgroundBlobs'
import { uiText } from '@/app/lib/i18n/ui'
interface HeroCarouselProps {
  hero: HomeHeroView
  locale?: 'th'
}



const SWIPE_THRESHOLD = 50

export default function HeroCarousel({ hero, locale }: HeroCarouselProps) {
  const slides = hero.slides
  const hasMultipleSlides = slides.length > 1

  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  /* ======================
     Slide control
  ====================== */
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

  /* ======================
     Autoplay (client only)
  ====================== */
  useEffect(() => {
    if (!isAutoPlay || !hasMultipleSlides) return
    const id = setInterval(slideNext, 6000)
    return () => clearInterval(id)
  }, [isAutoPlay, slideNext, hasMultipleSlides])

  if (!slides.length) return null

  const active = slides[current]

  /* ======================
     Motion variants
  ====================== */
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '40%' : '-40%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? '40%' : '-40%',
      opacity: 0,
    }),
  }

  return (
    <section
      aria-roledescription="carousel"
      className="relative container mx-auto px-4 py-8 md:py-16 lg:py-20 flex justify-center"
    >
        <BackgroundBlobs />
      <div
        className="relative w-full max-w-7xl min-h-[580px] sm:min-h-[620px]
        overflow-hidden rounded-[2.5rem] md:rounded-[4rem]
        bg-white/60 border border-white backdrop-blur-xl
        shadow-2xl"
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
      >
      
        <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-12 items-center p-8 sm:p-12 lg:p-20">

          {/* ================= IMAGE (Animated only this part) ================= */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                drag={hasMultipleSlides ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                dragMomentum={false}
                onDragStart={() => setIsAutoPlay(false)}
                onDragEnd={(_, info) => {
                  setIsAutoPlay(true)
                  if (info.offset.x < -SWIPE_THRESHOLD) slideNext()
                  else if (info.offset.x > SWIPE_THRESHOLD) slidePrev()
                }}
                className="relative w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] lg:w-[480px] lg:h-[480px]"
              >
                <Image
                  src={active.image.src}
                  alt={active.image.alt}
                  fill
                  sizes="(max-width: 768px) 280px, 500px"
                  priority={current === 0}   // ⭐ LCP
                  loading={current === 0 ? 'eager' : 'lazy'}
                  className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ================= CONTENT (NO animation delay) ================= */}
          <div className="lg:col-span-6 order-2 lg:order-1 z-10
            flex flex-col items-center lg:items-start text-center lg:text-left">

            <span className="text-[10px] sm:text-xs font-bold tracking-[0.4em]
              text-blue-600 mb-4 uppercase bg-blue-50 px-3 py-1 rounded-full">
              {active.subtitle}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl
              font-black text-slate-900 leading-[1.1]">
              {active.title}
            </h1>

            <p className="mt-4 md:mt-6 text-sm sm:text-lg text-slate-600 max-w-md">
              {active.description}
            </p>

            <div className="mt-8 md:mt-10 flex gap-3 sm:gap-4 w-full sm:w-auto
              justify-center lg:justify-start">
              <Link
                href={active.ctaPrimary.href}
                className="flex-1 sm:flex-none bg-slate-900 text-white
                px-6 sm:px-10 py-3.5 sm:py-4 rounded-2xl font-bold
                hover:bg-blue-600 transition active:scale-95 text-center"
              >
                {active.ctaPrimary.label}
              </Link>

              <Link
            href={active.ctaSecondary.href}
            className="flex-1 sm:flex-none border border-slate-200
            bg-white/50 backdrop-blur px-6 sm:px-10 py-3.5 sm:py-4
            rounded-2xl font-bold hover:bg-white transition
            active:scale-95 text-center whitespace-nowrap"
          >
             {active.ctaSecondary.label}
              
          </Link>

            </div>
          </div>
        </div>

        {/* ================= CONTROLS ================= */}
        {hasMultipleSlides && (
          <>
            <button
              aria-label="Previous slide"
              onClick={slidePrev}
              className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2
              p-4 rounded-full bg-white/80 shadow-xl backdrop-blur
              hover:text-blue-600 active:scale-90"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              aria-label="Next slide"
              onClick={slideNext}
              className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2
              p-4 rounded-full bg-white/80 shadow-xl backdrop-blur
              hover:text-blue-600 active:scale-90"
            >
              <ChevronRight size={28} />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1)
                    setCurrent(i)
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === current ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
