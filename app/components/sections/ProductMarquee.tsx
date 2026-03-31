'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import type { ProductView } from '@/app/lib/types/view'
import { withLocalePath } from '@/app/lib/utils/withLocalePath'

type Locale = 'th' | 'en'
type TabKey = 'all' | 'spout' | 'cosmetic' | 'oem'

const COPY = {
  th: {
    eyebrow: 'สินค้าเด่น',
    title: 'สินค้าขายดี\nที่ลูกค้าเลือกมากที่สุด',
    viewAll: 'ดูสินค้าทั้งหมด',
    detail: 'รายละเอียด',
    tabs: {
      all: 'ทั้งหมด',
      spout: 'Spout',
      cosmetic: 'Cosmetic',
      oem: 'OEM',
    },
    badges: {
      new: 'ใหม่',
      hot: 'ขายดี',
      best: 'ยอดนิยม',
    },
  },
  en: {
    eyebrow: 'Featured Products',
    title: 'Best Sellers\nChosen by Clients',
    viewAll: 'View All Products',
    detail: 'Details',
    tabs: {
      all: 'All',
      spout: 'Spout',
      cosmetic: 'Cosmetic',
      oem: 'OEM',
    },
    badges: {
      new: 'New',
      hot: 'Hot',
      best: 'Best',
    },
  },
} as const

const CARD_BACKGROUNDS = ['#fdeef0', '#e4f5f0', '#ede8f8', '#fdf0e4'] as const

function getProductHref(item: ProductView, locale: Locale) {
  return withLocalePath(`/categories/${item.categorySlug}/${item.slug}`, locale)
}

function resolveTab(item: ProductView): Exclude<TabKey, 'all'> {
  if (item.categorySlug === 'spout') return 'spout'
  if (
    ['lipstick-packaging', 'mascara-packaging', 'powder-compact'].includes(
      item.categorySlug
    )
  ) {
    return 'cosmetic'
  }
  return 'oem'
}

export default function ProductMarquee({
  items,
  locale,
}: {
  items: ProductView[]
  locale: Locale
}) {
  const copy = COPY[locale]
  const [activeTab, setActiveTab] = useState<TabKey>('all')

  const filteredItems = useMemo(() => {
    const source =
      activeTab === 'all'
        ? items
        : items.filter((item) => resolveTab(item) === activeTab)
    return source.slice(0, 4)
  }, [activeTab, items])

  if (!items.length) return null

  const tabs: TabKey[] = ['all', 'spout', 'cosmetic', 'oem']

  return (
    <section id="products" className="bg-white py-20">
      <div className="mx-auto max-w-[1180px] px-6 md:px-10">
        <div>
          <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.18em] text-[#c96870]">
            {copy.eyebrow}
          </span>
          <h2 className="whitespace-pre-line text-[clamp(26px,3.5vw,38px)] font-bold leading-[1.25] text-[#2e2820]">
            {copy.title}
          </h2>
        </div>

        <div className="mt-7 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = activeTab === tab
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="rounded-full border px-4 py-2 text-[14px] font-medium transition"
                style={{
                  borderColor: active ? '#c96870' : 'rgba(180,150,140,.15)',
                  background: active ? '#c96870' : '#fff',
                  color: active ? '#fff' : '#6e6558',
                }}
              >
                {copy.tabs[tab]}
              </button>
            )
          })}
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {filteredItems.map((item, index) => {
            const tab = resolveTab(item)
            const badge =
              index === 0 ? copy.badges.new : index === 1 ? copy.badges.best : index === 2 ? copy.badges.hot : null

            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-[rgba(180,150,140,.15)] bg-[#faf8f5] transition hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(150,110,100,.10)]"
              >
                <div
                  className="relative h-[170px] overflow-hidden"
                  style={{ background: CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length] }}
                >
                  {badge && (
                    <div
                      className="absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                      style={{
                        background:
                          badge === copy.badges.new
                            ? '#c96870'
                            : badge === copy.badges.best
                              ? '#6bbfa8'
                              : '#e8a870',
                        color: '#fff',
                      }}
                    >
                      {badge}
                    </div>
                  )}
                  <Image
                    src={item.image.src}
                    alt={item.image.alt || item.name}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 25vw"
                    className="object-contain p-6"
                  />
                </div>

                <div className="p-4">
                  <div className="mb-1 text-[11.5px] uppercase tracking-[0.06em] text-[#aea49a]">
                    {tab === 'spout' ? 'Spout' : tab === 'cosmetic' ? 'Cosmetic' : 'OEM'}
                  </div>
                  <div className="line-clamp-2 text-[15.5px] font-bold leading-[1.35] text-[#2e2820]">
                    {item.name}
                  </div>
                  <div className="mt-1 line-clamp-2 text-[13px] text-[#6e6558]">
                    {item.description}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[rgba(180,150,140,.15)] px-4 py-3">
                  <span className="text-[12px] text-[#aea49a]">
                    {item.availabilityStatus || (tab === 'cosmetic' ? 'Cosmetic Grade' : 'Food Grade')}
                  </span>
                  <Link
                    href={getProductHref(item, locale)}
                    className="text-[13px] font-semibold text-[#c96870]"
                  >
                    {copy.detail} →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-9 text-center">
          <Link
            href={withLocalePath('/categories', locale)}
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(180,150,140,.15)] bg-white px-6 py-3.5 text-[15px] font-medium text-[#6e6558] transition hover:-translate-y-0.5 hover:border-[#e8939a] hover:text-[#c96870]"
          >
            {copy.viewAll} →
          </Link>
        </div>
      </div>
    </section>
  )
}
