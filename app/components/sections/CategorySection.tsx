import Image from 'next/image'
import Link from 'next/link'

import type { CategoryView } from '@/app/lib/types/view'
import { withLocalePath } from '@/app/lib/utils/withLocalePath'

const COLOR_STYLES = [
  { bg: '#fdeef0', accent: '#c96870' },
  { bg: '#e4f5f0', accent: '#6bbfa8' },
  { bg: '#ede8f8', accent: '#9e8ec4' },
  { bg: '#fdf0e4', accent: '#e8a870' },
  { bg: '#e4f0fc', accent: '#6aaae0' },
  { bg: '#fdeef0', accent: '#c96870' },
] as const

const COPY = {
  th: {
    eyebrow: 'หมวดหมู่สินค้า',
    title: 'เลือกสินค้าตามประเภท\nที่คุณต้องการ',
    desc: 'สินค้าครอบคลุมทุกความต้องการ ทั้งบรรจุภัณฑ์เครื่องสำอาง อาหาร และอุตสาหกรรม',
    cta: 'ดูสินค้า',
  },
  en: {
    eyebrow: 'Product Categories',
    title: 'Browse by Category\nfor Your Next Project',
    desc: 'Explore packaging collections across cosmetics, food, and industrial use.',
    cta: 'Explore',
  },
} as const

export default function CategorySection({
  items = [],
  locale,
}: {
  items: CategoryView[]
  locale: 'th' | 'en'
}) {
  if (!items.length) return null

  const copy = COPY[locale]
  const displayItems = items.slice(0, 6)

  return (
    <section id="categories" className="py-20">
      <div className="mx-auto max-w-[1180px] px-6 md:px-10">
        <div>
          <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.18em] text-[#c96870]">
            {copy.eyebrow}
          </span>
          <h2 className="whitespace-pre-line text-[clamp(26px,3.5vw,38px)] font-bold leading-[1.25] text-[#2e2820]">
            {copy.title}
          </h2>
          <p className="mt-3 max-w-[560px] text-[16px] leading-8 text-[#6e6558]">
            {copy.desc}
          </p>
        </div>

        <div className="mt-12 grid gap-[18px] md:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item, index) => {
            const style = COLOR_STYLES[index % COLOR_STYLES.length]
            return (
              <Link
                key={item.id}
                href={withLocalePath(`/categories/${item.slug}`, locale)}
                className="group flex flex-col gap-3 rounded-2xl border border-[rgba(180,150,140,.15)] bg-white p-6 text-inherit no-underline transition hover:-translate-y-1 hover:border-[#f5d0d4] hover:shadow-[0_16px_36px_rgba(150,110,100,.10)]"
              >
                <div className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#aea49a]">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div
                  className="grid h-[54px] w-[54px] place-items-center overflow-hidden rounded-[14px]"
                  style={{ background: style.bg }}
                >
                  {item.image?.src ? (
                    <div className="relative h-8 w-8">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt || item.name}
                        fill
                        sizes="32px"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="text-[28px]">📦</span>
                  )}
                </div>
                <div className="text-[18px] font-bold text-[#2e2820]">{item.name}</div>
                <div className="flex-1 text-[14px] leading-7 text-[#6e6558]">{item.description}</div>
                <div
                  className="inline-flex items-center gap-2 text-[13.5px] font-semibold transition-[gap] group-hover:gap-3"
                  style={{ color: style.accent }}
                >
                  {copy.cta} <span aria-hidden>→</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
