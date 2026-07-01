import Image from "next/image"
import Link from "next/link"

import type { ProductView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

import { CONTAINER, HOME, SECTION_HEADING } from "./home-theme"

type Locale = "th" | "en"

const COPY = {
  th: {
    eyebrow: "ผลงานของเรา",
    heading: "ผลงานการออกแบบบรรจุภัณฑ์",
    description: "ตัวอย่างงานที่ทีมเราออกแบบและผลิตให้กับแบรนด์ต่างๆ",
    viewAll: "ดูผลงานทั้งหมด",
  },
  en: {
    eyebrow: "Our work",
    heading: "Portfolio of packaging design",
    description: "A selection of work our team has designed and produced for client brands.",
    viewAll: "View all work",
  },
} as const

export default function PortfolioGrid({ items, locale }: { items: ProductView[]; locale: Locale }) {
  const visible = items.slice(0, 6)
  if (visible.length === 0) return null

  const t = COPY[locale]

  return (
    <section className="relative py-12 sm:py-16" style={{ background: HOME.surface }}>
      <div className={CONTAINER}>
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6 lg:mb-12">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: HOME.mintInk }}>
              {t.eyebrow}
            </p>
            <h2
              lang={locale}
              className={`font-display ${SECTION_HEADING} mt-3 text-[clamp(1.75rem,1.2rem+1.8vw,2.5rem)] font-bold normal-case`}
              style={{ color: HOME.ink }}
            >
              {t.heading}
            </h2>
            <p className="mt-3 text-[15px] leading-[1.7] sm:text-[16px] lg:text-[17px]" style={{ color: HOME.inkMid }}>
              {t.description}
            </p>
          </div>
          <Link
            href={withLocalePath("/categories", locale)}
            className="shrink-0 text-[14px] font-semibold transition-colors hover:opacity-70"
            style={{ color: HOME.mintInk }}
          >
            {t.viewAll} →
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:gap-5">
          {visible.map(item => {
            const href = withLocalePath(`/categories/${item.categorySlug}/${item.slug}`, locale)
            return (
              <li key={item.id}>
                <Link href={href} className="group block">
                  <div
                    className="relative aspect-[4/5] overflow-hidden rounded-lg"
                    style={{ background: HOME.mintSoft, border: `1px solid ${HOME.line}` }}
                  >
                    <Image
                      src={item.image.src}
                      alt={item.image.alt || item.name}
                      fill
                      sizes="(max-width:640px) 48vw, (max-width:1024px) 32vw, 380px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 line-clamp-1 text-[15px] font-semibold transition-colors sm:text-[16px]" style={{ color: HOME.ink }}>
                    {item.name}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
