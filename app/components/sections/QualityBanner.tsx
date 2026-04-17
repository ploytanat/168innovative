import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import Placeholder from "@/app/components/ui/Placeholder"
import type { CompanyView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

type Locale = "th" | "en"

const COPY = {
  th: {
    eyebrow: "คุณภาพที่พิสูจน์แล้ว",
    lines: ["คุณภาพสูงสุด", "ยืนยันโดย", "ลูกค้าของเรา"],
    body: "บรรจุภัณฑ์ทุกชิ้นผ่านการคัดสรรและทดสอบโดยทีมผู้เชี่ยวชาญ เพื่อให้แบรนด์ของคุณโดดเด่นและน่าเชื่อถือ",
    cta: "ขอใบเสนอราคา",
    trust: ["ISO Certified Materials", "500+ Partner Brands", "10+ Years Experience"],
  },
  en: {
    eyebrow: "Proven quality",
    lines: ["BEST QUALITY", "BASED ON YOUR", "FEEDBACK"],
    body: "Every packaging format is vetted by our specialist team — so your brand carries the right materials with confidence.",
    cta: "Request a Quote",
    trust: ["ISO Certified Materials", "500+ Partner Brands", "10+ Years Experience"],
  },
} as const

export default function QualityBanner({
  locale,
  company,
}: {
  locale: Locale
  company?: CompanyView | null
}) {
  const copy = COPY[locale]
  const contactImg = company?.contactImage

  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:py-6">
      <div className="overflow-hidden rounded-3xl bg-[#141412]">
        <div className="grid min-h-90 items-stretch lg:grid-cols-[1fr_38%]">

          {/* Left */}
          <div className="flex flex-col justify-between px-8 py-10 sm:px-12 lg:py-12">
            <div>
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#6e8a50]">
                {copy.eyebrow}
              </p>
              <div className="space-y-1">
                {copy.lines.map((line) => (
                  <p
                    key={line}
                    className={`leading-[0.92] text-white ${
                      locale === "th"
                        ? "font-body text-[clamp(1.8rem,5.5vw,4rem)] font-extrabold"
                        : "font-display text-[clamp(2rem,6vw,4.5rem)] font-bold"
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
              <p className="mt-6 max-w-[48ch] text-[14px] leading-[1.75] text-white/55">
                {copy.body}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-5">
              <div className="flex flex-wrap gap-2">
                {copy.trust.map((t) => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold text-white/65">
                    {t}
                  </span>
                ))}
              </div>
              <Link
                href={withLocalePath("/contact", locale)}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-[#4c6b35] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-200 hover:bg-[#5a7e40] hover:-translate-y-0.5"
              >
                {copy.cta}
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
              </Link>
            </div>
          </div>

          {/* Right: image */}
          <div className="relative hidden overflow-hidden lg:block">
            {contactImg?.src ? (
              <Image src={contactImg.src} alt={contactImg.alt ?? "168 Innovative"} fill sizes="38vw" className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-[#1e2118]">
                <div className="space-y-2 text-center opacity-20">
                  {["168", "INN", "OVA", "TIVE"].map((w) => (
                    <p key={w} className="font-display text-[2.2rem] font-bold tracking-[0.35em] text-white">
                      {w}
                    </p>
                  ))}
                </div>
              </div>
            )}
            <div aria-hidden className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-[#141412] to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
