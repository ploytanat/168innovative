// components/sections/HeroCarousel.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { HomeHeroView } from '@/app/lib/types/view'

interface HeroCarouselProps {
  hero: HomeHeroView
}

// 👉 ระยะปัดขั้นต่ำ (px)
const SWIPE_THRESHOLD = 80

export default function HeroCarousel({ hero }: HeroCarouselProps) {
  const slides = hero.slides

  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  const slideNext = useCallback(() => {
    setDirection(1)
    setCurrent(prev => (prev + 1) % slides.length)
  }, [slides.length])

  const slidePrev = useCallback(() => {
    setDirection(-1)
    setCurrent(prev => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  // Auto-play
  useEffect(() => {
    if (!isAutoPlay || slides.length <= 1) return
    const timer = setInterval(slideNext, 5000)
    return () => clearInterval(timer)
  }, [slideNext, isAutoPlay, slides.length])

  if (!slides.length) return null

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 120 : -120,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 120 : -120,
      opacity: 0,
    }),
  }

  return (
    <section className="relative w-full py-10 md:py-20 flex flex-col items-center">
      <div
        className="relative w-full max-w-6xl min-h-[420px] sm:min-h-[480px] md:min-h-[600px]
        overflow-hidden rounded-[2.5rem] bg-white/40 border border-white
        backdrop-blur-md shadow-2xl"
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}

            /* ===== SWIPE ===== */
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragStart={() => setIsAutoPlay(false)}
            onDragEnd={(_, info) => {
              const offset = info.offset.x
              if (offset < -SWIPE_THRESHOLD) slideNext()
              else if (offset > SWIPE_THRESHOLD) slidePrev()
              setIsAutoPlay(true)
            }}
            className="absolute inset-0 grid lg:grid-cols-2 items-center
            p-6 sm:p-8 md:p-16 lg:p-20 cursor-grab active:cursor-grabbing"
          >
            {/* Left Content */}
            <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
              <span className="text-xs font-bold tracking-[0.3em] text-blue-600 mb-4 uppercase">
                {slides[current].subtitle}
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                {slides[current].title}
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-500 max-w-md">
                {slides[current].description}
              </p>

              <div className="mt-10 flex gap-4 flex-wrap justify-center lg:justify-start">
                <Link
                  href={slides[current].ctaPrimary.href}
                  className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition"
                >
                  {slides[current].ctaPrimary.label}
                </Link>

                <Link
                  href="/contact"
                  className="border border-slate-200 px-8 py-4 rounded-xl font-bold hover:bg-white transition"
                >
                  ติดต่อเรา →
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="order-1 lg:order-2 relative h-56 sm:h-64 md:h-full w-full flex justify-center items-center">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-full h-full"
              >
                <Image
                  src={slides[current].image.src}
                  alt={slides[current].image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain drop-shadow-2xl"
                />
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Arrow Navigation (Desktop only) */}
        {slides.length > 1 && (
          <>
            <button
              onClick={slidePrev}
              aria-label="Previous slide"
              className="absolute left-6 top-1/2 -translate-y-1/2
              p-3 rounded-full bg-white/50 text-slate-400
              hover:bg-white hover:text-slate-900 transition hidden md:block"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={slideNext}
              aria-label="Next slide"
              className="absolute right-6 top-1/2 -translate-y-1/2
              p-3 rounded-full bg-white/50 text-slate-400
              hover:bg-white hover:text-slate-900 transition hidden md:block"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => {
                setDirection(index > current ? 1 : -1)
                setCurrent(index)
              }}
              className="relative h-3 cursor-pointer"
            >
              <span className="absolute -inset-3" />
              <span
                className={`block h-full rounded-full transition-all duration-300 ${
                  index === current
                    ? 'w-8 bg-slate-900'
                    : 'w-3 bg-slate-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/50 rounded-full blur-[120px] -z-10" />
    </section>
  )
}
