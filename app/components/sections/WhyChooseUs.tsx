import Image from "next/image"
import { Star } from "lucide-react"

import Placeholder from "@/app/components/ui/Placeholder"
import type { WhyItemView } from "@/app/lib/types/view"

interface WhyChooseUsProps {
  items: WhyItemView[]
  locale: "th" | "en"
}

const COPY = {
  th: {
    eyebrow: "ทำไมต้องเรา",
    title: "เหตุผลที่แบรนด์เลือกเรา",
    sub: "จากการคัดรุ่นบรรจุภัณฑ์ ปรับแบบตามแบรนด์ ถึงการประสานงาน OEM ครบวงจร",
    verified: "พาร์ทเนอร์ที่ยืนยันแล้ว",
  },
  en: {
    eyebrow: "Reviews with love",
    title: "Why brands choose us",
    sub: "From packaging selection and brand customization to full OEM coordination — one trusted partner.",
    verified: "Verified Partner",
  },
} as const

function StarRow({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5"
          strokeWidth={0}
          fill={i < n ? "#4c6b35" : "#e3e1da"}
        />
      ))}
    </div>
  )
}

function ReviewCard({ item, index, locale }: { item: WhyItemView; index: number; locale: "th" | "en" }) {
  const copy = COPY[locale]
  return (
    <article className="flex flex-col gap-4 rounded-[1.1rem] border border-[#e3e1da] bg-white p-5 sm:p-6">
      <StarRow n={5} />
      <p className="flex-1 text-[14px] leading-[1.75] text-[#4a4944]">
        {item.description}
      </p>
      <div className="flex items-center gap-3 border-t border-[#f0efeb] pt-4">
        {item.image?.src ? (
          <div className="relative h-9 w-9 overflow-hidden rounded-full border border-[#e3e1da]">
            <Image src={item.image.src} alt={item.image.alt ?? item.title} fill sizes="36px" className="object-cover" />
          </div>
        ) : (
          <Placeholder label={item.title} variant="person" className="h-9 w-9 rounded-full" />
        )}
        <div>
          <p className="text-[13px] font-bold leading-tight text-[#141412]">{item.title}</p>
          <p className="text-[11px] text-[#4c6b35]">{copy.verified}</p>
        </div>
      </div>
    </article>
  )
}

export default function WhyChooseUs({ items, locale }: WhyChooseUsProps) {
  if (!items.length) return null
  const copy = COPY[locale]

  return (
    <section
      aria-labelledby="why-heading"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14"
    >
      <div className="mb-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#4c6b35]">
          {copy.eyebrow}
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h2
            id="why-heading"
            className={`text-[#141412] ${
              locale === "th"
                ? "font-heading text-[clamp(1.5rem,2.5vw,2.1rem)] font-black"
                : "font-display text-[clamp(1.7rem,2.8vw,2.5rem)] font-extrabold"
            }`}
          >
            {copy.title}
          </h2>
          <p className="max-w-[52ch] text-[14px] leading-relaxed text-[#6b6b64]">
            {copy.sub}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
        {items.slice(0, 3).map((item, i) => (
          <ReviewCard key={item.title} item={item} index={i} locale={locale} />
        ))}
      </div>
    </section>
  )
}
