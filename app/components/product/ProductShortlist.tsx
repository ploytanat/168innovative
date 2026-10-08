"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bookmark, Copy, GitCompareArrows, Mail, Trash2, X } from "lucide-react"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"
import { SITE_URL } from "@/app/config/site"
import { MAX_COMPARE, specRows } from "./shortlist-model"
import { removeSaved, useShortlist } from "./shortlist-store"

export default function ProductShortlist({ locale, email }: { locale: "th" | "en"; email?: string }) {
  const saved = useShortlist()
  const [open, setOpen] = useState(false)
  const [keys, setKeys] = useState<string[]>([])
  const [comparing, setComparing] = useState(false)
  const [differencesOnly, setDifferencesOnly] = useState(false)
  const [notice, setNotice] = useState("")
  const [manualCopy, setManualCopy] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const tableHeading = useRef<HTMLHeadingElement>(null)
  const th = locale === "th"
  const selected = saved.filter(p => keys.includes(p.key))
  const rows = specRows(selected)
  const visibleRows = differencesOnly ? rows.filter(row => new Set(row.values).size > 1) : rows
  const brief = (th ? "สนใจสอบถามสินค้า:\n" : "Please quote the following products:\n") + saved.map((p, i) => `${i + 1}. ${p.name}\n${SITE_URL}${withLocalePath(`/categories/${encodeURIComponent(p.categorySlug)}/${encodeURIComponent(p.slug)}`, locale)}`).join("\n") + (th ? "\nกรุณาแจ้งขั้นต่ำ ราคา และระยะเวลาจัดส่ง" : "\nPlease advise MOQ, price and delivery time.")
  useEffect(() => {
    if (!open || !dialog.current) return
    const modal = dialog.current
    const previous = document.body.style.overflow
    const trigger = document.activeElement as HTMLElement | null
    modal.showModal(); document.body.style.overflow = "hidden"
    return () => { modal.close(); document.body.style.overflow = previous; if (trigger?.isConnected) trigger.focus() }
  }, [open])
  useEffect(() => { if (comparing) tableHeading.current?.focus() }, [comparing])
  async function copy() {
    try { await navigator.clipboard.writeText(brief); setNotice(th ? "คัดลอกแล้ว นำไปวางใน LINE ได้เลย" : "Copied. Paste it into LINE or email."); setManualCopy(false) }
    catch { setManualCopy(true); setNotice(th ? "เลือกและคัดลอกข้อความด้านล่างได้เลย" : "Select and copy the text below.") }
  }
  return <>
    {saved.length > 0 && <button type="button" className="shortlist-dock" aria-label={`${th ? "สินค้าที่เก็บไว้" : "Saved products"}: ${saved.length}`} onClick={() => { setOpen(true); setNotice(""); setComparing(false) }}><Bookmark size={18} aria-hidden="true" /><span>{th ? "สินค้าที่เก็บไว้" : "Saved products"}</span><strong key={saved.length} className="shortlist-count">{saved.length}</strong></button>}
    <dialog ref={dialog} className="shortlist-dialog" aria-labelledby="shortlist-title" onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) setOpen(false) }}>
      <header className="shortlist-header"><h2 id="shortlist-title">{th ? "สินค้าที่สนใจ" : "Your shortlist"} <span>({saved.length})</span></h2><button type="button" autoFocus onClick={() => setOpen(false)} aria-label={th ? "ปิดรายการ" : "Close shortlist"}><X size={22} /></button></header>
      {saved.length ? <>
        <p className="shortlist-hint">{th ? "เลือก 2–3 รุ่นเพื่อเปรียบเทียบสเปก" : "Select 2–3 products to compare specifications."}</p>
        <ul className="shortlist-list">{saved.map(p => <li key={p.key} data-selected={keys.includes(p.key)}>
          <label className="shortlist-select"><input type="checkbox" checked={keys.includes(p.key)} aria-label={`${th ? "เปรียบเทียบ" : "Compare"} ${p.name}`} onChange={event => {
            if (event.target.checked && selected.length >= MAX_COMPARE) { setNotice(th ? "เปรียบเทียบได้สูงสุด 3 รุ่น กรุณายกเลิกบางรุ่นก่อน" : "Compare up to 3 products. Deselect one first."); return }
            setKeys(event.target.checked ? [...selected.map(item => item.key), p.key] : keys.filter(key => key !== p.key)); setComparing(false); setNotice(""); setManualCopy(false)
          }} /><span className="sr-only">{p.name}</span></label>
          <Link href={withLocalePath(`/categories/${encodeURIComponent(p.categorySlug)}/${encodeURIComponent(p.slug)}`, locale)} onClick={() => setOpen(false)} className="shortlist-product">{p.image && <span className="shortlist-thumbnail"><Image src={p.image} alt="" width={72} height={72} unoptimized /></span>}<span>{p.name}</span></Link>
          <button type="button" className="shortlist-remove" aria-label={`${th ? "นำออก" : "Remove"}: ${p.name}`} onClick={() => { removeSaved(p.key); setKeys(keys.filter(key => key !== p.key)); setComparing(false); setNotice(""); setManualCopy(false) }}><Trash2 size={18} /></button>
        </li>)}</ul>
        <div className="shortlist-selection" aria-label={th ? "รุ่นที่เลือกเปรียบเทียบ" : "Selected products"}>{Array.from({ length: MAX_COMPARE }, (_, i) => {
          const product = selected[i]
          return <div className="shortlist-slot" data-filled={!!product} key={i}>{product ? <>{product.image && <Image src={product.image} alt="" width={40} height={40} unoptimized />}<span>{product.name}</span></> : <><GitCompareArrows size={18} aria-hidden="true" /><span>{th ? "เลือกรุ่น" : "Select"} {i + 1}</span></>}</div>
        })}</div>
        <div className="shortlist-actions"><button type="button" className="shortlist-primary" disabled={selected.length < 2} onClick={() => setComparing(true)}><GitCompareArrows size={18} />{th ? "เปรียบเทียบ" : "Compare"} ({selected.length}/{MAX_COMPARE})</button><button type="button" onClick={copy}><Copy size={17} />{th ? "คัดลอกทุกรายการ" : "Copy all products"}</button>{email && <a href={`mailto:${email}?subject=${encodeURIComponent(th ? "สอบถามสินค้าที่สนใจ" : "Packaging shortlist enquiry")}&body=${encodeURIComponent(brief)}`}><Mail size={17} />{th ? "เปิดอีเมลสอบถาม" : "Open enquiry email"}</a>}</div>
        {comparing && selected.length >= 2 && <section className="shortlist-comparison" aria-labelledby="compare-title"><h3 ref={tableHeading} tabIndex={-1} id="compare-title">{th ? "เปรียบเทียบข้อมูลสินค้า" : "Compare product details"}</h3><label className="shortlist-difference-toggle"><input type="checkbox" checked={differencesOnly} onChange={event => setDifferencesOnly(event.target.checked)} />{th ? "แสดงเฉพาะสเปกที่ต่างกัน" : "Show differences only"}</label><div className="shortlist-table-scroll" tabIndex={0} role="region" aria-label={th ? "ตารางเปรียบเทียบ เลื่อนแนวนอนเพื่อดูทุกรุ่น" : "Comparison table, scroll horizontally to see all products"}><table><caption className="sr-only">{th ? "สเปกของสินค้าที่เลือก" : "Selected product specifications"}</caption><thead><tr><th scope="col">{th ? "รายละเอียด" : "Specification"}</th>{selected.map(p => <th scope="col" key={p.key}>{p.image && <Image className="shortlist-compare-image" src={p.image} alt="" width={88} height={88} unoptimized />}<span>{p.name}</span></th>)}</tr></thead><tbody>{visibleRows.map(row => <tr key={row.label}><th scope="row">{row.label}</th>{row.values.map((value, i) => <td key={selected[i].key}>{value}</td>)}</tr>)}</tbody></table></div>{differencesOnly && visibleRows.length === 0 && <p className="shortlist-hint">{th ? "สเปกที่มีข้อมูลเหมือนกันทุกรุ่น" : "All available specifications match."}</p>}<p className="shortlist-hint">{th ? "— หมายถึงยังไม่มีข้อมูลในแคตตาล็อก กรุณายืนยันรายละเอียดกับทีมงาน" : "— means the catalogue has no value. Confirm details with our team."}</p></section>}
        <p role="status" className="shortlist-status">{notice}</p>
        {manualCopy && <textarea className="shortlist-copy" aria-label={th ? "รายการสำหรับคัดลอก" : "Product list to copy"} readOnly value={brief} rows={6} />}
      </> : <div className="shortlist-empty"><Bookmark size={32} /><p>{th ? "ยังไม่มีสินค้าที่เก็บไว้" : "No saved products yet"}</p><Link href={withLocalePath("/categories", locale)} onClick={() => setOpen(false)}>{th ? "เลือกดูสินค้า" : "Browse products"}</Link></div>}
    </dialog>
  </>
}

