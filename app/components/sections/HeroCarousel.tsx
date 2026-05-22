'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { HomeHeroView } from '@/app/lib/types/view'
import { CONTAINER, DISPLAY_HEADING, HOME } from './home-theme'

// ─── Icons ────────────────────────────────────────────────────────────────────

const ChevronLeft = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 19l-7-7 7-7" />
  </svg>
)
const ChevronRight = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
  </svg>
)
const ArrowRight = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
)

const AUTOPLAY_MS = 6500

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ index, active, duration, onClick }: {
  index: number; active: boolean; duration: number; onClick: () => void
}) {
  return (
    <button
      type="button" onClick={onClick}
      aria-label={`Go to slide ${index + 1}`} aria-pressed={active}
      className="relative h-[3px] flex-1 min-w-[22px] max-w-[64px] overflow-hidden rounded-full"
      style={{ background: 'rgba(26,28,32,0.12)' }}
    >
      {active && (
        <span
          key={index}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: HOME.accent, animation: `fillBar ${duration}ms linear forwards` }}
        />
      )}
    </button>
  )
}

// ─── Thumbnail Strip (≥5 slides) ─────────────────────────────────────────────

function ThumbnailStrip({ slides, current, onJump }: {
  slides: HomeHeroView['slides']; current: number; onJump: (i: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current?.children[current] as HTMLElement
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [current])

  return (
    <div ref={ref} className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {slides.map((slide, i) => (
        <button
          key={slide.id} type="button" onClick={() => onJump(i)}
          aria-label={`Go to slide ${i + 1}`}
          className="relative flex-shrink-0 h-11 w-14 overflow-hidden rounded-lg transition-all duration-300"
          style={{
            border: i === current ? `2px solid ${HOME.accent}` : `1px solid ${HOME.line}`,
            opacity: i === current ? 1 : 0.5,
          }}
        >
          <Image src={slide.image.src} alt={slide.image.alt} fill sizes="56px" className="object-cover" />
        </button>
      ))}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface Props { hero: HomeHeroView }

export default function HeroCarousel({ hero }: Props) {
  const slides = hero.slides ?? []
  const [current, setCurrent] = useState(0)
  const [animDir, setAnimDir] = useState<'left' | 'right'>('right')
  const [animKey, setAnimKey] = useState(0)
  const total = slides.length
  const hasMultiple = total > 1
  const safeCurrent = current < total ? current : 0
  const active = slides[safeCurrent]
  const useThumbnails = total >= 5

  const go = (index: number, dir: 'left' | 'right') => {
    setAnimDir(dir); setAnimKey(k => k + 1); setCurrent(index)
  }
  const advance  = () => { if (!total) return; go((safeCurrent + 1) % total, 'right') }
  const previous = () => { if (!total) return; go((safeCurrent - 1 + total) % total, 'left') }
  const jumpTo   = (i: number) => go(i, i > safeCurrent ? 'right' : 'left')

  useEffect(() => {
    if (!hasMultiple) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(advance, AUTOPLAY_MS)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMultiple, safeCurrent, total])

  if (!active) return null

  const subtitle = active.subtitle || 'Featured'

  return (
    <>
      <style>{`
        @keyframes fillBar  { from{width:0%} to{width:100%} }
        @keyframes slideInR { from{opacity:0;transform:translateX(22px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInL { from{opacity:0;transform:translateX(-22px)} to{opacity:1;transform:translateX(0)} }
        @keyframes heroUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .slide-r { animation: slideInR 0.5s cubic-bezier(.22,1,.36,1) both }
        .slide-l { animation: slideInL 0.5s cubic-bezier(.22,1,.36,1) both }
        .fu1 { animation: heroUp 0.5s 0.04s cubic-bezier(.22,1,.36,1) both }
        .fu2 { animation: heroUp 0.5s 0.10s cubic-bezier(.22,1,.36,1) both }
        .fu3 { animation: heroUp 0.5s 0.17s cubic-bezier(.22,1,.36,1) both }
        .fu4 { animation: heroUp 0.5s 0.24s cubic-bezier(.22,1,.36,1) both }
        .fu5 { animation: heroUp 0.5s 0.31s cubic-bezier(.22,1,.36,1) both }
      `}</style>

      <section className="relative" style={{ background: HOME.paper }}>
        <div className={`${CONTAINER} py-12 sm:py-16 lg:py-20`}>
          <div className="grid items-center gap-9 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">

            {/* ── Content ───────────────────────────────────────────── */}
            <div className="order-2 lg:order-1">
              {/* Eyebrow */}
              <div key={`ey-${animKey}`} className="fu1 flex items-center gap-3">
                <span className="h-px w-9" style={{ background: HOME.accent }} />
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: HOME.accent }}
                >
                  {(safeCurrent + 1).toString().padStart(2, '0')} — {subtitle}
                </span>
              </div>

              {/* Title */}
              <h2
                key={`ti-${animKey}`}
                className={`fu2 mt-5 ${DISPLAY_HEADING} font-bold text-[clamp(2.15rem,1.3rem+3vw,3.55rem)]`}
                style={{ color: HOME.ink }}
              >
                {active.title}
              </h2>

              {/* Description */}
              <p
                key={`de-${animKey}`}
                className="fu3 mt-5 max-w-xl text-[1rem] leading-[1.85] sm:text-[1.06rem]"
                style={{ color: HOME.inkMid }}
              >
                {active.description}
              </p>

              {/* CTAs */}
              <div key={`ct-${animKey}`} className="fu4 mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={active.ctaPrimary.href}
                  className="home-btn home-btn-accent group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[13px] font-semibold"
                >
                  {active.ctaPrimary.label}
                  <span className="transition-transform group-hover:translate-x-0.5"><ArrowRight /></span>
                </Link>

                {active.ctaSecondary?.label && (
                  <Link
                    href={active.ctaSecondary.href}
                    className="home-btn home-btn-outline inline-flex items-center gap-1.5 rounded-full px-6 py-3.5 text-[13px] font-semibold"
                  >
                    {active.ctaSecondary.label}
                  </Link>
                )}
              </div>

              {/* Stats (optional) */}
              {active.stats?.length ? (
                <div
                  key={`st-${animKey}`}
                  className="fu5 mt-9 grid grid-cols-2 gap-x-6 gap-y-5 border-t pt-6 sm:grid-cols-3"
                  style={{ borderColor: HOME.line }}
                >
                  {active.stats.map((stat, i) => (
                    <div key={i}>
                      <div className="text-[1.6rem] font-bold leading-none" style={{ color: HOME.ink }}>
                        {stat.value}
                      </div>
                      <div className="mt-2 text-[11px] uppercase tracking-[0.14em]" style={{ color: HOME.inkSoft }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Navigation */}
              {hasMultiple && (
                <div className="mt-9 flex items-center gap-4">
                  <span className="text-[12px] font-semibold tabular-nums" style={{ color: HOME.inkSoft }}>
                    {(safeCurrent + 1).toString().padStart(2, '0')}
                    <span className="mx-1 opacity-50">/</span>
                    {total.toString().padStart(2, '0')}
                  </span>

                  {useThumbnails ? (
                    <div className="flex-1 overflow-hidden">
                      <ThumbnailStrip slides={slides} current={safeCurrent} onJump={jumpTo} />
                    </div>
                  ) : (
                    <div className="flex flex-1 items-center gap-1.5">
                      {slides.map((slide, i) => (
                        <ProgressBar key={slide.id} index={i} active={i === safeCurrent}
                          duration={AUTOPLAY_MS} onClick={() => jumpTo(i)} />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button" aria-label="Previous slide" onClick={previous}
                      className="home-btn home-btn-outline inline-flex h-9 w-9 items-center justify-center rounded-full"
                    >
                      <ChevronLeft />
                    </button>
                    <button
                      type="button" aria-label="Next slide" onClick={advance}
                      className="home-btn home-btn-outline inline-flex h-9 w-9 items-center justify-center rounded-full"
                    >
                      <ChevronRight />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Image ─────────────────────────────────────────────── */}
            <div className="order-1 lg:order-2">
              <div
                className="relative overflow-hidden rounded-[1.5rem]"
                style={{
                  border: `1px solid ${HOME.line}`,
                  background: `radial-gradient(circle at 78% 14%, ${HOME.accentTint} 0%, transparent 55%), linear-gradient(160deg, #ffffff 0%, ${HOME.paperDeep} 100%)`,
                }}
              >
                <div
                  key={`img-${animKey}`}
                  className={`relative ${animDir === 'right' ? 'slide-r' : 'slide-l'}`}
                  style={{ minHeight: 'clamp(280px,40vw,500px)' }}
                >
                  <Image
                    src={active.image.src} alt={active.image.alt}
                    fill priority sizes="(max-width:1024px) 100vw, 48vw"
                    className="object-contain p-6 sm:p-9"
                    style={{ filter: 'drop-shadow(0 16px 32px rgba(20,22,28,0.16))' }}
                  />
                </div>

                {/* Slide counter */}
                {hasMultiple && (
                  <div
                    className="absolute right-4 top-4 rounded-full px-3 py-1.5 text-[11px] font-semibold tabular-nums"
                    style={{ background: 'rgba(255,255,255,0.86)', border: `1px solid ${HOME.line}`, color: HOME.inkMid }}
                  >
                    {(safeCurrent + 1).toString().padStart(2, '0')} / {total.toString().padStart(2, '0')}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
