import Image from "next/image"
import Link from "next/link"

import { uiText } from "@/app/lib/i18n/ui"
import { CategoryView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

import { CONTAINER, HOME, SECTION_HEADING } from "./home-theme"

interface CategorySectionProps {
  items: CategoryView[]
  locale: "th" | "en"
}

export default function CategorySection({ items = [], locale }: CategorySectionProps) {
  if (items.length === 0) return null

  const displayItems = items.slice(0, 8)

  return (
    <section className="relative py-12 sm:py-14" style={{ background: HOME.cream }}>
      <div className={`${CONTAINER} text-center`}>
        <h2
          className={`${SECTION_HEADING} text-[clamp(1.4rem,1rem+1.2vw,1.7rem)] font-bold`}
          style={{ color: HOME.ink }}
        >
          {uiText.categories.title[locale]}
        </h2>
        <p className="mx-auto mt-2.5 max-w-md text-[0.9rem]" style={{ color: HOME.inkSoft }}>
          {locale === "th"
            ? "เลือกดูบรรจุภัณฑ์ตามกลุ่มสินค้าที่ต้องการ"
            : "Browse our packaging by product group."}
        </p>

        <div className="mt-9 grid grid-cols-3 gap-x-4 gap-y-7 sm:grid-cols-4 lg:grid-cols-8">
          {displayItems.map(item => (
            <Link
              key={item.id}
              href={withLocalePath(`/categories/${item.slug}`, locale)}
              className="group flex flex-col items-center gap-2.5"
            >
              <div
                className="relative h-20 w-20 overflow-hidden rounded-full transition-transform duration-300 group-hover:-translate-y-1"
                style={{
                  border: "3px solid #ffffff",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
                  background: HOME.mint,
                }}
              >
                {item.image?.src ? (
                  <Image
                    src={item.image.src}
                    alt={item.image.alt || item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <span
                    className="flex h-full w-full items-center justify-center text-xl font-bold"
                    style={{ color: HOME.mintInk }}
                  >
                    {item.name.charAt(0)}
                  </span>
                )}
              </div>
              <span
                className="text-[12px] font-bold uppercase leading-[1.3] tracking-[0.02em]"
                style={{ color: HOME.ink }}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
