"use client"

import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import type { ProductView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

import { CONTAINER, HOME, SECTION_HEADING } from "./home-theme"

type Locale = "th" | "en"

const COPY = {
  th: {
    heading: "สินค้าของเรา",
    description: "บางส่วนของสินค้าที่เราออกแบบและดูแลการผลิต",
    viewAll: "ดูสินค้าทั้งหมด",
  },
  en: {
    heading: "Our products",
    description: "A selection of the packaging we design and coordinate production for.",
    viewAll: "View all products",
  },
} as const

export default function PortfolioGrid({ items, locale }: { items: ProductView[]; locale: Locale }) {
  const visible = items.slice(0, 6)
  const listRef = useRef<HTMLUListElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = listRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true)
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (visible.length === 0) return null

  const t = COPY[locale]

  return (
    <section className="relative py-12 sm:py-16" style={{ background: HOME.surface }}>
      <div className={CONTAINER}>
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6 lg:mb-12">
          <div className="max-w-xl">
            <h2
              lang={locale}
              className={`font-display ${SECTION_HEADING} text-[clamp(1.75rem,1.2rem+1.8vw,2.5rem)] font-bold normal-case`}
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

        <ul
          ref={listRef}
          className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 lg:gap-x-6"
        >
          {visible.map((item, i) => {
            const href = withLocalePath(`/categories/${item.categorySlug}/${item.slug}`, locale)
            return (
              <li
                key={item.id}
                className={
                  revealed
                    ? "motion-reduce:animate-none animate-[portfolio-reveal_650ms_cubic-bezier(0.16,1,0.3,1)_both]"
                    : undefined
                }
                style={revealed ? { animationDelay: `${i * 60}ms` } : undefined}
              >
                <Link href={href} className="group block">
                  <div
                    className="relative aspect-square overflow-hidden rounded-xl transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1.5 group-hover:shadow-(--shadow-sm)"
                    style={{ background: HOME.mintSoft, border: `1px solid ${HOME.line}` }}
                  >
                    <Image
                      src={item.image.src}
                      alt={item.image.alt || ""}
                      fill
                      sizes="(max-width:640px) 48vw, (max-width:1024px) 32vw, 380px"
                      className="object-cover transition-transform duration-600 ease-out group-hover:scale-[1.04]"
                      style={{ filter: "saturate(0.88)" }}
                    />
                    {/* Leaf tonal wash — unifies mixed studio backgrounds. Fades on hover. */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
                      style={{ background: "rgba(124, 179, 66, 0.08)", mixBlendMode: "multiply" }}
                    />
                    {/* Signature round arrow — bottom-right, slides on hover */}
                    <span
                      aria-hidden
                      className="tile-arrow-glass absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1 sm:bottom-3 sm:right-3 sm:h-9 sm:w-9"
                    >
                      <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.5} />
                    </span>
                  </div>
                  <p
                    className="font-display mt-4 line-clamp-2 text-[14px] font-semibold leading-relaxed tracking-wide sm:text-[15px]"
                    style={{ color: HOME.ink }}
                  >
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
