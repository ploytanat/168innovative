"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { uiText } from "@/app/lib/i18n/ui"
import { CategoryView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

import { CONTAINER, HOME, SECTION_HEADING } from "./home-theme"

export default function CategorySection({ items = [], locale }: { items: CategoryView[]; locale: "th" | "en" }) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = gridRef.current
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

  if (items.length === 0) return null

  return (
    <section className="relative py-12 sm:py-16" style={{ background: HOME.surface, borderTop: `1px solid ${HOME.line}` }}>
      <div className={`${CONTAINER} text-center`}>
        <h2 className={`font-display ${SECTION_HEADING} text-[clamp(1.75rem,1.2rem+1.8vw,2.5rem)] font-bold normal-case`} style={{ color: HOME.ink }}>
          {uiText.categories.title[locale]}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-[1.7] sm:text-[16px] lg:text-[17px]" style={{ color: HOME.inkMid }}>
          {locale === "th" ? "เลือกดูบรรจุภัณฑ์ตามกลุ่มสินค้าที่ต้องการ" : "Browse our packaging by product group."}
        </p>

        <div ref={gridRef} className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-x-5 sm:gap-y-8 lg:mt-10 lg:gap-x-6 lg:gap-y-10">
          {items.slice(0, 8).map((item, i) => (
            <Link key={item.id} href={withLocalePath(`/categories/${item.slug}`, locale)}
              className={`group flex flex-col items-center gap-3 ${revealed ? "motion-reduce:animate-none animate-[portfolio-reveal_650ms_cubic-bezier(0.16,1,0.3,1)_both]" : ""}`}
              style={revealed ? { animationDelay: `${(i % 4) * 70}ms` } : undefined}
            >
              <div className="relative aspect-square w-full max-w-[260px] overflow-hidden rounded-xl transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1.5 group-hover:shadow-(--shadow-sm)"
                style={{ border: `1px solid ${HOME.line}`, background: HOME.mint }}>
                {item.image?.src ? (
                  <Image src={item.image.src} alt={item.image.alt || ""} fill sizes="(max-width:640px) 42vw, (max-width:1024px) 22vw, 260px" className="object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-3xl font-bold" style={{ color: HOME.mintInk }}>
                    {item.name.charAt(0)}
                  </span>
                )}
              </div>
              <span className="text-[15px] font-bold leading-relaxed tracking-wide sm:text-[16px]" style={{ color: HOME.ink }}>
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        <Link href={withLocalePath("/categories", locale)}
          className="mt-8 inline-block text-[14px] font-bold uppercase tracking-[0.04em] transition-colors hover:opacity-70"
          style={{ color: HOME.inkSoft }}>
          {uiText.categories.viewAll[locale]} →
        </Link>
      </div>
    </section>
  )
}
