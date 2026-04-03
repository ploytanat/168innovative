'use client'

import type { HeroTheme } from './heroThemes'
import { HERO_THEMES } from './heroThemes'

// ─── Types ────────────────────────────────────────────────────────────────────

type Locale = 'th' | 'en'

interface Props {
  total: number
  current: number
  themes: HeroTheme[]
  autoplayMs: number
  animKey: number
  locale: Locale
  onPrev: () => void
  onNext: () => void
  onJump: (i: number) => void
}

// ─── Copy ─────────────────────────────────────────────────────────────────────

const NAV_COPY = {
  th: { previous: 'สไลด์ก่อนหน้า', next: 'สไลด์ถัดไป', slide: 'สไลด์' },
  en: { previous: 'Previous slide',  next: 'Next slide',   slide: 'Slide'  },
} as const

// ─── Styles ───────────────────────────────────────────────────────────────────

const BTN_STYLE: React.CSSProperties = {
  background:           'rgba(255,255,255,0.88)',
  backdropFilter:       'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  border:               '1.5px solid rgba(255,255,255,0.95)',
  boxShadow:            '0 8px 28px rgba(30,40,60,0.16), 0 2px 6px rgba(0,0,0,0.06)',
  color:                '#1e293b',
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <svg aria-hidden fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg aria-hidden fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  )
}

// ─── Progress dot ─────────────────────────────────────────────────────────────

function ProgressDot({
  index,
  active,
  theme,
  animKey,
  autoplayMs,
  label,
  onJump,
}: {
  index:      number
  active:     boolean
  theme:      HeroTheme
  animKey:    number
  autoplayMs: number
  label:      string
  onJump:     (i: number) => void
}) {
  const t = HERO_THEMES[theme]

  return (
    <button
      type="button"
      onClick={() => onJump(index)}
      aria-label={label}
      aria-pressed={active}
      className="relative overflow-hidden rounded-full transition-all duration-300 ease-out"
      style={{
        width:      active ? 36 : 10,
        height:     10,
        background: active
          ? 'rgba(17,24,39,0.10)'
          : 'rgba(255,255,255,0.48)',
        boxShadow: active ? '0 2px 8px rgba(0,0,0,0.18)' : 'none',
      }}
    >
      {active && (
        <span
          key={animKey}
          className="absolute inset-0 rounded-full"
          style={{
            background: t.dot,
            animation:  `hero-fill-bar ${autoplayMs}ms linear forwards`,
          }}
        />
      )}
    </button>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
// Returns absolutely-positioned elements — parent must be `relative`.

export default function HeroNav({
  total,
  current,
  themes,
  autoplayMs,
  animKey,
  locale,
  onPrev,
  onNext,
  onJump,
}: Props) {
  if (total <= 1) return null

  const copy = NAV_COPY[locale]

  return (
    <>
      {/* ── Prev button — left edge, vertically centred ── */}
      <button
        type="button"
        aria-label={copy.previous}
        onClick={onPrev}
        className="absolute left-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 hover:shadow-xl active:scale-95 sm:h-14 sm:w-14"
        style={BTN_STYLE}
      >
        <ChevronLeft />
      </button>

      {/* ── Next button — right edge, vertically centred ── */}
      <button
        type="button"
        aria-label={copy.next}
        onClick={onNext}
        className="absolute right-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 hover:shadow-xl active:scale-95 sm:h-14 sm:w-14"
        style={BTN_STYLE}
      >
        <ChevronRight />
      </button>

      {/* ── Progress dots — bottom centre ── */}
      <div
        role="group"
        aria-label={locale === 'th' ? 'เลือกสไลด์' : 'Select slide'}
        className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2"
      >
        {Array.from({ length: total }, (_, i) => (
          <ProgressDot
            key={i}
            index={i}
            active={i === current}
            theme={themes[i] ?? 'rose'}
            animKey={animKey}
            autoplayMs={autoplayMs}
            label={`${copy.slide} ${i + 1}`}
            onJump={onJump}
          />
        ))}
      </div>

      {/* ── Counter — bottom right ── */}
      <span
        aria-live="polite"
        aria-atomic="true"
        className="absolute bottom-4 right-5 z-30 select-none text-[12px] font-bold tabular-nums"
        style={{
          color:      'rgba(255,255,255,0.75)',
          textShadow: '0 1px 4px rgba(0,0,0,0.35)',
        }}
      >
        {String(current + 1).padStart(2, '0')}
        <span aria-hidden className="mx-0.75 opacity-50">/</span>
        {String(total).padStart(2, '0')}
      </span>
    </>
  )
}
