import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import Placeholder from "@/app/components/ui/Placeholder"
import type { CategoryView, HeroSlideView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

type Locale = "th" | "en"

interface HeroSectionProps {
  slides: HeroSlideView[]
  categories: CategoryView[]
  locale: Locale
}

interface HeroCardData {
  key: string
  href: string
  image?: {
    src: string
    alt: string
  }
  badge: string
  title: string
  description: string
}

const COPY = {
  en: {
    eyebrow: "168 Innovative Co., Ltd.",
    lines: ["PRECISION", "COSMETIC", "PACKAGING"],
    sub: "Full OEM / ODM support from sample selection through production-ready delivery.",
    cta: "Browse Catalog",
    ctaHref: "/en/categories",
    stats: [
      { value: "500+", label: "Partner brands" },
      { value: "10+", label: "Years in industry" },
      { value: "24h", label: "Quote turnaround" },
    ],
    cardLabels: ["Flagship Pick", "Top Seller", "OEM Ready"],
    fallbackCardDescription:
      "Explore packaging styles, materials, and production options tailored for this product line.",
    readMore: "Read more",
  },
  th: {
    eyebrow: "168 Innovative Co., Ltd.",
    lines: ["บรรจุภัณฑ์", "เครื่องสำอาง", "คุณภาพพรีเมียม"],
    sub: "OEM / ODM ครบวงจร ตั้งแต่เลือกสินค้าตัวอย่างไปจนถึงขั้นตอนการผลิตพร้อมส่งมอบ",
    cta: "ดูสินค้าทั้งหมด",
    ctaHref: "/categories",
    stats: [
      { value: "500+", label: "แบรนด์คู่ค้า" },
      { value: "10+", label: "ปีในอุตสาหกรรม" },
      { value: "24h", label: "ตอบกลับใบเสนอราคา" },
    ],
    cardLabels: ["สินค้าเด่น", "ขายดี", "พร้อม OEM"],
    fallbackCardDescription:
      "ดูรายละเอียดรูปแบบบรรจุภัณฑ์ วัสดุ และทางเลือกการผลิตที่เหมาะกับหมวดสินค้านี้",
    readMore: "Read more",
  },
} as const

function trimText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 3).trimEnd()}...`
}

function getCards(
  slides: HeroSlideView[],
  categories: CategoryView[],
  locale: Locale
) {
  const copy = COPY[locale]

  const fromSlides: HeroCardData[] = slides.slice(0, 3).map((slide, index) => ({
    key: `slide-${slide.id}`,
    href: slide.ctaPrimary?.href || "/categories",
    image: slide.image?.src ? { src: slide.image.src, alt: slide.image.alt } : undefined,
    badge: copy.cardLabels[index] || slide.badge.text,
    title: trimText(slide.title, 56),
    description: trimText(slide.description, 120),
  }))

  if (fromSlides.length >= 2) return fromSlides

  const fromCategories: HeroCardData[] = categories
    .filter((category) => category.image?.src)
    .slice(0, 3)
    .map((category, index) => ({
      key: `category-${category.id}`,
      href: `/categories/${category.slug}`,
      image: category.image?.src
        ? { src: category.image.src, alt: category.image.alt }
        : undefined,
      badge:
        copy.cardLabels[fromSlides.length + index] ||
        copy.cardLabels[copy.cardLabels.length - 1],
      title: trimText(category.name, 56),
      description: trimText(
        category.description || copy.fallbackCardDescription,
        120
      ),
    }))

  return [...fromSlides, ...fromCategories].slice(0, 3)
}

function HeroCard({
  card,
  locale,
  readMoreLabel,
}: {
  card: HeroCardData
  locale: Locale
  readMoreLabel: string
}) {
  return (
    <Link
      href={withLocalePath(card.href, locale)}
      className="group flex flex-col items-center rounded-base border border-default bg-neutral-primary-soft p-6 shadow-xs transition-colors duration-200 hover:bg-white md:max-w-xl md:flex-row"
    >
      <div className="relative mb-4 aspect-square h-64 w-full shrink-0 overflow-hidden rounded-base bg-neutral-secondary-soft md:mb-0 md:h-auto md:w-48">
        {card.image ? (
          <Image
            src={card.image.src}
            alt={card.image.alt}
            fill
            sizes="(min-width: 768px) 192px, 100vw"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <Placeholder label={card.badge} variant="hero" className="h-full w-full" />
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between leading-normal md:p-4">
        <div>
          <h3 className="mb-2 text-2xl font-bold tracking-tight text-heading">
            {card.title}
          </h3>
          <p className="mb-6 text-body">
            {card.description}
          </p>
        </div>

        <div>
          <span className="inline-flex w-auto items-center rounded-base border border-default-medium bg-neutral-secondary-medium px-4 py-2.5 text-sm font-medium leading-5 text-body shadow-xs transition-colors duration-200 group-hover:bg-neutral-tertiary-medium group-hover:text-heading">
            {readMoreLabel}
            <ArrowRight className="ms-1.5 h-4 w-4 rtl:rotate-180" strokeWidth={2} />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function HeroSection({ slides, categories, locale }: HeroSectionProps) {
  const copy = COPY[locale]
  const cards = getCards(slides, categories, locale)

  return (
    <section
      aria-label={locale === "th" ? "แนะนำบรรจุภัณฑ์" : "Featured packaging"}
      className="relative overflow-hidden bg-[#f8f8f4] px-4 pb-0 pt-8 sm:px-6 sm:pt-12 lg:pt-14"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_42%] lg:gap-0">
          <div className="pb-10 lg:pb-14">
            <p className="mb-6 inline-flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#4c6b35]">
              <span className="h-px w-10 bg-[#6e8a50]" />
              {copy.eyebrow}
            </p>

            <div className="space-y-0">
              {copy.lines.map((line, index) => (
                <div
                  key={line}
                  className={
                    index === 0 ? "pl-0" : index === 1 ? "pl-[11%]" : "pl-[22%]"
                  }
                >
                  <span
                    className={`block leading-[0.88] text-[#141412] ${
                      locale === "th"
                        ? "font-heading text-[clamp(2.6rem,9vw,6.5rem)] font-black"
                        : "font-display text-[clamp(3rem,10.5vw,8rem)] font-extrabold"
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
              {copy.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-[1.75rem] font-extrabold leading-none tracking-[-0.03em] text-[#141412]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold tracking-[0.04em] text-[#9a9892]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block lg:pl-10">
            <div className="space-y-5 pb-10 lg:pb-14">
              {cards.map((card) => (
                <HeroCard
                  key={card.key}
                  card={card}
                  locale={locale}
                  readMoreLabel={copy.readMore}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-6 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
            {cards.map((card) => (
              <div key={card.key} className="w-[22rem] shrink-0">
                <HeroCard
                  card={card}
                  locale={locale}
                  readMoreLabel={copy.readMore}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
