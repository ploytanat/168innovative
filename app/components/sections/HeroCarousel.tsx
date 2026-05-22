'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { HomeHeroView } from '@/app/lib/types/view'
import { CONTAINER, DISPLAY_HEADING, HOME } from './home-theme'

const AUTOPLAY_MS = 6500

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

interface Props { hero: HomeHeroView }

export default function HeroCarousel({ hero }: Props) {
  const slides = hero.slides ?? []
  const [current, setCurrent] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const total = slides.length
  const hasMultiple = total > 1
  const safeCurrent = current < total ? current : 0
  const active = slides[safeCurrent]

  const go = (index: number) => { setAnimKey(k => k + 1); setCurrent(index) }
  const advance  = () => { if (total) go((safeCurrent + 1) % total) }
  const previous = () => { if (total) go((safeCurrent - 1 + total) % total) }

  useEffect(() => {
    if (!hasMultiple) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(advance, AUTOPLAY_MS)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMultiple, safeCurrent, total])

  if (!active) return null

  return (
    <>
      <style>{`
        @keyframes heroFade { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes heroImg  { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
        .hf1 { animation: heroFade .5s .04s cubic-bezier(.22,1,.36,1) both }
        .hf2 { animation: heroFade .5s .12s cubic-bezier(.22,1,.36,1) both }
        .hf3 { animation: heroFade .5s .20s cubic-bezier(.22,1,.36,1) both }
        .hf4 { animation: heroFade .5s .28s cubic-bezier(.22,1,.36,1) both }
        .himg { animation: heroImg .55s cubic-bezier(.22,1,.36,1) both }
      `}</style>

      <section className="relative" style={{ background: HOME.mint }}>
        <div className={`${CONTAINER} py-16 sm:py-24 lg:py-28`}>
          <div className="grid items-center gap-10 lg:min-h-[500px] lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">

            {/* ── Content ───────────────────────────────────────────── */}
            <div className="order-2 lg:order-1 lg:pr-6">
              {active.subtitle && (
                <p
                  key={`s-${animKey}`}
                  className="hf1 mb-5 text-[13px] font-bold uppercase tracking-[0.16em]"
                  style={{ color: HOME.mintInk }}
                >
                  {active.subtitle}
                </p>
              )}

              <h2
                key={`t-${animKey}`}
                className={`hf2 ${DISPLAY_HEADING} font-bold text-[clamp(2.5rem,1.5rem+4.4vw,4.4rem)]`}
                style={{ color: HOME.ink }}
              >
                {active.title}
              </h2>

              <p
                key={`d-${animKey}`}
                className="hf3 mt-6 max-w-lg text-[1.05rem] leading-[1.75]"
                style={{ color: HOME.inkMid }}
              >
                {active.description}
              </p>

              <div key={`c-${animKey}`} className="hf4 mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={active.ctaPrimary.href}
                  className="home-btn home-btn-accent inline-flex items-center rounded-[5px] px-7 py-3 text-[14px] font-bold"
                >
                  {active.ctaPrimary.label}
                </Link>
                {active.ctaSecondary?.label && (
                  <Link
                    href={active.ctaSecondary.href}
                    className="text-[14px] font-bold underline underline-offset-4"
                    style={{ color: HOME.inkMid }}
                  >
                    {active.ctaSecondary.label}
                  </Link>
                )}
              </div>

              {/* Slide nav */}
              {hasMultiple && (
                <div className="mt-10 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button" aria-label="Previous slide" onClick={previous}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 transition-colors hover:bg-white"
                      style={{ color: HOME.ink }}
                    >
                      <ChevronLeft />
                    </button>
                    <button
                      type="button" aria-label="Next slide" onClick={advance}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 transition-colors hover:bg-white"
                      style={{ color: HOME.ink }}
                    >
                      <ChevronRight />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {slides.map((slide, i) => (
                      <button
                        key={slide.id} type="button" onClick={() => go(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: i === safeCurrent ? 26 : 8,
                          background: i === safeCurrent ? HOME.ink : 'rgba(51,51,51,0.25)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Image ─────────────────────────────────────────────── */}
            <div className="order-1 flex justify-center lg:order-2">
              <div
                key={`i-${animKey}`}
                className="himg relative w-full max-w-[560px] lg:max-w-none"
              >
                <div className="relative aspect-[3/2]">
                  <Image
                    src={active.image.src} alt={active.image.alt}
                    fill priority sizes="(max-width:1024px) 94vw, 680px"
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
