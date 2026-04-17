import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { withLocalePath } from "@/app/lib/utils/withLocalePath"

type Locale = "th" | "en"

const COPY = {
  th: {
    eyebrow: "เพิ่งเริ่มต้น?",
    title: "ครั้งแรกกับ OEM / ODM?",
    body: "ทีมงานช่วยแนะนำตั้งแต่เลือกรุ่นสินค้า ปรับสเปก จนถึงขอตัวอย่างและเริ่มผลิต",
    cta: "ดูสินค้าทั้งหมด",
    ctaSecond: "ติดต่อทีมขาย",
    points: ["เลือกรุ่นที่เหมาะกับสินค้า", "รับใบเสนอราคาใน 24 ชม.", "ขอตัวอย่างได้ฟรี"],
  },
  en: {
    eyebrow: "Just getting started?",
    title: "First time with OEM / ODM?",
    body: "Our team guides you from product selection and spec adjustments through samples and into production.",
    cta: "Browse Products",
    ctaSecond: "Talk to Sales",
    points: ["Find the right format", "Quote within 24 hours", "Free sample review"],
  },
} as const

export default function FirstTimeBanner({ locale }: { locale: Locale }) {
  const copy = COPY[locale]

  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
      <div className="overflow-hidden rounded-3xl bg-[#141412]">
        <div className="grid items-center gap-8 px-8 py-10 sm:px-10 lg:grid-cols-[1fr_auto] lg:gap-16 lg:py-12">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#6e8a50]">
              {copy.eyebrow}
            </p>

            <h2
              className={`text-white ${
                locale === "th"
                  ? "font-body text-[clamp(1.5rem,3.5vw,2.4rem)] font-extrabold leading-[1.2]"
                  : "font-display text-[clamp(1.8rem,4vw,2.9rem)] font-bold leading-[1.05]"
              }`}
            >
              {copy.title}
            </h2>

            <p className="mt-3 max-w-[52ch] text-[14px] leading-[1.75] text-white/55">
              {copy.body}
            </p>

            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              {copy.points.map((pt) => (
                <li key={pt} className="flex items-center gap-2 text-[12px] font-semibold text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#6e8a50]" aria-hidden />
                  {pt}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex shrink-0 flex-col gap-3 lg:items-end">
            <Link
              href={withLocalePath("/categories", locale)}
              className="inline-flex items-center gap-2 rounded-full bg-[#4c6b35] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.13em] text-white transition-all duration-200 hover:bg-[#5a7e40] hover:-translate-y-0.5"
            >
              {copy.cta}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
            </Link>

            <Link
              href={withLocalePath("/contact", locale)}
              className="inline-flex items-center gap-2 rounded-full border border-white/18 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.13em] text-white/75 transition-all duration-200 hover:border-white/35 hover:text-white"
            >
              {copy.ctaSecond}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
