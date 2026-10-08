import Link from "next/link"
import { ArrowUpRight, ChevronDown } from "lucide-react"
import type { ProductView } from "@/app/lib/types/view"
import SaveProductButton from "./SaveProductButton"

export default function ProductSummary({ product, locale }: { product: ProductView; locale: "th" | "en" }) {
  const th = locale === "th"
  const labels: Record<string, string> = { model: "รุ่น", material: "วัสดุ", "inner diameter mm": "เส้นผ่านศูนย์กลางภายใน (มม.)", application: "การใช้งาน", applications: "การใช้งาน" }
  const model = product.specs.find(s => /^(model|รุ่น|รหัสสินค้า)$/i.test(s.label.trim()))?.value
  const facts = product.specs.filter(s => /^(material|วัสดุ|inner diameter mm)$/i.test(s.label.trim()) && s.value.trim())
  const remaining = product.specs.filter(s => !facts.includes(s) && !/^(model|รุ่น|รหัสสินค้า)$/i.test(s.label.trim()))
  const applications: Record<string, string> = { "cosmetic packaging": "บรรจุภัณฑ์เครื่องสำอาง", "liquid pouch": "ซองบรรจุของเหลว", "food packaging": "บรรจุภัณฑ์อาหาร", "refill pouch": "ซองรีฟิล" }
  function value(label: string, text: string) {
    if (th && /^(application|applications|การใช้งาน)$/i.test(label.trim())) return text.split(',').map(part => applications[part.trim().toLowerCase()] || part.trim()).join(" · ")
    return text
  }
  return <>
    <header className="product-detail-heading">
      <h1 className={model ? "product-model-title" : undefined}>{model || product.name}</h1>
      {model && <p className="product-full-name">{product.name}</p>}
    </header>
    <div className="product-reading-summary">
      <h2 className="product-spec-title">{th ? "ข้อมูลสินค้า" : "Product specifications"}</h2>
      {facts.length > 0 && <dl className="product-key-facts">{facts.map((spec, i) => <div key={i}><dt>{th ? labels[spec.label.trim().toLowerCase()] || spec.label : spec.label}</dt><dd>{spec.value}</dd></div>)}</dl>}
      {remaining.length > 0 && <dl className="product-secondary-specs">{remaining.map((spec, i) => <div key={i}><dt>{th ? labels[spec.label.trim().toLowerCase()] || spec.label : spec.label}</dt><dd>{value(spec.label, spec.value)}</dd></div>)}</dl>}
      <div className="product-enquiry-panel">
        <Link className="btn-primary-soft" href={`${th ? "" : "/en"}/contact?product=${encodeURIComponent(product.name)}`}>{th ? "สอบถามสินค้ารุ่นนี้" : "Enquire about this product"}<ArrowUpRight size={19} aria-hidden="true" /></Link>
        <p>{th ? "สอบถามราคา ขั้นต่ำการสั่งซื้อ และตัวอย่างสินค้า" : "Ask about pricing, minimum quantities and samples."}</p>
        <dl className="product-order-notes">
          <div><dt>{th ? "ใบเสนอราคา" : "Quotation"}</dt><dd>{th ? "แจ้งจำนวนที่ต้องการและสีที่สนใจ" : "Share your quantity and preferred colour."}</dd></div>
          <div><dt>{th ? "ตัวอย่างสินค้า" : "Samples"}</dt><dd>{th ? "สอบถามตัวอย่างเพื่อทดสอบก่อนสั่งผลิต" : "Ask for samples to check suitability before ordering."}</dd></div>
        </dl>
        <SaveProductButton product={product} locale={locale} />
      </div>

    </div>
  </>
}

export function ProductDescription({ product, locale }: { product: ProductView; locale: "th" | "en" }) {
  const th = locale === "th"
  return <> {product.description && <details open className="product-reading-description"><summary>{th ? "รายละเอียดสินค้า" : "Product description"}<ChevronDown size={18} aria-hidden="true" /></summary><p>{product.description}</p></details>} </>
}
