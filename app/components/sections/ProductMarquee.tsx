import Image from "next/image"
import Link from "next/link"

import { uiText } from "@/app/lib/i18n/ui"
import { ProductView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

import { CONTAINER, HOME, SECTION_HEADING, SECTION_PAD } from "./home-theme"

type Locale = "th" | "en"

const COPY = {
  summary: {
    th: "บรรจุภัณฑ์ที่คัดมาแล้วว่าใช้งานได้จริง พร้อมส่งและต่อยอดเป็นคอลเลกชันของแบรนด์คุณ",
    en: "A curated set of packaging that works in production — ready to ship and build your brand around.",
  },
  spoutSummary: {
    th: "รวมจุกและวาล์วสำหรับงานซองบรรจุอาหาร เครื่องดื่ม และงาน OEM เลือกแบบที่เข้ากับไลน์ผลิตของคุณได้เลย",
    en: "Spouts and valves for food, beverage, and OEM pouch packaging — pick the fit for your production line.",
  },
  viewAll:     { th: "ดูทั้งหมด",    en: "View All" },
  viewProduct: { th: "ดูรายละเอียด", en: "View Product" },
} as const

const prettifySlug = (slug: string) => slug.replace(/-/g, " ")

const getProductHref = (item: ProductView, locale: Locale) =>
  withLocalePath(`/categories/${item.categorySlug}/${item.slug}`, locale)

export default function ProductMarquee({ items, locale }: { items: ProductView[]; locale: Locale }) {
  if (!items.length) return null

  const isSpout = items.every(i => i.categorySlug === "spout")
  const visible = items.slice(0, 8)
  const ctaHref = isSpout ? "/categories/spout" : "/categories"
  const title   = isSpout ? uiText.spoutProducts[locale] : uiText.featuredProducts[locale]
  const summary = isSpout ? COPY.spoutSummary[locale]    : COPY.summary[locale]

  return (
    <section className={`relative ${SECTION_PAD}`} style={{ background: HOME.surface }}>
      <div className={CONTAINER}>
        <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className={`${SECTION_HEADING} text-[clamp(1.75rem,1.2rem+1.6vw,2.3rem)] font-bold`} style={{ color: HOME.ink }}>
              {title}
            </h2>
            <p className="mt-3 text-[1.02rem] leading-[1.75]" style={{ color: HOME.inkMid }}>
              {summary}
            </p>
          </div>
          <Link href={withLocalePath(ctaHref, locale)}
            className="shrink-0 text-[14px] font-bold uppercase tracking-[0.04em] transition-colors hover:opacity-70"
            style={{ color: HOME.inkSoft }}>
            {COPY.viewAll[locale]} →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map(item => <ProductCard key={item.id} item={item} locale={locale} />)}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ item, locale }: { item: ProductView; locale: Locale }) {
  const href = getProductHref(item, locale)
  return (
    <div className="home-card flex flex-col overflow-hidden rounded-lg"
      style={{ background: HOME.surface, border: `1px solid ${HOME.line}` }}>
      <Link href={href} className="block">
        <div className="flex h-[200px] items-center justify-center p-5" style={{ background: HOME.mist }}>
          <div className="relative h-full w-full">
            <Image src={item.image.src} alt={item.image.alt || item.name}
              fill sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
              className="object-contain" />
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: HOME.inkSoft }}>
          {prettifySlug(item.categorySlug)}
        </p>
        <Link href={href}>
          <h3 className="text-[16px] font-bold leading-[1.4]" style={{ color: HOME.ink }}>{item.name}</h3>
        </Link>
        {item.description && (
          <p className="mt-2 line-clamp-3 text-[0.95rem] leading-[1.65]" style={{ color: HOME.inkMid }}>
            {item.description}
          </p>
        )}
        <Link href={href}
          className="home-btn home-btn-accent mt-4 block rounded-[5px] py-2.5 text-center text-[14px] font-bold">
          {COPY.viewProduct[locale]}
        </Link>
      </div>
    </div>
  )
}
