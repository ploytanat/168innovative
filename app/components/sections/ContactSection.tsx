import Link from "next/link"

import type { CompanyView } from "@/app/lib/types/view"

interface ContactSectionProps {
  data: CompanyView
  locale: "th" | "en"
}

const BRANDS = ["COSMAX", "Interpack", "Thai Beauty", "BrandLab TH", "PackPro", "CosmoLine"]

const COPY = {
  th: {
    trusted: "ลูกค้าและพาร์ทเนอร์ที่ไว้วางใจเรา",
    title: "พร้อมเริ่มต้นกับเราแล้วหรือยัง?",
    body: "บอกสเปค รับใบเสนอราคา เริ่มผลิต ง่ายในขั้นตอนเดียว",
    steps: [
      "แจ้งสเปคและปริมาณ",
      "รับใบเสนอราคาใน 24 ชม.",
      "ดูตัวอย่างสินค้าฟรี",
      "ยืนยันและเริ่มผลิต",
    ],
    quote: "ขอใบเสนอราคาเลย",
    line: "LINE @168innovative",
    call: "โทรหาทีมเซลส์",
  },
  en: {
    trusted: "Trusted by our customers and partners",
    title: "Ready to start your project?",
    body: "Share your specs, get a quote, and move into production with a simpler first step.",
    steps: [
      "Share specs and quantity",
      "Receive quotation within 24 hrs",
      "Review sample",
      "Confirm and start production",
    ],
    quote: "Request a Quote",
    line: "LINE @168innovative",
    call: "Call Sales",
  },
} as const

export default function ContactSection({ data, locale }: ContactSectionProps) {
  const copy = COPY[locale]
  const contactHref = locale === "en" ? "/en/contact" : "/contact"
  const lineUrl = data.socials.find((social) => social.type === "line")?.url
  const primaryPhone = data.phones[0]?.number

  return (
    <>
      <section className="border-t border-black/6 bg-white px-4 py-7 sm:px-5">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-[#8896a8]">
            {copy.trusted}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {BRANDS.map((brand) => (
              <span
                key={brand}
                className="rounded-lg border border-black/7 bg-[#f7f2ee] px-4 py-2 font-heading text-[13px] font-bold text-[#4a5568]"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#c47b8a_0%,#a86272_100%)] px-4 py-14 text-center sm:px-5">
        <div className="mx-auto max-w-4xl">
          <h2
            className={`mx-auto max-w-[24ch] text-white ${
              locale === "th"
                ? "font-body text-[clamp(1.4rem,2.3vw,2rem)] font-extrabold leading-[1.28]"
                : "font-heading text-[clamp(1.9rem,3vw,2.4rem)] font-black"
            }`}
          >
            {copy.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-[1.8] text-white/82">
            {copy.body}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-5">
            {copy.steps.map((step, index) => (
              <div key={step} className="flex items-start gap-2.5 sm:items-center">
                <span className="mt-0.5 flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-white/18 text-[11px] font-extrabold text-white sm:mt-0">
                  {index + 1}
                </span>
                <span className="text-left text-[12px] font-semibold leading-snug text-white/88 sm:text-center">
                  {step}
                </span>
                {index < copy.steps.length - 1 ? (
                  <span className="hidden text-white/28 sm:inline">→</span>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={contactHref}
              className="inline-flex items-center gap-2 rounded-[9px] bg-[#f9a825] px-6 py-3 text-[13px] font-extrabold text-[#2c2521] transition-transform hover:-translate-y-0.5"
            >
              {copy.quote}
            </Link>

            {lineUrl ? (
              <a
                href={lineUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-[9px] border-2 border-white/38 px-6 py-3 text-[13px] font-bold text-white transition-colors hover:bg-white/10"
              >
                {copy.line}
              </a>
            ) : null}

            {primaryPhone ? (
              <a
                href={`tel:${primaryPhone.replace(/[^+\d]/g, "")}`}
                className="inline-flex items-center gap-2 rounded-[9px] border-2 border-white/38 px-6 py-3 text-[13px] font-bold text-white transition-colors hover:bg-white/10"
              >
                {copy.call}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
