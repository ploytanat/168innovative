'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { GLASS, SECTION_BACKGROUNDS } from '@/app/components/ui/designSystem'
import { HomeHeroView } from '@/app/lib/types/view'

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

// ─── Exact gradient palette (eyedropped from reference image) ─────────────────
//
//   Base wash:          #dde4ec  (cool blue-gray)
//   Center highlight:   #e8edf3  (near-white, brightest point)
//   Top-right blob:     #9fb3cc  (steel blue, fairly saturated)
//   Left mid blob:      #b8c4d8  (muted periwinkle-blue)
//   Pink-lavender orb:  #d4b8cc  (bottom-left, warm violet-pink)
//   Pink core:          #e0c0d4  (hot center of orb)
//
//   UI colors on top:
//   Ink dark:   #1a2232
//   Ink mid:    #3a4a5c
//   Ink soft:   #5a6a7c
//   Border:     rgba(30,40,60,0.18)  — charcoal, low opacity
//   Accent CTA: #3a7bd5 → #2ab8b0

const AUTOPLAY_MS = 6000

// ─── Shared gradient CSS ──────────────────────────────────────────────────────
// Replicate the 4-blob composition from the reference:
//   1. Base: flat #dde4ec
//   2. Top-right: large steel-blue radial
//   3. Center: soft white highlight
//   4. Left: periwinkle blob
//   5. Bottom-left: pink-lavender orb with warm core

export const HERO_BG = SECTION_BACKGROUNDS.hero

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ index, active, duration, onClick }: {
  index: number; active: boolean; duration: number; onClick: () => void
}) {
  return (
    <button
      type="button" onClick={onClick}
      aria-label={`Go to slide ${index + 1}`} aria-pressed={active}
      className="relative h-[3px] flex-1 min-w-[24px] max-w-[80px] overflow-hidden rounded-full"
      style={{ background: 'rgba(30,40,60,0.15)' }}
    >
      {active && (
        <span
          key={index}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: 'linear-gradient(90deg,#3a7bd5,#2ab8b0)', animation: `fillBar ${duration}ms linear forwards` }}
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
          className="relative flex-shrink-0 h-12 w-16 overflow-hidden rounded-lg transition-all duration-300"
          style={{
            border: i === current ? '2px solid rgba(30,40,60,0.50)' : '2px solid rgba(30,40,60,0.18)',
            opacity: i === current ? 1 : 0.45,
          }}
        >
          <Image src={slide.image.src} alt={slide.image.alt} fill sizes="64px" className="object-cover" />
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
        @keyframes slideInR { from{opacity:0;transform:translateX(26px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInL { from{opacity:0;transform:translateX(-26px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .slide-r { animation: slideInR 0.42s cubic-bezier(.22,1,.36,1) both }
        .slide-l { animation: slideInL 0.42s cubic-bezier(.22,1,.36,1) both }
        .fu1 { animation: fadeUp 0.42s 0.05s cubic-bezier(.22,1,.36,1) both }
        .fu2 { animation: fadeUp 0.42s 0.11s cubic-bezier(.22,1,.36,1) both }
        .fu3 { animation: fadeUp 0.42s 0.18s cubic-bezier(.22,1,.36,1) both }
        .fu4 { animation: fadeUp 0.42s 0.26s cubic-bezier(.22,1,.36,1) both }
        .fu5 { animation: fadeUp 0.42s 0.34s cubic-bezier(.22,1,.36,1) both }
      `}</style>

      <section className="relative py-8 lg:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* ── Shell: exact reference gradient ─────────────────────── */}
          <div
            className="relative overflow-hidden rounded-[1.2rem]"
            style={{
              background: HERO_BG,
              border: '1px solid rgba(30,40,60,0.14)',
              boxShadow: '0 2px 0 rgba(255,255,255,0.50) inset, 0 8px 24px rgba(30,40,60,0.08), 0 24px 56px rgba(30,40,60,0.05)',
            }}
          >
            {/* Top shimmer */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.70),transparent)' }} />

            <div className="grid items-stretch lg:grid-cols-[1fr_1.15fr]">

              {/* ── Content panel ── */}
              <div
                className="order-2 flex flex-col justify-between px-7 py-9 sm:px-10 lg:order-1 lg:px-12 lg:py-12"
                style={{
                  borderRight: '1px solid rgba(30,40,60,0.10)',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))',
                }}
              >
                <div>
                  {/* Eyebrow */}
                  <div key={`ey-${animKey}`} className="fu1 mb-6 flex items-center gap-3">
                    <span
                      className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]"
                      style={{
                        ...GLASS.stats,
                        border: '1px solid rgba(30,40,60,0.14)',
                        color: '#3a4a5c',
                      }}
                    >
                      {(safeCurrent + 1).toString().padStart(2, '0')} — {subtitle}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    key={`ti-${animKey}`}
                    className="fu2 font-black leading-[0.93] tracking-[-0.03em] text-[clamp(2.4rem,5.5vw,4.6rem)]"
                    style={{ color: '#1a2232' }}
                  >
                    {active.title}
                  </h2>

                  {/* Accent divider */}
                  <div key={`di-${animKey}`} className="fu3 my-6 h-[3px] w-12 rounded-full lg:my-7"
                    style={{ background: 'linear-gradient(90deg,#3a7bd5,#2ab8b0)' }} />

                  {/* Description */}
                  <p key={`de-${animKey}`} className="fu3 max-w-md text-[0.95rem] leading-[1.85]"
                    style={{ color: '#3a4a5c' }}>
                    {active.description}
                  </p>

                  {/* CTAs */}
                  <div key={`ct-${animKey}`} className="fu4 mt-8 flex flex-wrap items-center gap-3 lg:mt-9">
                    <Link
                      href={active.ctaPrimary.href}
                      className="group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[11.5px] font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg,#3a7bd5,#2ab8b0)', boxShadow: '0 4px 16px rgba(58,123,213,0.28)' }}
                    >
                      {active.ctaPrimary.label}
                      <span className="transition-transform group-hover:translate-x-1"><ArrowRight /></span>
                    </Link>

                    {active.ctaSecondary?.label && (
                      <Link
                        href={active.ctaSecondary.href}
                        className="inline-flex items-center gap-1.5 rounded-xl px-5 py-3 text-[11.5px] font-bold uppercase tracking-[0.12em] transition-colors"
                        style={{
                          ...GLASS.card,
                          border: '1px solid rgba(30,40,60,0.16)',
                          color: '#1a2232',
                        }}
                      >
                        {active.ctaSecondary.label}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Stats */}
                {active.stats?.length ? (
                  <div
                    key={`st-${animKey}`}
                    className="fu5 mt-8 grid grid-cols-2 gap-4 border-t pt-6 sm:grid-cols-3 lg:mt-10"
                    style={{ borderColor: 'rgba(30,40,60,0.10)' }}
                  >
                    {active.stats.map((stat, i) => (
                      <div key={i}>
                        <div className="font-black text-2xl leading-none tracking-tight" style={{ color: '#1a2232' }}>{stat.value}</div>
                        <div className="mt-1.5 text-[10.5px] uppercase tracking-[0.16em]" style={{ color: '#5a6a7c' }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Navigation */}
                {hasMultiple && (
                  <div className="mt-8 flex items-center gap-4 lg:mt-10">
                    <span className="text-[11px] font-semibold tabular-nums" style={{ color: '#5a6a7c' }}>
                      {(safeCurrent + 1).toString().padStart(2, '0')}
                      <span className="mx-1 opacity-40">/</span>
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
                  </div>
                )}
              </div>

              {/* ── Image panel: same gradient, no separate background ── */}
              <div className="order-1 relative lg:order-2">
                <div
                  className="relative overflow-hidden"
                  style={{
                    background: `
                      radial-gradient(circle at 92% 4%, rgba(114,148,198,0.30) 0%, transparent 28%),
                      radial-gradient(circle at 12% 78%, rgba(243,204,163,0.18) 0%, transparent 22%),
                      radial-gradient(circle at 24% 34%, rgba(190,209,229,0.22) 0%, transparent 24%),
                      linear-gradient(160deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02)),
                      linear-gradient(160deg, #e9f0f6 0%, #f3efe9 100%)
                    `.trim().replace(/\n\s+/g, ' '),
                    minHeight: 'clamp(260px,42vw,600px)',
                    borderBottom: '1px solid rgba(30,40,60,0.08)',
                  }}
                >
                  {/* Slide image */}
                  <div
                    key={`img-${animKey}`}
                    className={`absolute inset-0 p-6 sm:p-8 lg:p-10 ${animDir === 'right' ? 'slide-r' : 'slide-l'}`}
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={active.image.src} alt={active.image.alt}
                        fill priority sizes="(max-width:1024px) 100vw, 55vw"
                        className="object-contain"
                        style={{ filter: 'drop-shadow(0 8px 24px rgba(30,40,60,0.12))' }}
                      />
                    </div>
                  </div>

                  {/* Prev / Next buttons — left and right edges of image panel */}
                  {hasMultiple && (
                    <>
                      <button
                        type="button"
                        aria-label="Previous slide"
                        onClick={previous}
                        className="absolute left-4 top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl transition-colors"
                        style={{
                          ...GLASS.card,
                          border: '1px solid rgba(30,40,60,0.16)',
                          color: '#3a4a5c',
                        }}
                      >
                        <ChevronLeft />
                      </button>
                      <button
                        type="button"
                        aria-label="Next slide"
                        onClick={advance}
                        className="absolute right-4 top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl transition-colors"
                        style={{
                          ...GLASS.card,
                          border: '1px solid rgba(30,40,60,0.16)',
                          color: '#3a4a5c',
                        }}
                      >
                        <ChevronRight />
                      </button>
                    </>
                  )}

                  {/* Slide counter badge */}
                  {hasMultiple && (
                    <div
                      className="absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em]"
                      style={{
                        ...GLASS.card,
                        border: '1px solid rgba(30,40,60,0.14)',
                        color: '#3a4a5c',
                      }}
                    >
                      {(safeCurrent + 1).toString().padStart(2, '0')} / {total.toString().padStart(2, '0')}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}