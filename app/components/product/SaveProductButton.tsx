"use client"
import { Bookmark, Check } from "lucide-react"
import { useState } from "react"
import type { ProductView } from "@/app/lib/types/view"
import { productKey } from "./shortlist-model"
import { toggleSaved, useShortlist } from "./shortlist-store"
export default function SaveProductButton({ product, locale }: { product: ProductView; locale: "th" | "en" }) {
  const saved = useShortlist().some(p => p.key === productKey(product))
  const [notice, setNotice] = useState("")
  const th = locale === "th"
  return <div className="save-product-control"><button type="button" className="save-product-button" aria-pressed={saved} aria-label={`${saved ? (th ? "นำออกจากรายการ" : "Remove saved product") : (th ? "เก็บสินค้า" : "Save product")}: ${product.name}`} onClick={() => {
    const result = toggleSaved(product)
    setNotice(result === "full" ? (th ? "เก็บได้สูงสุด 20 รายการ กรุณานำบางรายการออกก่อน" : "Save up to 20 products. Remove one to add another.") : result === "temporary" ? (th ? "เก็บชั่วคราวในหน้านี้ เบราว์เซอร์ไม่อนุญาตให้บันทึก" : "Saved for this session; browser storage is unavailable.") : "")
  }}>{saved ? <Check className="save-product-check" size={17} aria-hidden="true" /> : <Bookmark size={17} aria-hidden="true" />}{saved ? (th ? "เก็บแล้ว" : "Saved") : (th ? "เก็บไว้เทียบ" : "Save to compare")}</button><span role="status" className="save-product-notice">{notice}</span></div>
}
