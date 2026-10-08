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
    <section className="showroom-faq relative py-12 sm:py-16">
      <div className={CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">

          {/* Heading column */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2
              lang={locale}
              className={`font-display ${SECTION_HEADING}  font-bold normal-case`}
              style={{ color: HOME.ink, wordBreak: "keep-all", textWrap: "balance" }}
            >
              {t.heading}
            </h2>
          </div>

          {/* Accordion column */}
          <ul className="showroom-faq-list">
            {t.items.map((item, i) => (
              <li key={i} style={{ borderBottomColor: HOME.line }}>
                <details className="group showroom-faq-item">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                    <span className="text-[#333333] font-semibold transition-colors duration-200 group-hover:text-[#263859]">
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110 group-open:rotate-45"
                      style={{ background: "#e6edf5", color: "#263859" }}
                    >
                      <Plus className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                  </summary>
                  <p className="mt-3 max-w-[60ch]" style={{ color: HOME.inkMid }}>
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
