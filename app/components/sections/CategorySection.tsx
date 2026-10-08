import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { uiText } from "@/app/lib/i18n/ui"
import { CategoryView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"
import { CONTAINER } from "./home-theme"

export default function CategorySection({ items = [], locale }: { items: CategoryView[]; locale: "th" | "en" }) {
  if (!items.length) return null
  return (
    <section className="showroom-categories" aria-labelledby="category-heading">
      <div className={CONTAINER}>
        <div className="showroom-section-heading">
          <div><h2 id="category-heading">{locale === "th" ? "เริ่มจากบรรจุภัณฑ์ที่คุณมองหา" : "Find your packaging"}</h2></div>
          <Link href={withLocalePath("/categories", locale)}>{uiText.categories.viewAll[locale]}<ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
        <div className="showroom-category-grid">
          {items.slice(0, 8).map(item => (
            <Link key={item.id} className="showroom-category" href={withLocalePath(`/categories/${item.slug}`, locale)}>
              <div className="showroom-category-image">{item.image?.src ? <Image src={item.image.src} alt={item.image.alt || ""} fill sizes="(max-width: 639px) 44vw, (max-width: 1023px) 30vw, 280px" className="object-cover" /> : <span>{item.name.charAt(0)}</span>}</div>
              <div className="showroom-category-name"><h3>{item.name}</h3><ArrowUpRight size={19} aria-hidden="true" /></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
