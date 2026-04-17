import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import Placeholder from "@/app/components/ui/Placeholder"
import type { HeroSlideView } from "@/app/lib/types/view"
import type { CategoryView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

type Locale = "th" | "en"

interface HeroSectionProps {
  slides: HeroSlideView[]
  categories: CategoryView[]
  locale: Locale
}

const COPY = {
  en: {
    eyebrow: "168 Innovative Co., Ltd.",
    lines: ["PRECISION", "COSMETIC", "PACKAGING"],
    sub: "Full OEM / ODM support — from sample selection through production-ready delivery.",
    cta: "Browse Catalog",
    ctaHref: "/en/categories",
    stats: [
      { value: "500+", label: "Partner brands" },
      { value: "10+",  label: "Years in industry" },
      { value: "24h",  label: "Quote turnaround" },
    ],
    cardLabels: ["Flagship Pick", "Top Seller", "OEM Ready"],
  },
  th: {
    eyebrow: "168 Innovative Co., Ltd.",
    lines: ["บรรจุภัณฑ์", "เครื่องสำอาง", "คุณภาพพรีเมียม"],
    sub: "OEM / ODM ครบวงจร ตั้งแต่เลือกรุ่นสินค้าจนถึงขั้นตอนการผลิต",
    cta: "ดูสินค้าทั้งหมด",
    ctaHref: "/categories",
    stats: [
      { value: "500+", label: "แบรนด์คู่ค้า" },
      { value: "10+",  label: "ปีในอุตสาหกรรม" },
      { value: "24h",  label: "ตอบกลับใบเสนอราคา" },
    ],
    cardLabels: ["สินค้าเด่น", "ขายดี", "พร้อม OEM"],
  },
} as const

function getImages(slides: HeroSlideView[], categories: CategoryView[]) {
  const fromSlides = slides
    .filter((s) => s.image?.src)
    .slice(0, 3)
    .map((s) => ({ src: s.image.src, alt: s.image.alt, name: s.title }))

  if (fromSlides.length >= 2) return fromSlides

  const fromCats = categories
    .filter((c) => c.image?.src)
    .slice(0, 3)
    .map((c) => ({ src: c.image!.src, alt: c.image!.alt, name: c.name }))

  return [...fromSlides, ...fromCats].slice(0, 3)
}

export default function HeroSection({ slides, categories, locale }: HeroSectionProps) {
  const copy = COPY[locale]
  const images = getImages(slides, categories)

  return (
    <section
      aria-label={locale === "th" ? "แนะนำบรรจุภัณฑ์" : "Featured packaging"}
      className="relative overflow-hidden bg-[#f8f8f4] px-4 pb-0 pt-8 sm:px-6 sm:pt-12 lg:pt-14"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_42%] lg:gap-0">

          {/* ── Left: staggered headline ── */}
          <div className="pb-10 lg:pb-14">
            <p className="mb-6 inline-flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#4c6b35]">
              <span className="h-px w-10 bg-[#6e8a50]" />
              {copy.eyebrow}
            </p>

            <div className="space-y-0">
              {copy.lines.map((line, i) => (
                <div
                  key={line}
                  className={i === 0 ? "pl-0" : i === 1 ? "pl-[11%]" : "pl-[22%]"}
                >
                  <span
                    className={`block leading-[0.88] text-[#141412] ${
                      locale === "th"
                        ? "font-body text-[clamp(2.4rem,9vw,6.5rem)] font-extrabold"
                        : "font-display text-[clamp(3rem,10.5vw,8rem)] font-bold"
                    }`}
                  >
                    {line}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex items-start gap-5">
              <div className="mt-1.5 h-12 w-px shrink-0 bg-[#e3e1da]" aria-hidden />
              <p className="max-w-[40ch] text-[14px] leading-[1.75] text-[#6b6b64] sm:text-[15px]">
                {copy.sub}
              </p>
            </div>

            <div className="mt-8">
              <Link
                href={copy.ctaHref}
                className="btn-primary-soft inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.13em]"
              >
                {copy.cta}
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </div>

            <div className="mt-10 flex gap-8 border-t border-[#e3e1da] pt-7">
              {copy.stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-[1.65rem] font-bold leading-none text-[#141412]">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-[#9a9892]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: floating image cards ── */}
          <div className="hidden lg:block">
            <div className="relative h-[540px]">
              {/* Card 1 — tall left */}
              <div className="absolute bottom-0 left-0 top-10 w-[57%] overflow-hidden rounded-t-[1.5rem] rounded-br-[1.5rem]">
                {images[0] ? (
                  <div className="relative h-full w-full">
                    <Image src={images[0].src} alt={images[0].alt} fill priority sizes="22vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/45" />
                    <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#141412] backdrop-blur-sm">
                      {copy.cardLabels[0]}
                    </span>
                    <p className="absolute inset-x-4 bottom-4 text-[13px] font-semibold leading-snug text-white">
                      {images[0].name}
                    </p>
                  </div>
                ) : (
                  <Placeholder label={copy.cardLabels[0]} variant="hero" className="h-full w-full" />
                )}
              </div>

              {/* Card 2 — top right */}
              <div className="absolute right-0 top-0 h-[47%] w-[41%] overflow-hidden rounded-[1.3rem]">
                {images[1] ? (
                  <div className="relative h-full w-full">
                    <Image src={images[1].src} alt={images[1].alt} fill sizes="16vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/45" />
                    <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-white/80 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#141412] backdrop-blur-sm">
                      {copy.cardLabels[1]}
                    </span>
                    <p className="absolute inset-x-3 bottom-3 text-[12px] font-semibold leading-snug text-white">
                      {images[1].name}
                    </p>
                  </div>
                ) : (
                  <Placeholder label={copy.cardLabels[1]} variant="hero" className="h-full w-full" />
                )}
              </div>

              {/* Card 3 — bottom right */}
              <div className="absolute bottom-0 right-0 h-[47%] w-[41%] overflow-hidden rounded-[1.3rem]">
                {images[2] ? (
                  <div className="relative h-full w-full">
                    <Image src={images[2].src} alt={images[2].alt} fill sizes="16vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/45" />
                    <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-white/80 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#141412] backdrop-blur-sm">
                      {copy.cardLabels[2]}
                    </span>
                    <p className="absolute inset-x-3 bottom-3 text-[12px] font-semibold leading-snug text-white">
                      {images[2].name}
                    </p>
                  </div>
                ) : (
                  <Placeholder label={copy.cardLabels[2]} variant="hero" className="h-full w-full" />
                )}
              </div>

              {/* Gap fill */}
              <div aria-hidden className="absolute right-[41%] top-[47%] h-[6%] w-[3%] bg-[#f8f8f4]" />
              <div aria-hidden className="absolute -right-3 top-6 h-16 w-16 rounded-full border-2 border-[#6e8a50]/20" />
            </div>
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="flex gap-3 overflow-x-auto pb-6 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
            {images.length > 0
              ? images.map((img, i) => (
                  <div key={i} className="relative h-44 w-32 shrink-0 overflow-hidden rounded-[1.1rem]">
                    <Image src={img.src} alt={img.alt} fill sizes="128px" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/45" />
                    <p className="absolute inset-x-2.5 bottom-2.5 text-[11px] font-semibold leading-tight text-white">{img.name}</p>
                  </div>
                ))
              : copy.cardLabels.map((label) => (
                  <div key={label} className="h-44 w-32 shrink-0 overflow-hidden rounded-[1.1rem]">
                    <Placeholder label={label} variant="hero" className="h-full w-full" />
                  </div>
                ))
            }
          </div>
        </div>
      </div>
    </section>
  )
}
