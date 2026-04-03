'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, Flame, Gift, Sparkles, Star, Zap } from 'lucide-react'

import type { HeroSlideView } from '@/app/lib/types/view'
import { HERO_THEMES } from './heroThemes'

// ─── Types ────────────────────────────────────────────────────────────────────

type Locale = 'th' | 'en'

interface Props {
  slide: HeroSlideView
  locale: Locale
  animDir: 'left' | 'right'
  animKey: number
}

// ─── Static UI copy ───────────────────────────────────────────────────────────

const UI_COPY = {
  th: {
    urgencyLine: 'ฟรีตัวอย่าง · ตอบกลับใน 24 ชม. · ส่งทั่วประเทศ',
    floatingCardBody: 'พร้อมช่วยเลือกสเปกและรุ่นที่เหมาะกับงาน',
  },
  en: {
    urgencyLine: 'Free samples · Response within 24 hrs · Nationwide delivery',
    floatingCardBody: 'Support for packaging selection, specs, and brand direction',
  },
} as const

const BADGE_ICONS = {
  hot:      Flame,
  new:      Sparkles,
  promo:    Gift,
  featured: Star,
} as const

// ─── Helpers ──────────────────────────────────────────────────────────────────

function splitTitle(raw: string): [primary: string, rest: string[]] {
  const lines = raw.split('\n').filter(Boolean)
  return [lines[0] ?? raw, lines.slice(1)]
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function HeroSlide({ slide, locale, animDir, animKey }: Props) {
  const t          = HERO_THEMES[slide.theme ?? 'rose']
  const copy       = UI_COPY[locale]
  const BadgeIcon  = BADGE_ICONS[slide.badge?.variant ?? 'hot']
  const [primaryLine, secondaryLines] = splitTitle(slide.title)

  const titleCls =
    locale === 'th'
      ? 'font-body text-[clamp(2.1rem,4.5vw,3.6rem)] font-extrabold leading-[1.1] tracking-[-0.03em]'
      : 'font-heading text-[clamp(2.2rem,4.2vw,3.7rem)] font-black leading-[1.04] tracking-[-0.04em]'

  const slideAnimCls = animDir === 'right' ? 'hero-slide-r' : 'hero-slide-l'

  return (
    <div className="relative overflow-hidden">
      {/* ── Background wash ── */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(130deg,rgba(255,255,255,.96) 0%,rgba(255,255,255,.88) 44%,rgba(255,255,255,0) 68%), ${t.imgBg}`,
        }}
      />

      {/* ── Ambient orbs (content side) ── */}
      <div aria-hidden className="pointer-events-none absolute -left-12 -top-4 h-56 w-56 rounded-full blur-3xl opacity-60" style={{ background: t.orbA }} />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-[10%] h-32 w-32 rounded-full blur-3xl opacity-50" style={{ background: t.orbB }} />

      {/* ── Diagonal accent stripe ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -right-20 top-0 h-full w-[55%] opacity-[0.04]"
          style={{
            background: t.accent,
            clipPath: 'polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        />
      </div>

      <div className="relative grid min-h-130 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,.95fr)] xl:min-h-155">

        {/* ── Stat cards (top-right overlay, xl only) ── */}
        {slide.stats && slide.stats.length > 0 && (
          <div aria-hidden className="pointer-events-none absolute right-5 top-5 z-20 hidden w-[148px] flex-col gap-3 xl:flex">
            {slide.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border px-4 py-3 backdrop-blur-sm"
                style={{
                  background: 'rgba(255,255,255,.80)',
                  borderColor: 'rgba(17,24,39,.07)',
                  boxShadow: '0 8px 24px rgba(17,24,39,.07)',
                }}
              >
                <div className="font-heading text-[1.65rem] font-black leading-none" style={{ color: t.dot }}>
                  {stat.value}
                </div>
                <div className="mt-1 text-[10px] font-semibold tracking-[0.04em] text-[#5a6a7c]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Content panel ── */}
        <div
          className="order-2 flex flex-col justify-center px-6 py-10 sm:px-8 sm:py-12 lg:order-1 lg:px-11 lg:py-14 xl:px-14"
        >
          {/* ── Top row: badge + eyebrow ── */}
          <div className="hero-fu-1 mb-5 flex flex-wrap items-center gap-2">
            {slide.badge?.text && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5"
                style={{
                  background: t.badge.bg,
                  border: `1.5px solid ${t.badge.border}`,
                  boxShadow: `0 2px 12px ${t.shadow}`,
                }}
              >
                <BadgeIcon className="h-3 w-3" style={{ color: t.badge.text }} />
                <span className="text-[10px] font-black uppercase tracking-[0.12em]" style={{ color: t.badge.text }}>
                  {slide.badge.text}
                </span>
              </span>
            )}
            <span
              className="text-[10.5px] font-semibold tracking-[0.08em] uppercase"
              style={{ color: '#94a3b8' }}
            >
              168 Innovative
            </span>
          </div>

          {/* ── Headline ── */}
          <h2 className="hero-fu-2">
            <span className={`${titleCls} block text-[#111827]`}>{primaryLine}</span>
            {secondaryLines.map((line) => (
              <span key={line} className="relative mt-2 inline-block align-top">
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-xl"
                  style={{ background: t.mark, transform: 'skewX(-1.5deg)' }}
                />
                <span className={`${titleCls} relative block px-4 py-1 text-white`}>{line}</span>
              </span>
            ))}
          </h2>

          {/* ── Description ── */}
          {slide.description && (
            <p
              className="hero-fu-3 mt-5 max-w-[36rem] text-[0.975rem] font-medium leading-[1.8] text-[#4b5563]"
            >
              {slide.description}
            </p>
          )}

          {/* ── Benefits as chips ── */}
          {slide.benefits && slide.benefits.length > 0 && (
            <div className="hero-fu-4 mt-5 flex flex-wrap gap-2">
              {slide.benefits.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold"
                  style={{
                    background: 'rgba(255,255,255,.75)',
                    borderColor: 'rgba(30,40,60,0.10)',
                    color: '#374151',
                  }}
                >
                  <Check className="h-3 w-3 shrink-0" style={{ color: t.dot }} />
                  {item}
                </span>
              ))}
            </div>
          )}

          {/* ── CTA block ── */}
          <div className="hero-fu-5 mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={slide.ctaPrimary.href}
                className="group inline-flex items-center gap-2.5 rounded-2xl px-7 py-4 text-[13px] font-black uppercase tracking-[0.10em] text-white transition-all hover:scale-[1.03] hover:brightness-110 active:scale-[0.97] sm:px-8"
                style={{
                  background: t.accent,
                  boxShadow: `0 12px 32px ${t.shadow}, 0 2px 8px rgba(0,0,0,0.08)`,
                }}
              >
                {slide.ctaPrimary.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
              </Link>

              {slide.ctaSecondary?.label && (
                <Link
                  href={slide.ctaSecondary.href}
                  className="inline-flex items-center gap-2 rounded-2xl border px-7 py-4 text-[13px] font-semibold transition-all hover:bg-white sm:px-8"
                  style={{
                    background: 'rgba(255,255,255,0.72)',
                    borderColor: 'rgba(30,40,60,0.12)',
                    color: '#1a2232',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                >
                  {slide.ctaSecondary.label}
                </Link>
              )}
            </div>

            {/* Urgency line */}
            <div className="mt-3 flex items-center gap-1.5">
              <Zap className="h-3 w-3 shrink-0" style={{ color: t.dot }} />
              <span className="text-[11px] font-medium tracking-[0.03em] text-[#6b7280]">
                {copy.urgencyLine}
              </span>
            </div>
          </div>

          {/* ── Trust strip ── */}
          {slide.trustItems && slide.trustItems.length > 0 && (
            <div
              className="hero-fu-6 mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t pt-5"
              style={{ borderColor: 'rgba(30,40,60,0.07)' }}
            >
              {slide.trustItems.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#6b7280]"
                >
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: t.dot }} />
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Image panel ── */}
        <div
          className="order-1 relative overflow-hidden lg:order-2"
          style={{ minHeight: 'clamp(280px,42vw,520px)' }}
        >
          {/* Background orbs */}
          <div
            aria-hidden
            className="hero-orb-a pointer-events-none absolute rounded-full blur-3xl"
            style={{ background: t.orbA, width: '65%', paddingBottom: '65%', top: '-12%', left: '-12%', opacity: 0.9 }}
          />
          <div
            aria-hidden
            className="hero-orb-b pointer-events-none absolute rounded-full blur-3xl"
            style={{ background: t.orbB, width: '48%', paddingBottom: '48%', top: '50%', left: '52%', opacity: 0.8 }}
          />

          {/* Floating highlight card */}
          {slide.highlight && (
            <div
              className="absolute bottom-5 left-5 z-20 hidden max-w-[200px] rounded-2xl border px-4 py-3.5 backdrop-blur-md sm:flex xl:left-6"
              style={{
                background: 'rgba(255,255,255,.82)',
                borderColor: 'rgba(17,24,39,.07)',
                boxShadow: `0 16px 36px rgba(17,24,39,.12), 0 0 0 1px ${t.shadow}`,
              }}
            >
              <div>
                <div
                  className="font-heading text-[1.7rem] font-black leading-none"
                  style={{ color: t.dot }}
                >
                  {slide.highlight.value}
                </div>
                <div className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#64748b]">
                  {slide.highlight.label}
                </div>
                <div className="mt-2 text-[11px] leading-[1.6] text-[#475569]">
                  {copy.floatingCardBody}
                </div>
              </div>
            </div>
          )}

          {/* Slide image */}
          <div
            key={animKey}
            className={`absolute inset-0 z-10 ${slideAnimCls}`}
          >
            <Image
              src={slide.image.src}
              alt={slide.image.alt}
              fill
              priority
              sizes="(max-width:1024px) 100vw, 52vw"
              className="object-contain object-center p-6 sm:p-8 lg:object-right lg:p-10 xl:p-12 xl:pr-16"
              style={{
                filter: `drop-shadow(0 24px 56px ${t.shadow}) drop-shadow(0 6px 16px rgba(0,0,0,0.10))`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
