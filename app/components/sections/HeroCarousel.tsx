'use client'

import Image from 'next/image'
import { useEffect, useEffectEvent, useState } from 'react'
import Link from 'next/link'
import { HomeHeroView } from '@/app/lib/types/view'

// Replace lucide icons with inline SVG
const ChevronLeft = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRight = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const ArrowRight = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
)

const AUTOPLAY_MS = 6000

interface Props {
  hero: HomeHeroView
}

export default function HeroCarousel({ hero }: Props) {
  const slides = hero.slides ?? []
  const [current, setCurrent] = useState(0)
  const hasMultiple = slides.length > 1
  const safeCurrent = current < slides.length ? current : 0
  const active = slides[safeCurrent]

  const next = useEffectEvent(() => {
    setCurrent((c) => (c + 1) % slides.length)
  })

  useEffect(() => {
    if (!hasMultiple) return

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (motionPreference.matches) return

    const id = window.setInterval(() => {
      next()
    }, AUTOPLAY_MS)

    return () => window.clearInterval(id)
  }, [hasMultiple, slides.length])

  if (!active) return null

  return (
    <section className="w-full overflow-hidden border-y border-[rgba(205,222,241,0.72)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(241,251,255,0.82)_46%,rgba(242,247,255,0.78))]">

      {/* ───────────────────── MOBILE (< lg) ───────────────────── */}
      <div className="flex flex-col lg:hidden">

        {/* IMAGE */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-[linear-gradient(145deg,#eefbff,#f3f8ff)]">
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg,#e5e5e5 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* CSS-based crossfade instead of Framer Motion */}
          <div className="absolute inset-0 flex items-center justify-center p-8 transition-opacity duration-300">
            <div className="relative w-full h-full">
              <Image
                src={active.image.src}
                alt={active.image.alt}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>

          {/* ARROWS */}
          {hasMultiple && (
            <>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() =>
                  setCurrent((c) => (c - 1 + slides.length) % slides.length)
                }
                className="liquid-glass-pill absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full transition hover:bg-white"
              >
                <ChevronLeft />
              </button>

              <button
                type="button"
                aria-label="Next slide"
                onClick={() => setCurrent((c) => (c + 1) % slides.length)}
                className="liquid-glass-pill absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full transition hover:bg-white"
              >
                <ChevronRight />
              </button>
            </>
          )}

          {/* DOTS */}
          {hasMultiple && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="p-2 transition-all duration-300"
                  aria-label={`Go to slide ${i + 1}`}
                  aria-pressed={i === safeCurrent}
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      i === safeCurrent
                        ? 'h-[3px] w-6 bg-[linear-gradient(90deg,#2ecfc4,#9ddcf6)]'
                        : 'h-[6px] w-[6px] bg-[#b9c4de]'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="border-t border-[rgba(205,222,241,0.72)] px-6 py-10">

          {/* EYEBROW */}
          <div className="flex items-center gap-3 mb-6">
              <span className="font-body text-[12px] tracking-[0.16em] text-[#6f8099]">
              {(safeCurrent + 1).toString().padStart(2, '0')}
            </span>
            <div className="h-px w-8 bg-[#c9d7ea]" />
            <span className="font-body text-[12px] uppercase tracking-[0.22em] text-[#6f8099]">
              {active.subtitle}
            </span>
          </div>

          {/* TITLE */}
          <h2 className="font-heading text-3xl leading-tight tracking-tight text-[var(--color-ink)]">
            {active.title}
          </h2>

          <div className="my-6 h-px w-10 bg-[linear-gradient(90deg,#2ecfc4,#9ddcf6)]" />

          {/* DESCRIPTION */}
          <p className="font-body text-base leading-8 text-[var(--color-ink-soft)]">
            {active.description}
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link
              href={active.ctaPrimary.href}
              className="flex items-center gap-2 border border-transparent bg-[linear-gradient(135deg,#2ecfc4,#8ebcf5)] px-6 py-3 font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_14px_32px_rgba(46,207,196,0.24)] transition hover:brightness-105"
            >
              {active.ctaPrimary.label}
              <ArrowRight />
            </Link>

            {active.ctaSecondary?.label && (
              <Link
                href={active.ctaSecondary.href}
                className="border-b border-transparent pb-1 font-body text-[13px] uppercase tracking-[0.1em] text-[#596b87] hover:border-[#8ebcf5] hover:text-[var(--color-ink)]"
              >
                {active.ctaSecondary.label}
              </Link>
            )}
          </div>

          {/* STATS */}
          {active.stats && (
            <div className="mt-8 flex gap-8 overflow-x-auto border-t border-[rgba(205,222,241,0.72)] pt-6 no-scrollbar">
              {active.stats.map((s, i) => (
                <div key={i} className="shrink-0">
                  <div className="font-heading text-2xl text-[var(--color-ink)]">
                    {s.value}
                  </div>
                  <div className="mt-1 font-body text-[12px] uppercase tracking-[0.16em] text-[#6f8099]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ───────────────────── DESKTOP (>= lg) ───────────────────── */}
        <div className="hidden min-h-[calc(100vh-80px)] lg:grid lg:grid-cols-2">

        {/* LEFT */}
        <div className="flex flex-col justify-between border-r border-[rgba(205,222,241,0.72)] px-20 py-16">

          <div className="flex flex-col justify-center flex-1">

            <div className="flex items-center gap-4 mb-10">
              <span className="font-body text-[12px] tracking-[0.16em] text-[#6f8099]">
                {(safeCurrent + 1).toString().padStart(2, '0')}
              </span>
              <div className="h-px w-10 bg-[#c9d7ea]" />
              <span className="font-body text-[12px] uppercase tracking-[0.24em] text-[#6f8099]">
                {active.subtitle}
              </span>
            </div>

            <h2 className="font-heading text-[clamp(2.8rem,5vw,5.5rem)] leading-[1.05] tracking-tight text-[var(--color-ink)]">
              {active.title}
            </h2>

            <div className="my-10 h-px w-12 bg-[linear-gradient(90deg,#2ecfc4,#9ddcf6)]" />

            <p className="font-body max-w-sm text-base leading-8 text-[var(--color-ink-soft)]">
              {active.description}
            </p>

            <div className="mt-12 flex items-center gap-6">
              <Link
                href={active.ctaPrimary.href}
                className="flex items-center gap-2 border border-transparent bg-[linear-gradient(135deg,#2ecfc4,#8ebcf5)] px-8 py-4 font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_18px_36px_rgba(46,207,196,0.24)] transition hover:brightness-105"
              >
                {active.ctaPrimary.label}
                <ArrowRight />
              </Link>

              {active.ctaSecondary?.label && (
                <Link
                  href={active.ctaSecondary.href}
                  className="border-b border-transparent pb-1 font-body text-[13px] uppercase tracking-[0.1em] text-[#596b87] hover:border-[#8ebcf5] hover:text-[var(--color-ink)]"
                >
                  {active.ctaSecondary.label}
                </Link>
              )}
            </div>
          </div>

          {active.stats && (
            <div className="flex gap-12 border-t border-[rgba(205,222,241,0.72)] pt-12">
              {active.stats.map((s, i) => (
                <div key={i}>
                  <div className="font-heading text-xl text-[var(--color-ink)]">
                    {s.value}
                  </div>
                  <div className="mt-1 font-body text-[12px] uppercase tracking-[0.16em] text-[#6f8099]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT - CSS fade instead of Framer Motion */}
        <div className="relative overflow-hidden bg-[linear-gradient(145deg,#eefbff,#f3f8ff)]">

          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg,#e5e5e5 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />

          {/* Simple CSS-based image transition */}
          <div className="absolute inset-0 z-10 transition-opacity duration-300">
            <Image
              src={active.image.src}
              alt={active.image.alt}
              fill
              priority
              sizes="50vw"
              className="object-contain p-10"
            />
          </div>

          {hasMultiple && (
            <>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() =>
                  setCurrent((c) => (c - 1 + slides.length) % slides.length)
                }
                className="liquid-glass-pill absolute left-6 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition hover:bg-white"
              >
                <ChevronLeft />
              </button>

              <button
                type="button"
                aria-label="Next slide"
                onClick={() => setCurrent((c) => (c + 1) % slides.length)}
                className="liquid-glass-pill absolute right-6 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition hover:bg-white"
              >
                <ChevronRight />
              </button>

              <div className="absolute bottom-5 left-8 right-8 z-20 flex items-center justify-between rounded-full px-5 py-3 liquid-glass-pill">
                <span className="font-body text-[12px] tracking-[0.16em] text-[#6f8099] tabular-nums">
                  {(safeCurrent + 1).toString().padStart(2, '0')} /
                  {slides.length.toString().padStart(2, '0')}
                </span>

                <div className="flex items-center gap-2">
                  {slides.map((_, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setCurrent(i)}
                      className="p-2 transition-all duration-300"
                      aria-label={`Go to slide ${i + 1}`}
                      aria-pressed={i === safeCurrent}
                    >
                      <span
                        className={`block rounded-full transition-all duration-300 ${
                          i === safeCurrent
                            ? 'h-[3px] w-6 bg-[linear-gradient(90deg,#2ecfc4,#9ddcf6)]'
                            : 'h-[6px] w-[6px] bg-[#b9c4de]'
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
