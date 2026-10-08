import Image from "next/image"
import { ArrowUpRight, Facebook } from "lucide-react"
import { getFacebookUpdates } from "@/app/lib/api/facebook-updates"
import { facebookUrl } from "@/app/lib/facebook-updates"
import { CONTAINER } from "./home-theme"

type Props = { locale: "th" | "en"; pageUrl?: string }

export function FacebookUpdatesLink({ locale, pageUrl }: Props) {
  const url = facebookUrl(pageUrl)
  if (!url) return null
  return <section className="facebook-updates facebook-updates--link" aria-labelledby="facebook-updates-title">
    <div className={CONTAINER}>
      <div className="facebook-updates-heading">
        <div><h2 id="facebook-updates-title">{locale === "th" ? "อัปเดตจาก 168" : "Updates from 168"}</h2><p>{locale === "th" ? "ติดตามสินค้าและเรื่องราวจากเราบน Facebook" : "Explore products and stories from our team on Facebook."}</p></div>
        <a className="facebook-page-link" href={url} target="_blank" rel="noopener noreferrer"><Facebook size={20} aria-hidden="true" />{locale === "th" ? "ติดตามบน Facebook" : "Follow on Facebook"}<ArrowUpRight size={18} aria-hidden="true" /></a>
      </div>
    </div>
  </section>
}

export default async function FacebookUpdates({ locale, pageUrl }: Props) {
  const posts = await getFacebookUpdates(locale)
  if (!posts.length) return <FacebookUpdatesLink locale={locale} pageUrl={pageUrl} />
  const th = locale === "th"
  const url = facebookUrl(pageUrl)
  return <section className="facebook-updates" aria-labelledby="facebook-updates-title">
    <div className={CONTAINER}>
      <div className="facebook-updates-heading">
        <div><h2 id="facebook-updates-title">{th ? "อัปเดตจาก 168" : "Updates from 168"}</h2><p>{th ? "สินค้าและเรื่องราวที่คัดมาจากเพจของเรา" : "Selected products and stories from our Facebook page."}</p></div>
        {url && <a className="facebook-page-link" href={url} target="_blank" rel="noopener noreferrer"><Facebook size={20} aria-hidden="true" />{th ? "ดูเพจ Facebook" : "Visit our Facebook page"}<ArrowUpRight size={18} aria-hidden="true" /></a>}
      </div>
      <ul className="facebook-updates-grid">{posts.map(post => <li key={post.id}>
        <a className="facebook-update" href={post.url} target="_blank" rel="noopener noreferrer">
          <div className="facebook-update-image"><Image src={post.image} alt={post.imageAlt} fill sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 46vw, 370px" className="object-cover" /></div>
          <h3>{post.title}</h3>
          {post.excerpt && <p>{post.excerpt}</p>}
          <span className="facebook-update-action">{th ? "อ่านบน Facebook" : "Read on Facebook"}<ArrowUpRight size={18} aria-hidden="true" /></span>
        </a>
      </li>)}</ul>
    </div>
  </section>
}
