import Image from "next/image"
import Link from "next/link"

import { ArrowRight, BadgeCheck, Clock3, Palette, ShieldCheck } from "lucide-react"

import type { WhyItemView } from "@/app/lib/types/view"

interface WhyChooseUsProps {
  items: WhyItemView[]
  locale: "th" | "en"
}

const COPY = {
  th: {
    eyebrow: "Why 168 Innovative",
    title: "เหตุผลที่แบรนด์ใช้เราเป็นจุดเริ่มต้นของงานแพ็กเกจ",
    summary:
      "จากการคัดรุ่นจนถึงการประสานงาน OEM หน้าแรกควรตอบให้ชัดว่าลูกค้าจะได้อะไรและติดต่ออย่างไรต่อ",
    panelTitle: "พร้อมทำงานตั้งแต่คัดรุ่นถึงเสนอราคา",
    panelBody:
      "ทีมช่วยแนะนำบรรจุภัณฑ์ที่เหมาะกับสินค้า คุมการสื่อสารให้สั้นลง และผลักลูกค้าเข้าสู่ขั้นตอนสั่งตัวอย่างหรือขอราคาได้เร็วขึ้น",
    promises: [
      { icon: Clock3, label: "ตอบกลับไวภายใน 24 ชั่วโมง" },
      { icon: ShieldCheck, label: "ช่วยคัดรุ่นที่เหมาะกับงานจริง" },
      { icon: Palette, label: "รองรับงานปรับสีและโลโก้" },
      { icon: BadgeCheck, label: "ดูแลต่อเนื่องจนถึงเริ่มผลิต" },
    ],
    cta: "ติดต่อทีมขาย",
  },
  en: {
    eyebrow: "Why 168 Innovative",
    title: "Why brands start their packaging search here",
    summary:
      "The homepage should answer what the company does well, how it supports OEM work, and where customers can move next without friction.",
    panelTitle: "Built for faster selection and quotation flow",
    panelBody:
      "The team helps narrow suitable packaging options, reduce back-and-forth, and move customers toward sample review or quote requests faster.",
    promises: [
      { icon: Clock3, label: "Quote response within 24 hours" },
      { icon: ShieldCheck, label: "Product guidance grounded in real use cases" },
      { icon: Palette, label: "Color and logo customization support" },
      { icon: BadgeCheck, label: "Sales follow-through into production" },
    ],
    cta: "Contact sales",
  },
} as const

export default function WhyChooseUs({ items, locale }: WhyChooseUsProps) {
  if (!items.length) return null

  const copy = COPY[locale]
  const contactHref = locale === "en" ? "/en/contact" : "/contact"

  return (
    <section className="relative z-10 mx-auto max-w-7xl overflow-hidden px-4 py-12 sm:px-5 lg:py-14">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <div className="glass-frosted rounded-4xl p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8d6070]">
            {copy.eyebrow}
          </p>
          <h2
            className={`mt-3 max-w-[24ch] text-[#1f2430] ${
              locale === "th"
                ? "font-body text-[clamp(1.35rem,2.2vw,1.95rem)] font-extrabold leading-[1.28]"
                : "font-heading text-[clamp(1.8rem,3vw,2.9rem)] font-black leading-[1.04]"
            }`}
          >
            {copy.title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-[15px]">
            {copy.summary}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {items.slice(0, 4).map((item) => (
              <article
                key={item.title}
                className="glass-frosted rounded-3xl p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#f4f6f8]">
                    {item.image?.src ? (
                      <Image
                        src={item.image.src}
                        alt={item.image.alt || item.title}
                        fill
                        sizes="56px"
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#8d6070]">
                        <BadgeCheck className="h-5 w-5" strokeWidth={1.8} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold leading-5 text-[#1f2430]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-6 text-neutral-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-[linear-gradient(160deg,#2d3340_0%,#151922_100%)] p-6 text-white shadow-[0_20px_44px_rgba(21,25,34,0.24)] sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
            {copy.panelTitle}
          </p>
          <p className="mt-4 text-sm leading-7 text-white/72 sm:text-[15px]">
            {copy.panelBody}
          </p>

          <div className="mt-6 space-y-3">
            {copy.promises.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.05] px-4 py-3"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/[0.08] text-[#f2c06b]">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <span className="text-sm text-white/[0.82]">{label}</span>
              </div>
            ))}
          </div>

          <Link
            href={contactHref}
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#f2c06b] transition-opacity hover:opacity-80"
          >
            {copy.cta}
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  )
}
