'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { HomeHeroView } from '@/app/lib/types/view'
import { CONTAINER, DISPLAY_HEADING, HOME } from './home-theme'

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
      <style>{`@keyframes heroIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}.h-in{animation:heroIn .5s cubic-bezier(.22,1,.36,1) both}`}</style>

      <section className="relative" style={{ background: HOME.mint }}>
        <div className={`${CONTAINER} py-16 sm:py-24 lg:py-28`}>
          <div className="grid items-center gap-10 lg:min-h-[500px] lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">

            <div key={`c-${animKey}`} className="h-in order-2 lg:order-1">
              {active.subtitle && (
                <p className="mb-5 text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: HOME.mintInk }}>
                  {active.subtitle}
                </p>
              )}
              <h2 className={`${DISPLAY_HEADING} font-bold text-[clamp(2.5rem,1.5rem+4.4vw,4.4rem)]`} style={{ color: HOME.ink }}>
                {active.title}
              </h2>
              <p className="mt-6 max-w-lg text-[1.05rem] leading-[1.75]" style={{ color: HOME.inkMid }}>
                {active.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href={active.ctaPrimary.href} className="home-btn home-btn-accent inline-flex items-center rounded-[5px] px-7 py-3 text-[14px] font-bold">
                  {active.ctaPrimary.label}
                </Link>
                {active.ctaSecondary?.label && (
                  <Link href={active.ctaSecondary.href} className="text-[14px] font-bold underline underline-offset-4" style={{ color: HOME.inkMid }}>
                    {active.ctaSecondary.label}
                  </Link>
                )}
              </div>

              {hasMultiple && (
                <div className="mt-10 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button type="button" aria-label="Previous slide" onClick={previous}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 transition-colors hover:bg-white"
                      style={{ color: HOME.ink }}>
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button type="button" aria-label="Next slide" onClick={advance}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 transition-colors hover:bg-white"
                      style={{ color: HOME.ink }}>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {slides.map((slide, i) => (
                      <button key={slide.id} type="button" onClick={() => go(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: i === safeCurrent ? 26 : 8,
                          background: i === safeCurrent ? HOME.ink : 'rgba(51,51,51,0.25)',
                        }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div key={`i-${animKey}`} className="h-in order-1 flex w-full justify-center lg:order-2">
              <div className="relative aspect-[3/2] w-full max-w-[560px] lg:max-w-none">
                <Image src={active.image.src} alt={active.image.alt}
                  fill priority sizes="(max-width:1024px) 94vw, 680px"
                  className="rounded-lg object-cover" />
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
