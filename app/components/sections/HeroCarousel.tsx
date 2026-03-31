'use client'

import { useEffect, useRef, useState } from 'react'

import type { HomeHeroView } from '@/app/lib/types/view'
import HeroSlide from './hero/HeroSlide'
import { HERO_THEMES } from './hero/heroThemes'

const AUTOPLAY_MS = 5500

const ChevronLeft = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRight = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export default function HeroCarousel({ hero }: { hero: HomeHeroView }) {
  const slides = hero.slides ?? []
  const total = slides.length

  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartRef = useRef<number | null>(null)

  useEffect(() => {
    if (total <= 1 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = window.setInterval(() => {
      setCurrent((value) => (value + 1) % total)
    }, AUTOPLAY_MS)

    return () => window.clearInterval(id)
  }, [paused, total])

  useEffect(() => {
    if (total <= 1) return

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setCurrent((value) => (value + 1) % total)
      }

      if (event.key === 'ArrowLeft') {
        setCurrent((value) => (value - 1 + total) % total)
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [total])

  if (total === 0) return null

  const activeTheme = HERO_THEMES[slides[current]?.theme ?? 'rose']

  const goTo = (nextIndex: number) => {
    setCurrent((nextIndex + total) % total)
  }

  return (
    <>
      <style>{`
        @keyframes heroBlobDrift {
          from { transform: translate3d(0, 0, 0) scale(1); }
          to { transform: translate3d(16px, 12px, 0) scale(1.06); }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeSide {
          from { opacity: 0; transform: translateX(28px) scale(0.97); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes heroProgress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>

      <section
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(event) => {
          touchStartRef.current = event.touches[0]?.clientX ?? null
        }}
        onTouchEnd={(event) => {
          const startX = touchStartRef.current
          const endX = event.changedTouches[0]?.clientX

          if (startX == null || endX == null) return

          const delta = endX - startX
          if (Math.abs(delta) < 50) return

          if (delta < 0) goTo(current + 1)
          if (delta > 0) goTo(current - 1)
        }}
        style={{ touchAction: 'pan-y' }}
      >
        <div className="relative min-h-[100svh]">
          <div
            className="flex min-h-[100svh] will-change-transform transition-transform duration-[850ms] ease-[cubic-bezier(.77,0,.175,1)]"
            style={{
              width: `${total * 100}%`,
              transform: `translate3d(-${(100 / total) * current}%, 0, 0)`,
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="relative min-h-[100svh] shrink-0 overflow-hidden"
                style={{ width: `${100 / total}%` }}
                aria-hidden={index !== current}
              >
                <HeroSlide
                  slide={slide}
                  index={index}
                  isActive={index === current}
                />
              </div>
            ))}
          </div>

          {total > 1 && (
            <>
              <button
                type="button"
                aria-label="สไลด์ก่อนหน้า"
                onClick={() => goTo(current - 1)}
                className="absolute left-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border bg-white/90 text-slate-600 shadow-[0_10px_30px_rgba(46,40,32,0.12)] transition hover:-translate-y-[calc(50%+3px)] hover:text-slate-900 md:left-5"
                style={{ borderColor: 'rgba(180,150,140,.15)' }}
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                aria-label="สไลด์ถัดไป"
                onClick={() => goTo(current + 1)}
                className="absolute right-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border bg-white/90 text-slate-600 shadow-[0_10px_30px_rgba(46,40,32,0.12)] transition hover:-translate-y-[calc(50%+3px)] hover:text-slate-900 md:right-5"
                style={{ borderColor: 'rgba(180,150,140,.15)' }}
              >
                <ChevronRight />
              </button>

              <div className="absolute right-5 top-24 z-20 text-xs font-semibold tracking-[0.12em] text-slate-400 md:right-10">
                <span className="text-slate-800">{String(current + 1).padStart(2, '0')}</span>
                <span className="mx-1.5">/</span>
                <span>{String(total).padStart(2, '0')}</span>
              </div>

              <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                {slides.map((slide, index) => {
                  const dotTheme = HERO_THEMES[slide.theme]
                  const active = index === current

                  return (
                    <button
                      key={slide.id}
                      type="button"
                      aria-label={`ไปสไลด์ ${index + 1}`}
                      onClick={() => goTo(index)}
                      className="relative h-2 overflow-hidden rounded-full transition-all duration-300"
                      style={{
                        width: active ? 28 : 8,
                        background: active ? 'rgba(255,255,255,0.42)' : 'rgba(110,101,88,.38)',
                      }}
                    >
                      {active && (
                        <span
                          className="absolute inset-0 origin-left rounded-full"
                          style={{
                            background: dotTheme.accentSolid,
                            animation: paused ? 'none' : `heroProgress ${AUTOPLAY_MS}ms linear forwards`,
                          }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="absolute inset-x-0 bottom-0 z-20 h-[3px] bg-black/5">
                <div
                  className="h-full origin-left transition-colors duration-500"
                  style={{
                    width: `${((current + 1) / total) * 100}%`,
                    background: activeTheme.accentSolid,
                  }}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
