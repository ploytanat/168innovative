"use client"

import { useId, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ChevronDown, Copy, Layers3, Mail } from "lucide-react"
import type { CategoryView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"
import { CONTAINER } from "./home-theme"

export default function PackagingStudio({ categories, locale, email }: { categories: CategoryView[]; locale: "th" | "en"; email?: string }) {
  const id = useId()
  const [slug, setSlug] = useState(categories[0]?.slug ?? "")
  const [mode, setMode] = useState("catalog")
  const [quantity, setQuantity] = useState("")
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const th = locale === "th"
  const selected = categories.find(category => category.slug === slug) ?? categories[0]
  if (!selected) return null
  const modes = th ? ["เลือกจากแบบที่มี", "พัฒนาแบบ OEM / ODM"] : ["Explore existing designs", "Develop an OEM / ODM design"]
  const selectedMode = modes[mode === "catalog" ? 0 : 1]
  const brief = th
    ? `สนใจบรรจุภัณฑ์: ${selected.name}\nรูปแบบงาน: ${selectedMode}\nจำนวนที่ต้องการ: ${quantity ? `${quantity} ชิ้น` : "ขอคำแนะนำ"}\nรบกวนแจ้งขั้นต่ำ ตัวเลือกสินค้า และระยะเวลาดำเนินการ`
    : `Packaging: ${selected.name}\nProject: ${selectedMode}\nQuantity: ${quantity ? `${quantity} units` : "Please advise"}\nPlease advise on MOQ, available options and lead time.`
  const resetFeedback = () => { setCopied(false); setCopyFailed(false) }
  const copyBrief = async () => {
    try { await navigator.clipboard.writeText(brief); setCopied(true); setCopyFailed(false) }
    catch { setCopyFailed(true); setCopied(false) }
  }
  return (
    <section id="packaging-studio" className="packaging-studio" aria-labelledby={`${id}-title`}>
      <div className={CONTAINER}>
        <details className="studio-disclosure">
          <summary className="studio-heading"><h2 id={`${id}-title`}>{th ? "เตรียมบรีฟบรรจุภัณฑ์" : "Build your packaging brief"}</h2><ChevronDown size={24} aria-hidden="true" /></summary>
        <div className="studio-workspace">
          <div className="studio-controls">
            <label htmlFor={`${id}-category`}>{th ? "1. สนใจบรรจุภัณฑ์ประเภทไหน" : "1. Choose your packaging"}</label>
            <select id={`${id}-category`} value={selected.slug} onChange={event => { setSlug(event.target.value); resetFeedback() }}>{categories.map(category => <option key={category.id} value={category.slug}>{category.name}</option>)}</select>
            <fieldset><legend>{th ? "2. อยากเริ่มแบบไหน" : "2. Choose your project type"}</legend><div className="studio-modes">{["catalog", "custom"].map((value, index) => <label key={value} className={mode === value ? "is-selected" : ""}><input type="radio" name={`${id}-mode`} value={value} checked={mode === value} onChange={() => { setMode(value); resetFeedback() }} /><span>{modes[index]}</span></label>)}</div></fieldset>
            <label htmlFor={`${id}-quantity`}>{th ? "3. จำนวนที่วางแผนไว้" : "3. Planned quantity"}<span>{th ? "ไม่บังคับ" : "Optional"}</span></label>
            <input id={`${id}-quantity`} type="text" inputMode="numeric" maxLength={9} value={quantity} onChange={event => { setQuantity(event.target.value.replace(/[^0-9]/g, "").replace(/^0+/, "")); resetFeedback() }} placeholder={th ? "ยังไม่แน่ใจ เว้นว่างได้" : "Not sure? Leave this blank"} />
            <p className="studio-note">{th ? "จำนวนขั้นต่ำ ราคา และระยะเวลา ต้องยืนยันกับทีมงานตามแบบและวัสดุที่เลือก" : "MOQ, pricing and lead time are confirmed by our team for your chosen design and material."}</p>
          </div>
          <div className="studio-preview">
            <div key={selected.slug} className="studio-object">{selected.image?.src ? <Image src={selected.image.src} alt={selected.image.alt || selected.name} fill sizes="(max-width: 767px) 80vw, 420px" className="object-contain" /> : <Layers3 size={64} aria-hidden="true" />}</div>
            <div className="studio-preview-caption"><div><h3>{selected.name}</h3></div><Link href={withLocalePath(`/categories/${selected.slug}`, locale)} aria-label={`${th ? "ดูสินค้า" : "Browse"} ${selected.name}`}><ArrowUpRight size={22} aria-hidden="true" /></Link></div>
          </div>
          <div className="studio-brief">
            <div className="studio-brief-title"><h3>{th ? "บรีฟของคุณ พร้อมคุยต่อ" : "Your brief, ready to share"}</h3></div>
            <textarea aria-label={th ? "สรุปบรีฟสำหรับคัดลอก" : "Brief to copy"} value={brief} readOnly rows={4} />
            <div className="studio-brief-actions"><button type="button" onClick={copyBrief}><Copy size={16} aria-hidden="true" />{copied ? (th ? "คัดลอกแล้ว" : "Copied") : (th ? "คัดลอกบรีฟ" : "Copy brief")}</button>{email ? <a href={`mailto:${email}?subject=${encodeURIComponent(th ? "สอบถามบรรจุภัณฑ์ " + selected.name : "Packaging enquiry: " + selected.name)}&body=${encodeURIComponent(brief)}`}><Mail size={16} aria-hidden="true" />{th ? "เปิดอีเมลพร้อมบรีฟ" : "Open email with brief"}</a> : <Link href={withLocalePath("/contact", locale)}>{th ? "ติดต่อทีมงาน" : "Contact our team"}<ArrowUpRight size={16} aria-hidden="true" /></Link>}</div>
            <p role="status" className="studio-feedback">{copyFailed ? (th ? "คัดลอกอัตโนมัติไม่ได้ เลือกข้อความในช่องด้านบนเพื่อคัดลอกได้เลย" : "Automatic copy is unavailable. Select and copy the text above.") : copied ? (th ? "นำข้อความไปวางใน LINE หรืออีเมลได้เลย" : "Paste your brief into LINE or an email.") : (th ? "ข้อมูลจะยังไม่ถูกส่ง จนกว่าคุณจะส่งผ่านช่องทางที่เลือก" : "Nothing is sent until you send it through your chosen channel.")}</p>
          </div>
        </div>
        </details>
      </div>
    </section>
  )
}
