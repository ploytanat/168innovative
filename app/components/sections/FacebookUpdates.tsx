import FacebookPageFeed from "./FacebookPageFeed"
import { ArrowUpRight, Facebook } from "lucide-react"
import { facebookUrl } from "@/app/lib/facebook-updates"
import { CONTAINER } from "./home-theme"

type Props = { locale: "th" | "en"; pageUrl?: string }

export default function FacebookUpdates({ locale, pageUrl }: Props) {
  const url = facebookUrl(pageUrl)
  if (!url) return null
  return <section className="facebook-updates facebook-updates--link" aria-labelledby="facebook-updates-title">
    <div className={CONTAINER}>
      <div className="facebook-updates-heading">
        <div><h2 id="facebook-updates-title">{locale === "th" ? "อัปเดตจาก 168" : "Updates from 168"}</h2><p>{locale === "th" ? "ติดตามสินค้าและเรื่องราวจากเราบน Facebook" : "Explore products and stories from our team on Facebook."}</p></div>
        <a className="facebook-page-link" href={url} target="_blank" rel="noopener noreferrer"><Facebook size={20} aria-hidden="true" />{locale === "th" ? "ติดตามบน Facebook" : "Follow on Facebook"}<ArrowUpRight size={18} aria-hidden="true" /></a>
      </div>
      <div className="facebook-live-region">
        <FacebookPageFeed pageUrl={url} locale={locale} />
        <p className="facebook-feed-help">{locale === "th" ? "หากไม่เห็นโพสต์ในกรอบ สามารถเปิดดูบน Facebook ได้โดยตรง" : "If posts do not appear here, open our page directly on Facebook."}</p>
      </div>
    </div>
  </section>
}
