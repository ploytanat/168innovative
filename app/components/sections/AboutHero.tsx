import Image from "next/image"

import type { AboutHeroView, ImageView } from "@/app/lib/types/view"

import Breadcrumb from "../ui/Breadcrumb"
import { COLORS, GLASS, SECTION_BACKGROUNDS, SOFT_IMAGE_BG, SOFT_IMAGE_BG_ALT } from "../ui/designSystem"

const CHIPS = [
  { label: "Product Sourcing", style: { ...GLASS.card, color: COLORS.dark } },
  { label: "Quality Control",  style: { ...GLASS.card, color: COLORS.brandNavy, background: SOFT_IMAGE_BG } },
  { label: "Supply Chain",     style: { ...GLASS.card, color: COLORS.brandMuted, background: SOFT_IMAGE_BG_ALT } },
]

export default function AboutHero({ hero }: { hero: AboutHeroView }) {
  const words = hero.title.split(" ")
  const extras = [hero.image2].filter(Boolean) as ImageView[]

  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-4 sm:px-6 lg:px-8 lg:pb-16" style={{ background: SECTION_BACKGROUNDS.warm }}>
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="px-2 pb-6">
          <Breadcrumb />
        </div>

        <div className="grid grid-cols-1 items-center gap-10 px-2 py-2 lg:grid-cols-2 lg:gap-16 lg:px-0 lg:py-4">
          <div>
            <div className="mb-5 inline-flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#182338]" style={{ boxShadow: "0 0 0 3px rgba(154,191,231,0.18)" }} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: COLORS.soft }}>
                About our company
              </span>
            </div>

            <h1 className="font-heading text-[2rem] leading-[1.1] tracking-tight sm:text-[2.4rem]" style={{ color: COLORS.dark }}>
              {words.map((word, i) => (
                <span key={i} className="mr-[0.18em] inline-block last:mr-0">
                  {i === 1 ? (
                    <em className="rounded-[0.28em] bg-gradient-to-t from-[#d9e9f8] to-transparent px-[0.08em]"
                      style={{ fontStyle: "normal", color: COLORS.brandNavy }}>
                      {word}
                    </em>
                  ) : word}
                </span>
              ))}
            </h1>

            <div className="mb-5 mt-4 flex items-center gap-2">
              <div className="h-[1.5px] w-11 rounded-full" style={{ background: COLORS.dark }} />
              <div className="h-[1.5px] w-[18px] rounded-full bg-[#9abfe7]" />
              <div className="h-[5px] w-[5px] rounded-full bg-[#dbe3ec]" />
            </div>

            <p className="mb-9 max-w-[38rem] text-[0.98rem] leading-[1.9] sm:text-[1rem]" style={{ color: COLORS.mid }}>
              {hero.description}
            </p>

            <div className="flex flex-wrap gap-2.5">
              {CHIPS.map(({ label, style }) => (
                <span key={label}
                  className="rounded-[0.9rem] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em]"
                  style={style}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="overflow-hidden rounded-[1.15rem] p-2" style={GLASS.secondary}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[0.95rem]" style={{ background: SOFT_IMAGE_BG }}>
                {hero.image1 && (
                  <Image src={hero.image1.src} alt={hero.image1.alt} fill priority sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
                )}
                <div className="absolute right-3 top-3 z-10 rounded-[0.9rem] px-3 py-1.5" style={GLASS.card}>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em]" style={{ color: COLORS.dark }}>
                    Est. 2022
                  </p>
                </div>
              </div>
            </div>

            {extras.length > 0 && (
              <div className={`mt-3 grid gap-2.5 ${extras.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                {extras.slice(0, 3).map((img, i) => (
                  <div key={i} className="relative overflow-hidden rounded-[0.95rem]"
                    style={{ ...GLASS.card, aspectRatio: "4/3", background: SOFT_IMAGE_BG_ALT }}>
                    <Image src={img.src} alt={img.alt} fill sizes="(max-width:1024px) 33vw, 16vw" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
