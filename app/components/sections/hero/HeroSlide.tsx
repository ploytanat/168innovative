'use client'

import Image from 'next/image'
import Link from 'next/link'

import type { HeroSlideView } from '@/app/lib/types/view'
import { BADGE_ICONS, HERO_THEMES } from './heroThemes'

// ─── Icons ────────────────────────────────────────────────────────────────────

const ArrowRight = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
)

const CheckCircle = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-3.5 w-3.5 shrink-0">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

// ─── Constants ────────────────────────────────────────────────────────────────

const TRUST_ITEMS = ['ส่งทั่วประเทศ', 'MOQ เพียง 100 ชิ้น', 'รับประกันคุณภาพ']

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  slide:    HeroSlideView
  animDir:  'left' | 'right'
  animKey:  number
}

export default function HeroSlide({ slide, animDir, animKey }: Props) {
  const t          = HERO_THEMES[slide.theme ?? 'rose']
  const badgeIcon  = BADGE_ICONS[slide.badge?.variant ?? 'hot']

  return (
    <div className="grid lg:grid-cols-[1fr_1.15fr]">

      {/* ╔══════════════════════╗
          ║  CONTENT  (left)     ║
          ╚══════════════════════╝ */}
      <div
        className="order-2 lg:order-1 relative flex flex-col justify-between
                    px-8 py-10 sm:px-10 lg:px-12 lg:py-14"
        style={{
          borderRight: '1px solid rgba(30,40,60,0.07)',
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          minHeight: 'clamp(400px,50vw,560px)',
        }}
      >
        <div>

          {/* ── Badge ── */}
          <div
            key={`b-${animKey}`}
            className="fu1 mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2"
            style={{
              background: t.badge.bg,
              border: `1.5px solid ${t.badge.border}`,
              boxShadow: `0 2px 12px ${t.shadow}`,
            }}
          >
            <span>{badgeIcon}</span>
            <span
              className="text-[11px] font-bold tracking-[0.10em] uppercase"
              style={{ color: t.badge.text }}
            >
              {slide.badge?.text}
            </span>
          </div>

          {/* ── Title — line 1 ปกติ, line 2 gradient highlight ── */}
          <h2 key={`t-${animKey}`} className="fu2">
            {slide.title.split('\n').map((line, li) =>
              li === 0 ? (
                <span
                  key={li}
                  className="block font-black leading-[1.05] tracking-[-0.03em]"
                  style={{ fontSize: 'clamp(1.9rem,3.8vw,3.2rem)', color: '#1a2232' }}
                >
                  {line}
                </span>
              ) : (
                <span key={li} className="relative mt-1 inline-block">
                  <span
                    className="absolute inset-0 rounded-xl"
                    style={{ background: t.mark, transform: 'skewX(-2deg)' }}
                  />
                  <span
                    className="relative font-black leading-[1.05] tracking-[-0.03em] px-3 py-0.5"
                    style={{ fontSize: 'clamp(1.9rem,3.8vw,3.2rem)', color: '#fff' }}
                  >
                    {line}
                  </span>
                </span>
              )
            )}
          </h2>

          {/* ── Description ── */}
          <p
            key={`d-${animKey}`}
            className="fu3 mt-5 max-w-sm text-[0.875rem] leading-[1.85]"
            style={{ color: '#5a6a7c' }}
          >
            {slide.description}
          </p>

          {/* ── Highlight chip (ตัวเลขเด่น 1 ค่า) ── */}
          {slide.highlight && (
            <div
              key={`h-${animKey}`}
              className="fu4 mt-6 inline-flex items-baseline gap-2.5 rounded-2xl px-5 py-3"
              style={{ background: t.mark, boxShadow: `0 6px 20px ${t.shadow}` }}
            >
              <span className="font-black text-[1.6rem] leading-none tracking-tight tabular-nums text-white">
                {slide.highlight.value}
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/80 leading-tight">
                {slide.highlight.label}
              </span>
            </div>
          )}

          {/* ── CTA buttons ── */}
          <div key={`c-${animKey}`} className="fu5 mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={slide.ctaPrimary.href}
              className="group inline-flex items-center gap-2.5 rounded-2xl px-7 py-4 text-[12.5px] font-bold uppercase tracking-[0.10em] text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: t.accent, boxShadow: `0 6px 24px ${t.shadow}` }}
            >
              {slide.ctaPrimary.label}
              <span className="transition-transform group-hover:translate-x-1"><ArrowRight /></span>
            </Link>

            {slide.ctaSecondary?.label && (
              <Link
                href={slide.ctaSecondary.href}
                className="inline-flex items-center gap-2 rounded-2xl px-7 py-4 text-[12.5px] font-semibold transition-all hover:opacity-80"
                style={{
                  background: 'rgba(255,255,255,0.72)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(30,40,60,0.14)',
                  color: '#1a2232',
                }}
              >
                {slide.ctaSecondary.label}
              </Link>
            )}
          </div>
        </div>

        {/* ── Trust bar ── */}
        <div
          key={`tr-${animKey}`}
          className="fu6 mt-8 flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t pt-5"
          style={{ borderColor: 'rgba(30,40,60,0.08)' }}
        >
          {TRUST_ITEMS.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold"
              style={{ color: '#5a6a7c' }}
            >
              <span style={{ color: t.dot }}><CheckCircle /></span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ╔═══════════════════════╗
          ║  IMAGE  (right)       ║
          ╚═══════════════════════╝ */}
      <div
        className="order-1 lg:order-2 relative overflow-hidden"
        style={{ background: t.imgBg, minHeight: 'clamp(280px,42vw,560px)' }}
      >
        {/* Animated orbs */}
        <div
          className="orb1 pointer-events-none absolute rounded-full blur-3xl"
          style={{ background: t.orbA, width: '54%', paddingBottom: '54%', top: '-10%', left: '-6%' }}
        />
        <div
          className="orb2 pointer-events-none absolute rounded-full blur-3xl"
          style={{ background: t.orbB, width: '42%', paddingBottom: '42%', top: '50%', left: '55%' }}
        />

        {/* Product image */}
        <div
          key={`img-${animKey}`}
          className={`absolute inset-0 ${animDir === 'right' ? 'slide-r' : 'slide-l'}`}
        >
          <Image
            src={slide.image.src} alt={slide.image.alt}
            fill priority sizes="(max-width:1024px) 100vw, 52vw"
            className="object-contain p-10 lg:p-14"
            style={{ filter: `drop-shadow(0 20px 48px ${t.shadow}) drop-shadow(0 4px 12px rgba(0,0,0,0.07))` }}
          />
        </div>
      </div>
    </div>
  )
}
