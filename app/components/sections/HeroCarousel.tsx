'use client'

import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { HomeHeroView } from '@/app/lib/types/view'
import { DISPLAY_HEADING, HOME } from './home-theme'

const AUTOPLAY_MS = 6500

export default function HeroCarousel({ hero }: { hero: HomeHeroView }) {
  const slides = hero.slides ?? []
  const [current, setCurrent] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const total = slides.length
  const hasMultiple = total > 1
  const safeCurrent = current < total ? current : 0
  const active = slides[safeCurrent]

  const go = (i: number) => { setAnimKey(k => k + 1); setCurrent(i) }
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
        @keyframes heroCopyIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}
        .h-copy-in{animation:heroCopyIn .5s cubic-bezier(.22,1,.36,1) both}
        @media (prefers-reduced-motion: reduce){.h-copy-in{animation:none}}
      `}</style>

      <section className="relative" style={{ background: HOME.mint }}>
        {/*
          Responsive layout intent:
          ─ default (≤639):  stacked, image 4/3 on top, copy below
          ─ sm (640–767):    stacked, image 16/10 (wider, less tall)
          ─ md (768–1023):   stacked, image 16/9 (cinematic), bigger padding
          ─ lg (1024+):      side-by-side, image right (52%), copy left (48%)
          ─ xl (1280+):      same, more padding + larger type
          ─ 2xl (1536+):     same, even more breathing room
        */}
        <div className="grid items-stretch lg:grid-cols-[1fr_1.1fr] lg:min-h-[min(580px,calc(100vh-5rem))] xl:min-h-[min(640px,calc(100vh-5rem))] 2xl:min-h-[min(680px,calc(100vh-5rem))]">

          {/* Copy column */}
          <div key={`c-${animKey}`}
            className="h-copy-in order-2 flex flex-col justify-center px-5 py-12 sm:px-7 sm:py-14 md:px-10 md:py-16 lg:order-1 lg:px-10 lg:py-16 xl:px-14 xl:py-20 2xl:px-16 2xl:py-24">
            <div className="w-full lg:max-w-[30rem] lg:mx-auto xl:max-w-[34rem] 2xl:max-w-[36rem]">
              {active.subtitle && (
                <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] sm:mb-5 sm:text-[12px]" style={{ color: HOME.mintInk }}>
                  <span aria-hidden className="inline-block h-px w-6" style={{ background: HOME.mintInk }} />
                  {active.subtitle}
                </p>
              )}

              <h2 lang="th"
                className={`${DISPLAY_HEADING} font-bold text-[clamp(1.55rem,1rem+2.4vw,2.1rem)] sm:text-[clamp(1.75rem,1rem+2.6vw,2.4rem)] lg:text-[clamp(2rem,1rem+2vw,2.7rem)] xl:text-[clamp(2.25rem,1rem+2vw,3rem)]`}
                style={{ color: HOME.ink, wordBreak: 'keep-all', textWrap: 'balance' }}>
                {active.title}
              </h2>

              <HeroDescription text={active.description} />

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 sm:mt-7 lg:mt-8">
                <Link href={active.ctaPrimary.href}
                  className="home-btn home-btn-accent inline-flex items-center rounded-[5px] px-6 py-3 text-[14px] font-bold sm:px-7 sm:py-3.5">
                  {active.ctaPrimary.label}
                </Link>
                {active.ctaSecondary?.label && (
                  <Link href={active.ctaSecondary.href}
                    className="text-[14px] font-bold underline underline-offset-4"
                    style={{ color: HOME.inkMid }}>
                    {active.ctaSecondary.label}
                  </Link>
                )}
              </div>
ย
              {hasMultiple && (
                <div className="mt-8 flex items-center gap-4 sm:mt-9 lg:mt-10">
                  <div className="flex items-center gap-2">
                    <button type="button" aria-label="Previous slide" onClick={previous}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 transition-colors hover:bg-white sm:h-9 sm:w-9"
                      style={{ color: HOME.ink }}>
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button type="button" aria-label="Next slide" onClick={advance}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 transition-colors hover:bg-white sm:h-9 sm:w-9"
                      style={{ color: HOME.ink }}>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {slides.map((slide, i) => (
                      <button key={slide.id} type="button" onClick={() => go(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className="h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width: i === safeCurrent ? 26 : 8,
                          background: i === safeCurrent ? HOME.ink : 'rgba(51,51,51,0.25)',
                        }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Image column */}
          <div className="relative order-1 aspect-[4/3] overflow-hidden sm:aspect-[16/10] md:aspect-video lg:order-2 lg:aspect-auto">
            <Image
              src={active.image.src} alt={active.image.alt}
              fill priority sizes="(max-width:1023px) 100vw, 52vw"
              className="object-cover"
              style={{ objectPosition: 'center 45%' }} />

            {/* Soft mint fade at top (stacked layouts only) */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/6 lg:hidden"
              style={{ background: `linear-gradient(180deg, ${HOME.mint} 0%, transparent 100%)` }} />
          </div>

        </div>
      </section>
    </>
  )
}

function HeroDescription({ text }: { text: string }) {
  const parts = text.split('✓').map(s => s.trim()).filter(Boolean)
  const [lead, ...bullets] = parts

  const leadClass =
    'mt-4 max-w-[42ch] text-[0.95rem] leading-[1.7] sm:mt-5 sm:text-[1rem] lg:mt-6 lg:text-[1.05rem] lg:leading-[1.75]'

  if (bullets.length === 0) {
    return (
      <p className={leadClass} style={{ color: HOME.inkMid }}>
        {lead}
      </p>
    )
  }

  return (
    <>
      <p className={leadClass} style={{ color: HOME.inkMid }}>
        {lead}
      </p>
      <ul className="mt-3 space-y-1.5 sm:mt-4">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-[0.95rem] leading-[1.55] sm:text-[1rem] lg:text-[1.05rem]"
              style={{ color: HOME.inkMid }}>
            <Check className="mt-1 h-3.5 w-3.5 shrink-0" strokeWidth={2.5} style={{ color: HOME.mintInk }} />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
