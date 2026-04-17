import Link from "next/link"

import type { CompanyView } from "@/app/lib/types/view"

interface ContactSectionProps {
  data: CompanyView
  locale: "th" | "en"
}

const BRANDS = ["COSMAX", "Interpack", "Thai Beauty", "BrandLab TH", "PackPro", "CosmoLine"]

const COPY = {
  th: {
    trusted: "แบรนด์และพาร์ทเนอร์ที่ร่วมงานกับเรา",
    title: "พร้อมเริ่มต้นกับเราแล้วหรือยัง?",
    body: "บอกสเปค รับใบเสนอราคา เริ่มผลิต — ง่ายในขั้นตอนเดียว",
    steps: [
      { num: "01", label: "แจ้งสเปคและปริมาณ" },
      { num: "02", label: "รับใบเสนอราคาใน 24 ชม." },
      { num: "03", label: "ดูตัวอย่างสินค้าฟรี" },
      { num: "04", label: "ยืนยันและเริ่มผลิต" },
    ],
    quote: "ขอใบเสนอราคาเลย",
    line: "LINE @168innovative",
    call: "โทรหาทีมเซลส์",
  },
  en: {
    trusted: "Trusted by our customers and partners",
    title: "Ready to start your project?",
    body: "Share your specs, get a quote, and move into production — one simple step.",
    steps: [
      { num: "01", label: "Share specs & quantity" },
      { num: "02", label: "Receive quote within 24 hrs" },
      { num: "03", label: "Review free sample" },
      { num: "04", label: "Confirm & start production" },
    ],
    quote: "Request a Quote",
    line: "LINE @168innovative",
    call: "Call Sales",
  },
} as const

export default function ContactSection({ data, locale }: ContactSectionProps) {
  const copy = COPY[locale]
  const contactHref = locale === "en" ? "/en/contact" : "/contact"
  const lineUrl = data.socials.find((s) => s.type === "line")?.url
  const primaryPhone = data.phones[0]?.number

  return (
    <>
      {/* Trusted brands strip */}
      <section className="border-t border-[#e3e1da] bg-white px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-center text-[10px] font-bold uppercase tracking-[0.24em] text-[#4c6b35]/70">
            {copy.trusted}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {BRANDS.map((brand) => (
              <span
                key={brand}
                className="rounded-lg border border-[#e3e1da] bg-white px-4 py-2 font-heading text-[12px] font-bold text-[#3d3d38]"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="contact-cta-bg relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20">
        <div aria-hidden className="contact-cta-rule absolute inset-x-0 top-0 h-px opacity-30" />

        <div className="mx-auto max-w-4xl text-center">
          <h2
            className={`mx-auto max-w-[22ch] text-white ${
              locale === "th"
                ? "font-body text-[clamp(1.5rem,2.6vw,2.2rem)] font-extrabold leading-[1.26]"
                : "font-display text-[clamp(2rem,3.2vw,2.8rem)] font-bold leading-[1.08]"
            }`}
          >
            {copy.title}
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-[14px] leading-[1.85] text-white/60 sm:text-[15px]">
            {copy.body}
          </p>

          {/* Process steps */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-4">
            {copy.steps.map((step, index) => (
              <div key={step.num} className="flex items-center gap-2">
                <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/6 px-4 py-2.5 backdrop-blur-sm">
                  <span className="font-display text-[11px] font-bold tabular-nums text-[#6e8a50]">
                    {step.num}
                  </span>
                  <span className="text-[12px] font-semibold text-white/80">
                    {step.label}
                  </span>
                </div>
                {index < copy.steps.length - 1 && (
                  <span aria-hidden className="text-[18px] font-light text-white/20">→</span>
                )}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href={contactHref}
              className="inline-flex items-center gap-2 rounded-xl bg-[#4c6b35] px-7 py-3.5 text-[13px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5a7e40]"
            >
              {copy.quote}
            </Link>

            {lineUrl && (
              <a
                href={lineUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 text-[13px] font-bold text-white/85 backdrop-blur-sm transition-all duration-200 hover:border-white/35 hover:bg-white/8"
              >
                {copy.line}
              </a>
            )}

            {primaryPhone && (
              <a
                href={`tel:${primaryPhone.replace(/[^+\d]/g, "")}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 text-[13px] font-bold text-white/85 backdrop-blur-sm transition-all duration-200 hover:border-white/35 hover:bg-white/8"
              >
                {copy.call}
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
