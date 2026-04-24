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

export default function HeroSlide({ slide, locale, animDir, animKey }: Props) {
  const [primary, secondary] = splitTitle(slide.title)

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#a9dbe6]">
      <div className="relative min-h-100 sm:min-h-110 lg:grid lg:h-full lg:min-h-115 lg:items-center lg:grid-cols-[0.85fr_1.15fr]">

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
              className="object-contain object-center p-3 scale-[1.08] sm:scale-[1.15] lg:object-right lg:scale-[1.35] lg:p-4 xl:scale-[1.42]"
              style={{ filter: 'drop-shadow(0 34px 68px rgba(0,0,0,0.28))' }}
            />
          </div>
        </div>

        {/* Gradient — mobile only, fades image at the bottom so text stays readable */}
        <div className="absolute inset-0 bg-linear-to-t from-[#a9dbe6] via-[#a9dbe6]/75 to-transparent lg:hidden" />

        {/* Text — bottom-anchored overlay on mobile, left grid column on desktop */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center px-5 pb-14 text-center sm:px-8 sm:pb-16 lg:relative lg:inset-auto lg:col-start-1 lg:max-w-117.5 lg:items-start lg:justify-center lg:px-12 lg:py-10 lg:text-left">
          <h1 className="text-[clamp(1.9rem,5.5vw,4rem)] font-black leading-[0.98] tracking-[-0.04em] text-black">
            {primary}
            {secondary.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          {slide.description && (
            <p className="mt-3 max-w-80 text-[13px] leading-[1.65] text-black/75 sm:max-w-100 sm:text-[14px] lg:mt-5 lg:max-w-97.5 lg:text-[15px] lg:text-black/70">
              {slide.description}
            </p>
          )}

          <div className="mt-5 lg:mt-7">
            <Link
              href={slide.ctaPrimary.href}
              className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-[12px] font-black uppercase tracking-wide text-white transition hover:opacity-85"
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
