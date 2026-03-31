'use client'

import { HERO_THEMES } from './heroThemes'
import type { HeroTheme } from './heroThemes'

const AUTOPLAY_MS = 5500

const ChevronLeft = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRight = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
  </svg>
)

interface Props {
  total:   number
  current: number
  themes:  HeroTheme[]
  animKey: number
  onPrev:  () => void
  onNext:  () => void
  onJump:  (i: number) => void
}

export default function HeroNav({ total, current, themes, animKey, onPrev, onNext, onJump }: Props) {
  if (total <= 1) return null

  const btnStyle = {
    background: 'rgba(255,255,255,0.76)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1.5px solid rgba(255,255,255,0.90)',
    boxShadow: '0 2px 8px rgba(30,40,60,0.10)',
    color: '#3a4a5c',
  } as React.CSSProperties

  return (
    <div
      className="relative flex items-center justify-center gap-4 px-8 py-3"
      style={{
        borderTop: '1px solid rgba(30,40,60,0.07)',
        background: 'rgba(255,255,255,0.42)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* Prev */}
      <button
        type="button" aria-label="ก่อนหน้า" onClick={onPrev}
        className="inline-flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:scale-110 active:scale-95"
        style={btnStyle}
      >
        <ChevronLeft />
      </button>

      {/* Progress dots */}
      <div className="flex items-center gap-2">
        {Array.from({ length: total }).map((_, i) => {
          const t      = HERO_THEMES[themes[i] ?? 'rose']
          const active = i === current
          return (
            <button
              key={i} type="button" onClick={() => onJump(i)}
              aria-label={`สไลด์ ${i + 1}`}
              className="relative overflow-hidden rounded-full transition-all duration-300"
              style={{
                width: active ? 28 : 8,
                height: 8,
                background: active ? 'transparent' : 'rgba(30,40,60,0.14)',
              }}
            >
              {active && (
                <span
                  key={animKey}
                  className="absolute inset-0 rounded-full"
                  style={{ background: t.dot, animation: `fillBar ${AUTOPLAY_MS}ms linear forwards` }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Next */}
      <button
        type="button" aria-label="ถัดไป" onClick={onNext}
        className="inline-flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:scale-110 active:scale-95"
        style={btnStyle}
      >
        <ChevronRight />
      </button>

      {/* Counter */}
      <span
        className="absolute right-6 text-[11px] font-semibold tabular-nums select-none"
        style={{ color: '#8a9aac' }}
      >
        {(current + 1).toString().padStart(2, '0')}
        <span className="mx-0.5 opacity-40">/</span>
        {total.toString().padStart(2, '0')}
      </span>
    </div>
  )
}
