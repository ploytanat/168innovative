"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RecentlyViewedItem {
  slug: string
  categorySlug: string
  name: string
  imageSrc: string
  imageAlt: string
  href: string
  savedAt: number
}

const STORAGE_KEY = "rv-products"
const MAX_ITEMS = 8

// ─── Helpers (called client-side only) ────────────────────────────────────────

export function saveRecentlyViewed(item: Omit<RecentlyViewedItem, "savedAt">) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const existing: RecentlyViewedItem[] = raw ? JSON.parse(raw) : []
    const filtered = existing.filter((i) => i.slug !== item.slug)
    const next = [{ ...item, savedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {}
}

// ─── Copy ─────────────────────────────────────────────────────────────────────

const copy = {
  th: { title: "สินค้าที่เพิ่งดู", viewAll: "ดูทั้งหมด" },
  en: { title: "Recently Viewed", viewAll: "View All" },
} as const

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  locale: "th" | "en"
  currentSlug?: string
}

export default function RecentlyViewed({ locale, currentSlug }: Props) {
  const t = copy[locale]
  const [items, setItems] = useState<RecentlyViewedItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const all: RecentlyViewedItem[] = JSON.parse(raw)
      setItems(all.filter((i) => i.slug !== currentSlug))
    } catch {}
  }, [currentSlug])

  if (items.length === 0) return null

  return (
    <section className="mt-12" aria-label={t.title}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">{t.title}</h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {items.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            prefetch={false}
            className="group flex w-36 shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative aspect-square overflow-hidden bg-slate-100">
              <Image
                src={item.imageSrc || "/placeholder.jpg"}
                alt={item.imageAlt}
                fill
                sizes="144px"
                className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-2.5">
              <p className="line-clamp-2 text-xs font-semibold leading-snug text-slate-800">
                {item.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
