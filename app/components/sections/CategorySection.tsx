import Image from "next/image"
import Link from "next/link"

import { uiText } from "@/app/lib/i18n/ui"
import { CategoryView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

import { CONTAINER, HOME, SECTION_HEADING } from "./home-theme"

export default function CategorySection({ items = [], locale }: { items: CategoryView[]; locale: "th" | "en" }) {
  if (items.length === 0) return null

  return (
    <section className="relative py-10 sm:py-12 lg:py-14" style={{ background: HOME.cream }}>
      <div className={`${CONTAINER} text-center`}>
        <h2 className={`${SECTION_HEADING} text-[clamp(1.75rem,1.2rem+1.9vw,2.5rem)] font-bold`} style={{ color: HOME.ink }}>
          {uiText.categories.title[locale]}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[1.02rem] leading-[1.7]" style={{ color: HOME.inkMid }}>
          {locale === "th" ? "เลือกดูบรรจุภัณฑ์ตามกลุ่มสินค้าที่ต้องการ" : "Browse our packaging by product group."}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-7 lg:mt-10 lg:grid-cols-4">
          {items.slice(0, 8).map(item => (
            <Link key={item.id} href={withLocalePath(`/categories/${item.slug}`, locale)}
              className="group flex flex-col items-center gap-3">
              <div className="relative h-44 w-44 overflow-hidden rounded-3xl transition-transform duration-300 group-hover:-translate-y-1.5 sm:h-52 sm:w-52 lg:h-64 lg:w-64"
                style={{ border: "2px solid #ffffff", boxShadow: "0 10px 26px rgba(0,0,0,0.12)", background: HOME.mint }}>
                {item.image?.src ? (
                  <Image src={item.image.src} alt={item.image.alt || item.name} fill sizes="(max-width:640px) 176px, (max-width:1024px) 208px, 256px" className="object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-3xl font-bold" style={{ color: HOME.mintInk }}>
                    {item.name.charAt(0)}
                  </span>
                )}
              </div>
              <span className="text-[15px] font-bold uppercase leading-[1.3] tracking-[0.03em]" style={{ color: HOME.ink }}>
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        <Link href={withLocalePath("/categories", locale)}
          className="mt-8 inline-block text-[14px] font-bold uppercase tracking-[0.04em] transition-colors hover:opacity-70"
          style={{ color: HOME.inkSoft }}>
          {uiText.categories.viewAll[locale]} →
        </Link>
      </div>
    </section>
  )
}
