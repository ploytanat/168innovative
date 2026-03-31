'use client'

import Image from 'next/image'

import type { WhyItemView } from '@/app/lib/types/view'

const CARD_COLORS = [
  { bg: '#fdeef0', accent: '#c96870', icon: '🏷️' },
  { bg: '#e4f5f0', accent: '#6bbfa8', icon: '✅' },
  { bg: '#ede8f8', accent: '#9e8ec4', icon: '🏭' },
  { bg: '#fdf0e4', accent: '#e8a870', icon: '🚀' },
] as const

const COPY = {
  th: {
    eyebrow: 'ทำไมต้องเลือกเรา',
    title: '4 เหตุผลที่ลูกค้าไว้วางใจ\n168 Innovative',
    desc: 'เราไม่ได้แค่ขายสินค้า แต่เราเป็นพาร์ทเนอร์ที่คุณไว้ใจได้ในทุกขั้นตอน',
  },
  en: {
    eyebrow: 'Why Choose Us',
    title: '4 Reasons Clients Trust\n168 Innovative',
    desc: 'We are not just a supplier. We are a packaging partner that supports your business end to end.',
  },
} as const

export default function WhyChooseUs({
  items,
  locale,
}: {
  items: WhyItemView[]
  locale: 'th' | 'en'
}) {
  if (!items.length) return null

  const copy = COPY[locale]
  const displayItems = items.slice(0, 4)

  return (
    <section className="bg-white py-20">
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

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {displayItems.map((item, index) => {
            const style = CARD_COLORS[index % CARD_COLORS.length]

            return (
              <div
                key={`${item.title}-${index}`}
                className="rounded-2xl border border-[rgba(180,150,140,.15)] bg-[#faf8f5] px-6 py-7 transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(150,110,100,.10)]"
              >
                <div
                  className="mb-5 grid h-[52px] w-[52px] place-items-center rounded-[14px] text-[26px]"
                  style={{ background: style.bg, color: style.accent }}
                >
                  {item.image?.src ? (
                    <div className="relative h-7 w-7">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt || item.title}
                        fill
                        sizes="28px"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span>{style.icon}</span>
                  )}
                </div>
                <div className="text-[17px] font-bold text-[#2e2820]">{item.title}</div>
                <div className="mt-2 text-[14.5px] leading-7 text-[#6e6558]">{item.description}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
