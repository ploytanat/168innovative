'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import type { HeroSlideView } from '@/app/lib/types/view'

type Locale = 'th' | 'en'

interface Props {
  slide: HeroSlideView
  locale: Locale
  animDir: 'left' | 'right'
  animKey: number
}

function splitTitle(raw: string): [string, string[]] {
  const lines = raw.split('\n').filter(Boolean)
  return [lines[0] ?? raw, lines.slice(1)]
}

export default function HeroSlide({ slide, animDir, animKey }: Props) {
  const [primary, secondary] = splitTitle(slide.title)

  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(145deg,#dceff8_0%,#f4efe9_48%,#e7f3f8_100%)]">
      <div className="relative min-h-92 sm:min-h-105 lg:grid lg:h-full lg:min-h-112 lg:items-center lg:grid-cols-[0.9fr_1.1fr]">

        {/* Image — full-bleed background on mobile, right grid column on desktop */}
        <div className="absolute inset-0 lg:relative lg:inset-auto lg:col-start-2 lg:h-full">
          <div className="absolute bottom-8 left-1/2 hidden h-8 w-[62%] -translate-x-1/2 rounded-full bg-black/20 blur-2xl lg:block" />
          <div
            key={animKey}
            className={`absolute inset-0 ${animDir === 'right' ? 'hero-slide-r' : 'hero-slide-l'}`}
          >
            <Image
              src={slide.image.src}
              alt={slide.image.alt}
              fill
              priority
              sizes="(max-width:1024px) 100vw, 58vw"
              className="object-contain object-center p-3 scale-[1.04] sm:scale-[1.12] lg:object-right lg:scale-[1.28] lg:p-5 xl:scale-[1.34]"
              style={{ filter: 'drop-shadow(0 28px 54px rgba(70,44,32,0.25))' }}
            />
          </div>
        </div>

        {/* Gradient — mobile only, fades image at the bottom so text stays readable */}
        <div className="absolute inset-0 bg-linear-to-t from-[#dceff8] via-[#dceff8]/75 to-transparent lg:hidden" />

        {/* Text — bottom-anchored overlay on mobile, left grid column on desktop */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center px-5 pb-14 text-center sm:px-8 sm:pb-16 lg:relative lg:inset-auto lg:col-start-1 lg:max-w-117.5 lg:items-start lg:justify-center lg:px-12 lg:py-10 lg:text-left">
          <h1 className="text-[clamp(2.05rem,5.4vw,4.25rem)] font-black uppercase leading-[0.92] text-black">
            {primary}
            {secondary.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          {slide.description && (
            <p className="mt-3 max-w-80 text-[13px] leading-[1.6] text-black/68 sm:max-w-100 sm:text-[14px] lg:mt-5 lg:max-w-97.5 lg:text-[15px] lg:text-black/68">
              {slide.description}
            </p>
          )}

          <div className="mt-5 lg:mt-7">
            <Link
              href={slide.ctaPrimary.href}
              className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#3a7bd5,#2ab8b0)] px-7 py-3.5 text-[12px] font-black uppercase tracking-wide text-white shadow-[0_10px_22px_rgba(58,123,213,.22)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(58,123,213,.28)]"
            >
              {slide.ctaPrimary.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
