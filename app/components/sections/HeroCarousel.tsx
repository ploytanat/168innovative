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

export default function HeroCarousel({ hero }: HeroCarouselProps) {
  const slides = hero.slides
  const hasMultipleSlides = slides.length > 1

  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  const slideNext = useCallback(() => {
    if (!hasMultipleSlides) return
    setDirection(1)
    setCurrent((i) => (i + 1) % slides.length)
  }, [slides.length, hasMultipleSlides])

  const slidePrev = useCallback(() => {
    if (!hasMultipleSlides) return
    setDirection(-1)
    setCurrent((i) => (i - 1 + slides.length) % slides.length)
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
    <section
      className="relative container mx-auto px-4 py-8 md:py-14 lg:py-18 flex justify-center group"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      <BackgroundBlobs />

      <div
        className="relative w-full max-w-7xl min-h-[620px] sm:min-h-[640px] flex flex-col
        overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem]"
        style={{
          background: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow:
            '0 32px 64px -16px rgba(180,100,120,0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
        }}
      >
        {/* Shimmer */}
        <div
          className="absolute top-0 inset-x-0 h-[1px] z-20"
          style={{
            background:
              'linear-gradient(to right, transparent 10%, rgba(255,255,255,0.9) 40%, rgba(232,196,184,0.8) 60%, transparent 90%)',
          }}
        />

        {/* LCP SAFE BACKGROUND */}
        {isFullBg && (
          <div className="absolute inset-0 z-0">
            <Image
              src={active.image.src}
              alt={active.image.alt}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width:1024px) 100vw, 1280px"
              className="object-cover object-center"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9 }}
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-br from-rose-900/10 to-transparent" />
          </div>
        )}

        {/* CONTENT */}
        <div
          className={`relative z-10 flex-1 flex flex-col lg:grid items-center
          px-6 sm:px-14 lg:px-20 pt-12 pb-24 lg:pb-12 gap-8 lg:gap-12
          ${isFullBg ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}
        >
          {/* Side Image */}
          {!isFullBg && (
            <div className="order-1 lg:order-2 flex justify-center items-center w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`img-${current}`}
                  initial={{ opacity: 0, scale: 0.88, filter: 'blur(8px)' }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                    transition: { duration: 0.65 },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.92,
                    filter: 'blur(4px)',
                    transition: { duration: 0.3 },
                  }}
                  className="relative w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] lg:w-[440px] lg:h-[440px]"
                >
                  <div
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-xl opacity-40"
                    style={{
                      background:
                        'radial-gradient(ellipse, rgba(200,100,120,0.4), transparent)',
                    }}
                  />
                  <Image
                    src={active.image.src}
                    alt={active.image.alt}
                    fill
                    className="object-contain drop-shadow-[0_20px_40px_rgba(200,80,100,0.2)]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* TEXT + CTA */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${current}`}
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              animate={{
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { duration: 0.6 },
              }}
              exit={{
                opacity: 0,
                y: -16,
                filter: 'blur(4px)',
                transition: { duration: 0.3 },
              }}
              className={`flex flex-col order-2 lg:order-1 w-full
              ${
                isFullBg
                  ? 'items-center lg:items-start text-center lg:text-left text-white max-w-xl mx-auto lg:mx-0'
                  : 'items-center lg:items-start text-center lg:text-left'
              }`}
            >
              <span
                className="text-[10px] font-semibold tracking-[0.35em] uppercase px-4 py-1.5 rounded-full w-fit mb-5"
                style={
                  isFullBg
                    ? {
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.25)',
                        color: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(8px)',
                      }
                    : {
                        background: 'rgba(255,220,225,0.5)',
                        border: '1px solid rgba(232,180,190,0.6)',
                        color: '#c07080',
                        backdropFilter: 'blur(8px)',
                      }
                }
              >
                {active.subtitle}
              </span>

              <h1
                className={`text-3xl sm:text-5xl lg:text-[3.8rem] font-black leading-[1.1] tracking-tight ${
                  isFullBg ? 'text-white' : 'text-slate-800'
                }`}
                style={{
                  fontFamily:
                    "'Cormorant Garamond', 'Noto Serif Thai', serif",
                }}
              >
                {active.title}
              </h1>

              <p
                className={`mt-5 text-sm sm:text-lg leading-relaxed max-w-md ${
                  isFullBg ? 'text-white/80' : 'text-slate-500'
                }`}
              >
                {active.description}
              </p>

              <div className="mt-9 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
                <Link
                  href={active.ctaPrimary.href}
                  className="group/btn flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm sm:text-base transition-all active:scale-[0.97] w-full sm:w-auto"
                  style={
                    isFullBg
                      ? {
                          background: 'rgba(255,255,255,0.92)',
                          color: '#374151',
                          boxShadow:
                            '0 4px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1)',
                        }
                      : {
                          background: 'rgba(210,100,120,0.85)',
                          backdropFilter: 'blur(12px)',
                          color: '#fff',
                          boxShadow:
                            '0 4px 24px rgba(210,100,120,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                          border: '1px solid rgba(255,255,255,0.2)',
                        }
                  }
                >
                  <span className="truncate">
                    {active.ctaPrimary.label}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform shrink-0" />
                </Link>

                <Link
                  href={active.ctaSecondary.href}
                  className="flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-sm sm:text-base transition-all active:scale-[0.97] w-full sm:w-auto"
                  style={
                    isFullBg
                      ? {
                          background: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(12px)',
                          border:
                            '1px solid rgba(255,255,255,0.25)',
                          color: 'rgba(255,255,255,0.9)',
                        }
                      : {
                          background: 'rgba(255,255,255,0.65)',
                          backdropFilter: 'blur(12px)',
                          border:
                            '1px solid rgba(212,160,160,0.4)',
                          color: '#b07080',
                        }
                  }
                >
                  <span className="truncate">
                    {active.ctaSecondary.label}
                  </span>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* NAV + DOTS */}
        {hasMultipleSlides && (
          <>
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-30">
              <button
               onClick={slidePrev}
  aria-label="Previous slide"
  title="Previous slide"
                className="pointer-events-auto p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.7)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  color: isFullBg ? '#374151' : '#b07080',
                }}
              >
                <ChevronLeft size={24} strokeWidth={2} />
              </button>

              <button
                onClick={slideNext}
  aria-label="Next slide"
  title="Next slide"
                className="pointer-events-auto p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.7)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  color: isFullBg ? '#374151' : '#b07080',
                }}
              >
                <ChevronRight size={24} strokeWidth={2} />
              </button>
            </div>

            <div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-30 px-5 py-2.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.35)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.5)',
              }}
            >
              {slides.map((_, i) => (
                <button
        
  aria-label="Current slide"
  title="Current slide"
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="relative flex items-center justify-center w-6 sm:w-8 h-1.5 sm:h-2"
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: i === current ? '100%' : '6px',
                      background:
                        i === current
                          ? isFullBg
                            ? 'rgba(255,255,255,0.9)'
                            : '#d4a0a0'
                          : isFullBg
                          ? 'rgba(255,255,255,0.3)'
                          : 'rgba(212,160,160,0.35)',
                    }}
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