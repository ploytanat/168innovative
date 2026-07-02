import { Plus } from "lucide-react"

import { CONTAINER, HOME, SECTION_HEADING } from "./home-theme"

type Locale = "th" | "en"

const COPY = {
  th: {
    heading: "คำถามที่พบบ่อย",
    description: "รวมคำถามและข้อสงสัยที่ลูกค้าถามเข้ามาบ่อย ก่อนตัดสินใจสั่งผลิต",
    items: [
      {
        q: "มีสินค้าตัวอย่างให้ดูก่อนสั่งซื้อไหม",
        a: "มีครับ เรามีตัวอย่างสินค้าสต็อกพร้อมส่งให้พิจารณา ติดต่อทีมขายเพื่อขอตัวอย่างได้ทันที",
      },
      {
        q: "รับออกแบบบรรจุภัณฑ์ตามแบบไหม",
        a: "รับงานออกแบบและสั่งผลิตตามแบบ (ODM) เลือกขนาด สี วัสดุ และดีไซน์ได้ตามแบรนด์ของคุณ ทีมงานช่วยแนะนำตั้งแต่ขั้นตอนแรก",
      },
      {
        q: "รับผลิต OEM / ODM ไหม",
        a: "รับครับ ทั้งงาน OEM (ผลิตตามสเปคลูกค้า) และ ODM (ออกแบบให้พร้อมผลิต) ครบวงจรในที่เดียว",
      },
      {
        q: "สั่งผลิตขั้นต่ำเท่าไร",
        a: "ขั้นต่ำขึ้นกับชนิดสินค้าและความยาก-ง่ายของงาน โดยทั่วไปเริ่มต้นที่ 500–1,000 ชิ้น ติดต่อทีมขายเพื่อรับใบเสนอราคาที่ตรงกับโปรเจกต์",
      },
      {
        q: "ระยะเวลาผลิตนานแค่ไหน",
        a: "งานสต็อกพร้อมส่งภายใน 2–5 วันทำการ งานสั่งผลิตตามแบบใช้เวลา 30–60 วัน ขึ้นกับขนาดออเดอร์และความซับซ้อน",
      },
      {
        q: "จัดส่งทั่วประเทศไหม",
        a: "จัดส่งทั่วประเทศไทย รองรับขนส่งหลายเจ้า สามารถเลือกขนส่งและประเมินค่าจัดส่งกับทีมขายได้",
      },
    ],
  },
  en: {
    heading: "Frequently asked questions",
    description: "Common questions from customers before they place a packaging order.",
    items: [
      {
        q: "Do you provide samples before ordering?",
        a: "Yes. We have stock samples ready to review — contact our sales team to request one.",
      },
      {
        q: "Do you offer custom packaging design?",
        a: "Yes. We handle design and made-to-order production (ODM) — choose size, color, material, and finish around your brand. Our team guides you from the first step.",
      },
      {
        q: "Do you handle OEM / ODM production?",
        a: "Yes. Both OEM (produced to your spec) and ODM (we design, then produce) — full-service in one place.",
      },
      {
        q: "What is the minimum order quantity?",
        a: "MOQ depends on the product and complexity — typically starting at 500–1,000 units. Contact sales for a quote on your project.",
      },
      {
        q: "How long does production take?",
        a: "Stock items ship in 2–5 business days. Custom production takes 30–60 days depending on order size and complexity.",
      },
      {
        q: "Do you ship nationwide?",
        a: "Yes, we deliver nationwide in Thailand with multiple carriers — you can choose the carrier and get a shipping estimate from the sales team.",
      },
    ],
  },
} as const

export default function FaqSection({ locale }: { locale: Locale }) {
  const t = COPY[locale]

  return (
    <section className="relative py-12 sm:py-16" style={{ background: HOME.surface, borderTop: `1px solid ${HOME.line}` }}>
      <div className={CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">

          {/* Heading column */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2
              lang={locale}
              className={`font-display ${SECTION_HEADING} text-[clamp(1.75rem,1.2rem+1.8vw,2.5rem)] font-bold normal-case`}
              style={{ color: HOME.ink, wordBreak: "keep-all", textWrap: "balance" }}
            >
              {t.heading}
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-[1.7] sm:text-[16px] lg:text-[17px]" style={{ color: HOME.inkMid }}>
              {t.description}
            </p>
          </div>

          {/* Accordion column */}
          <ul className="divide-y" style={{ borderTop: `1px solid ${HOME.line}`, borderColor: HOME.line }}>
            {t.items.map((item, i) => (
              <li key={i} style={{ borderBottomColor: HOME.line }}>
                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                    <span className="text-[16px] font-semibold sm:text-[17px]" style={{ color: HOME.ink }}>
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-open:rotate-45"
                      style={{ background: HOME.leaf, color: HOME.surface }}
                    >
                      <Plus className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                  </summary>
                  <p className="mt-3 max-w-[60ch] text-[15px] leading-[1.7] sm:text-[16px]" style={{ color: HOME.inkMid }}>
                    {item.a}
                  </p>
                </details>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </section>
  )
}
