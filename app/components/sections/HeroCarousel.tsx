'use client'

import { useEffect, useState } from 'react'

import { SECTION_BACKGROUNDS } from '@/app/components/ui/designSystem'
import type { HomeHeroView } from '@/app/lib/types/view'
import HeroNav   from './hero/HeroNav'
import HeroSlide from './hero/HeroSlide'

// ─── Constants ────────────────────────────────────────────────────────────────

const AUTOPLAY_MS = 5500
export const HERO_BG = SECTION_BACKGROUNDS.hero

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function HeroCarousel({ hero }: { hero: HomeHeroView }) {
  const slides = hero.slides ?? []
  const total  = slides.length

  const [current, setCurrent] = useState(0)
  const [animDir, setAnimDir] = useState<'left' | 'right'>('right')
  const [animKey, setAnimKey] = useState(0)
  const [paused,  setPaused]  = useState(false)

  const idx    = current < total ? current : 0
  const active = slides[idx]

  const go       = (i: number, dir: 'left' | 'right') => { setAnimDir(dir); setAnimKey(k => k + 1); setCurrent(i) }
  const advance  = () => total && go((idx + 1) % total, 'right')
  const previous = () => total && go((idx - 1 + total) % total, 'left')
  const jumpTo   = (i: number) => go(i, i > idx ? 'right' : 'left')

  useEffect(() => {
    if (total <= 1 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(advance, AUTOPLAY_MS)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, idx, paused])

  if (!active) return null

  return (
    <>
      <style>{`
        @keyframes fillBar  { from{width:0} to{width:100%} }
        @keyframes slideInR { from{opacity:0;transform:translateX(36px) scale(0.96)} to{opacity:1;transform:none} }
        @keyframes slideInL { from{opacity:0;transform:translateX(-36px) scale(0.96)} to{opacity:1;transform:none} }
        @keyframes fu       { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes orbFloat  { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(12px,-18px) scale(1.05)} 66%{transform:translate(-8px,10px) scale(0.97)} }
        @keyframes orbFloat2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-16px,12px) scale(1.07)} }
        .orb1 { animation: orbFloat  9s ease-in-out infinite }
        .orb2 { animation: orbFloat2 11s ease-in-out infinite }
        .slide-r { animation: slideInR 0.52s cubic-bezier(.22,1,.36,1) both }
        .slide-l { animation: slideInL 0.52s cubic-bezier(.22,1,.36,1) both }
        .fu1 { animation: fu 0.48s 0.04s cubic-bezier(.22,1,.36,1) both }
        .fu2 { animation: fu 0.48s 0.10s cubic-bezier(.22,1,.36,1) both }
        .fu3 { animation: fu 0.48s 0.17s cubic-bezier(.22,1,.36,1) both }
        .fu4 { animation: fu 0.48s 0.24s cubic-bezier(.22,1,.36,1) both }
        .fu5 { animation: fu 0.48s 0.32s cubic-bezier(.22,1,.36,1) both }
        .fu6 { animation: fu 0.48s 0.40s cubic-bezier(.22,1,.36,1) both }
      `}</style>

      <section
        className="relative py-6 lg:py-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="relative overflow-hidden rounded-[1.5rem]"
            style={{
              background: HERO_BG,
              border: '1px solid rgba(255,255,255,0.80)',
              boxShadow: '0 1px 0 rgba(255,255,255,0.70) inset, 0 12px 48px rgba(30,40,60,0.10), 0 48px 96px rgba(30,40,60,0.04)',
            }}
          >
            <HeroSlide slide={active} animDir={animDir} animKey={animKey} />
            <HeroNav
              total={total}
              current={idx}
              themes={slides.map(s => s.theme)}
              animKey={animKey}
              onPrev={previous}
              onNext={advance}
              onJump={jumpTo}
            />
          </div>
        </div>
      </section>
    </>
  )
}
