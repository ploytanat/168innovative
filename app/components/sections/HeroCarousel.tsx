'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { HomeHeroView, SideBannerView } from '@/app/lib/types/view'
import { withLocalePath } from '@/app/lib/utils/withLocalePath'
import HeroNav from './hero/HeroNav'
import HeroSlide from './hero/HeroSlide'

// ─── Types ───────────────────────────────────────────────────────────────────

type Locale = 'th' | 'en'

interface HeroCarouselProps {
  hero: HomeHeroView
  locale: Locale
  /**
   * Side banners driven by CMS. Falls back to nothing if omitted —
   * the right column simply won't render rather than showing stale hardcode.
   */
  sideBanners?: SideBannerView[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AUTOPLAY_MS = 5_500

// Extracted from JSX so the string isn't recreated on every render.
// Keyframe names are descriptive rather than abbreviated.
const HERO_STYLES = `
  @keyframes hero-fill-bar    { from { width: 0 } to { width: 100% } }
  @keyframes hero-slide-right { from { opacity: 0; transform: translateX(36px) scale(0.96) } to { opacity: 1; transform: none } }
  @keyframes hero-slide-left  { from { opacity: 0; transform: translateX(-36px) scale(0.96) } to { opacity: 1; transform: none } }
  @keyframes hero-fade-up     { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: none } }
  @keyframes hero-orb-float-a { 0%,100% { transform: translate(0,0) scale(1) } 33% { transform: translate(12px,-18px) scale(1.05) } 66% { transform: translate(-8px,10px) scale(0.97) } }
  @keyframes hero-orb-float-b { 0%,100% { transform: translate(0,0) scale(1) } 50%  { transform: translate(-16px,12px) scale(1.07) } }
  .hero-orb-a  { animation: hero-orb-float-a  9s ease-in-out infinite }
  .hero-orb-b  { animation: hero-orb-float-b 11s ease-in-out infinite }
  .hero-slide-r { animation: hero-slide-right 0.52s cubic-bezier(.22,1,.36,1) both }
  .hero-slide-l { animation: hero-slide-left  0.52s cubic-bezier(.22,1,.36,1) both }
  .hero-fu-1 { animation: hero-fade-up 0.48s 0.04s cubic-bezier(.22,1,.36,1) both }
  .hero-fu-2 { animation: hero-fade-up 0.48s 0.10s cubic-bezier(.22,1,.36,1) both }
  .hero-fu-3 { animation: hero-fade-up 0.48s 0.17s cubic-bezier(.22,1,.36,1) both }
  .hero-fu-4 { animation: hero-fade-up 0.48s 0.24s cubic-bezier(.22,1,.36,1) both }
  .hero-fu-5 { animation: hero-fade-up 0.48s 0.32s cubic-bezier(.22,1,.36,1) both }
  .hero-fu-6 { animation: hero-fade-up 0.48s 0.40s cubic-bezier(.22,1,.36,1) both }
`

// ─── Side banner ─────────────────────────────────────────────────────────────

function SideBanner({
  banner,
  locale,
}: {
  banner: SideBannerView
  locale: Locale
}) {
  return (
    <Link
      href={withLocalePath(banner.href, locale)}
      className="group relative flex-1 overflow-hidden rounded-2xl border"
      style={{
        borderColor: 'rgba(15,23,42,.06)',
        boxShadow: '0 12px 28px rgba(17,24,39,.08)',
      }}
    >
      <Image
        src={banner.image.src}
        alt={banner.image.alt}
        fill
        sizes="320px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div
        className="absolute inset-0 flex flex-col justify-end p-4"
        style={{ background: banner.overlayGradient }}
      >
        {banner.tag && (
          <span
            className="mb-1 w-fit rounded-[3px] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-white"
            style={{ background: banner.tagColor ?? '#1565c0' }}
          >
            {banner.tag}
          </span>
        )}

        <p
          className="text-[14px] font-extrabold leading-tight text-white"
          style={{
            textShadow: '0 1px 8px rgba(0,0,0,.5)',
            fontFamily: "'Kanit', sans-serif",
          }}
        >
          {banner.title}
        </p>

        {banner.subtitle && (
          <p className="mt-0.5 text-[10px] text-white/82">{banner.subtitle}</p>
        )}
      </div>
    </Link>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function HeroCarousel({
  hero,
  locale,
  sideBanners,
}: HeroCarouselProps) {
  const slides = hero.slides ?? []
  const total  = slides.length

  const [current, setCurrent]   = useState(0)
  const [animDir, setAnimDir]   = useState<'left' | 'right'>('right')
  const [animKey, setAnimKey]   = useState(0)
  const [paused, setPaused]     = useState(false)

  // Clamp index so a stale state never points past the end of the array.
  const idx    = Math.min(current, Math.max(total - 1, 0))
  const active = slides[idx]

  // ── Navigation ──────────────────────────────────────────────────────────────
  // Wrapped in useCallback so the autoplay effect has a stable reference
  // and doesn't reschedule itself every render.

  const go = useCallback(
    (i: number, dir: 'left' | 'right') => {
      setAnimDir(dir)
      setAnimKey((k) => k + 1)
      setCurrent(i)
    },
    [],
  )

  const advance  = useCallback(() => { if (total) go((idx + 1) % total, 'right') }, [go, idx, total])
  const previous = useCallback(() => { if (total) go((idx - 1 + total) % total, 'left') }, [go, idx, total])
  const jumpTo   = useCallback((i: number) => go(i, i > idx ? 'right' : 'left'), [go, idx])

  // ── Autoplay ────────────────────────────────────────────────────────────────
  // Uses a ref to always call the latest `advance` without re-registering the
  // interval — avoids the stale-closure bug in the original implementation.

  const advanceRef = useRef(advance)
  useEffect(() => { advanceRef.current = advance }, [advance])

  useEffect(() => {
    if (total <= 1 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = window.setInterval(() => advanceRef.current(), AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [total, paused]) // intentionally excludes `advance` — handled via ref

  if (!active) return null

  return (
    <>
      {/* Single <style> injection, constant string — no per-render allocation */}
      <style>{HERO_STYLES}</style>

      <section
        aria-label={locale === 'th' ? 'สินค้าแนะนำ' : 'Featured products'}
        className="relative overflow-hidden py-3"
        style={{ background: 'linear-gradient(180deg,#f7f5f2 0%,#f3efe9 100%)' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="mx-auto px-3 sm:px-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]">

            {/* ── Main slide ── */}
            <div
              className="relative overflow-hidden rounded-[1.7rem] border shadow-[0_18px_45px_rgba(17,24,39,0.08)]"
              style={{ borderColor: 'rgba(15,23,42,.06)' }}
            >
              <HeroSlide
                slide={active}
                locale={locale}
                animDir={animDir}
                animKey={animKey}
              />
              <HeroNav
                total={total}
                current={idx}
                themes={slides.map((s) => s.theme)}
                autoplayMs={AUTOPLAY_MS}
                animKey={animKey}
                locale={locale}
                onPrev={previous}
                onNext={advance}
                onJump={jumpTo}
              />
            </div>

            {/* ── Side banners — only renders when data is provided ── */}
            {sideBanners && sideBanners.length > 0 && (
              <div className="hidden flex-col gap-3 lg:flex">
                {sideBanners.slice(0, 2).map((banner) => (
                  <SideBanner key={banner.id} banner={banner} locale={locale} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}