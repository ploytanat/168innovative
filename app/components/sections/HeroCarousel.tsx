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

const SWIPE_THRESHOLD = 50 // ปรับให้ไวขึ้นสำหรับมือถือ

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

  useEffect(() => {
    if (!isAutoPlay || slides.length <= 1) return
    const timer = setInterval(slideNext, 6000) // เพิ่มเวลาให้นานขึ้นเล็กน้อยเพื่อให้อ่านทัน
    return () => clearInterval(timer)
  }, [slideNext, isAutoPlay, slides.length])

  if (!slides.length) return null

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "50%" : "-50%", // ใช้ % เพื่อความสมูทในทุกจอ
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "50%" : "-50%",
      opacity: 0,
    }),
  }

  return (
    <section className="relative w-full px-4 py-8 md:py-16 lg:py-20 flex flex-col items-center">
      <div
        className="relative w-full max-w-7xl min-h-[580px] sm:min-h-[620px] lg:min-h-[600px]
        overflow-hidden rounded-[2.5rem] md:rounded-[4rem] bg-white/40 border border-white/60
        backdrop-blur-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]"
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
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}

            /* ===== SWIPE OPTIMIZED ===== */
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              const offset = info.offset.x
              const velocity = info.velocity.x
              if (offset < -SWIPE_THRESHOLD || velocity < -500) slideNext()
              else if (offset > SWIPE_THRESHOLD || velocity > 500) slidePrev()
            }}
            className="absolute inset-0 grid grid-cols-1 lg:grid-cols-12 items-center
            p-8 sm:p-12 lg:p-20 cursor-grab active:cursor-grabbing"
          >
            {/* Right Image (Top on Mobile) */}
            <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center items-center mb-8 lg:mb-0">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] lg:w-[480px] lg:h-[480px]"
              >
                <Image
                  src={slides[current].image.src}
                  alt={slides[current].image.alt}
                  fill
                  priority
                  sizes="(max-width: 768px) 280px, 500px"
                  className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
                />
              </motion.div>
            </div>

            {/* Left Content */}
            <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] sm:text-xs font-bold tracking-[0.4em] text-blue-600 mb-4 uppercase bg-blue-50 px-3 py-1 rounded-full"
              >
                {slides[current].subtitle}
              </motion.span>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1]"
              >
                {slides[current].title}
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 md:mt-6 text-sm sm:text-lg text-slate-600 max-w-[280px] sm:max-w-md"
              >
                {slides[current].description}
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 md:mt-10 flex flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center lg:justify-start"
              >
                <Link
                  href={slides[current].ctaPrimary.href}
                  className="flex-1 sm:flex-none bg-slate-900 text-white px-6 sm:px-10 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-bold hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-slate-900/20 active:scale-95 text-center"
                >
                  {slides[current].ctaPrimary.label}
                </Link>

                <Link
                  href="/contact"
                  className="flex-1 sm:flex-none border border-slate-200 bg-white/50 backdrop-blur px-6 sm:px-10 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-bold hover:bg-white transition-all duration-300 active:scale-95 text-center whitespace-nowrap"
                >
                  ติดต่อเรา →
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Arrow Navigation (Hidden on Mobile) */}
        {slides.length > 1 && (
          <div className="hidden lg:block">
            <button
              onClick={slidePrev}
              className="absolute left-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/80 text-slate-400 hover:bg-white hover:text-blue-600 transition-all shadow-xl backdrop-blur-sm z-30 active:scale-90"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              onClick={slideNext}
              className="absolute right-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/80 text-slate-400 hover:bg-white hover:text-blue-600 transition-all shadow-xl backdrop-blur-sm z-30 active:scale-90"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        )}

        {/* Pagination Dots (Optimized for Mobile) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > current ? 1 : -1)
                setCurrent(index)
              }}
              className="group relative p-2"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-500 ${
                  index === current ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300 group-hover:bg-slate-400'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Background Blobs (Adaptive) */}
      <div className="absolute top-0 left-1/2 -translate-x-full w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-100/40 rounded-full blur-[80px] md:blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/2 translate-x-full w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-cyan-100/40 rounded-full blur-[80px] md:blur-[100px] -z-10" />
    </section>
  )
}