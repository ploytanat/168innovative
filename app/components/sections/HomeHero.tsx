import { ArrowRight, Check, Layers3 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import type { HomeHeroView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"
import { CONTAINER } from "./home-theme"

const COPY = {
  th: {
    label: "168 INNOVATIVE · PACKAGING PARTNER",
    title: "บรรจุภัณฑ์ที่ใช่",
    accent: "ให้แบรนด์คุณเติบโต",
    description: "จัดหาและนำเข้าบรรจุภัณฑ์เครื่องสำอาง พร้อมดูแลงาน OEM / ODM ให้แบรนด์คุณ",
    catalog: "สำรวจบรรจุภัณฑ์", contact: "ปรึกษาเรื่องบรรจุภัณฑ์",
    benefits: ["รองรับงาน OEM / ODM", "จัดส่งทั่วประเทศ", "ตอบกลับภายใน 24 ชม."],
    caption: "จากไอเดียของคุณ สู่บรรจุภัณฑ์ที่เป็นไปได้", range: "ขวด · หลอด · ตลับ · ลิปสติก",
  },
  en: {
    label: "168 INNOVATIVE · PACKAGING PARTNER",
    title: "The right packaging.", accent: "Room for your brand to grow.",
    description: "Cosmetic packaging sourcing and import, with OEM / ODM support for your brand.",
    catalog: "Explore packaging", contact: "Talk about your project",
    benefits: ["OEM / ODM support", "Nationwide delivery", "Reply within 24 hours"],
    caption: "Your idea. A world of packaging possibilities.", range: "Bottles · Tubes · Compacts · Lipsticks",
  },
} as const

export default function HomeHero({ hero, locale, showStudio = false }: { hero: HomeHeroView; locale: "th" | "en"; showStudio?: boolean }) {
  const slide = hero.slides?.[0]
  if (!slide) return null
  const t = COPY[locale]
  return (
    <section className="showroom-hero" aria-labelledby="home-headline">
      <div className="showroom-color-field" aria-hidden="true"><span /><span /><span /></div>
      <div className={CONTAINER}>
        <div className="showroom-hero-grid">
          <div className="showroom-hero-copy">
            <h2 id="home-headline" lang={locale}>{t.title}<span>{t.accent}</span></h2>
            <p className="showroom-intro">{t.description}</p>
            <div className="showroom-actions">
              <Link className="showroom-primary" href={withLocalePath("/categories", locale)}>{t.catalog}<ArrowRight size={18} aria-hidden="true" /></Link>
              <Link className="showroom-secondary" href={withLocalePath("/contact", locale)}>{t.contact}<ArrowRight size={17} aria-hidden="true" /></Link>
            </div>
            {showStudio && <a className="studio-entry" href="#packaging-studio"><Layers3 size={16} aria-hidden="true" />{locale === "th" ? "เตรียมบรีฟบรรจุภัณฑ์" : "Build your packaging brief"}<ArrowRight size={15} aria-hidden="true" /></a>}
          </div>
          <figure className="showroom-visual">
            <div className="showroom-product-image">
              <Image src={slide.image.src || "/images/home/banner4.png"} alt={slide.image.alt || t.range} fill priority sizes="(max-width: 767px) 92vw, 54vw" className="object-contain" />
            </div>
          </figure>
        </div>
        <ul className="showroom-benefits">{t.benefits.map(item => <li key={item}><Check size={17} aria-hidden="true" />{item}</li>)}</ul>
      </div>
    </section>
  )
}
