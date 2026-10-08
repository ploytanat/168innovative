import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Check, Mail, MapPin, Phone, Plus } from "lucide-react"
import type { AboutHeroView, CompanyView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"
import Breadcrumb from "@/app/components/ui/Breadcrumb"
import { homeFont } from "@/app/config/fonts"

export default function AboutOverview({ hero, company, locale }: { hero: AboutHeroView; company: CompanyView | null; locale: "th" | "en" }) {
  const th = locale === "th"
  const services = th ? [
    ["จัดหาและนำเข้า", "เลือกบรรจุภัณฑ์ให้เหมาะกับสินค้าและการใช้งาน"],
    ["รองรับ OEM / ODM", "ประสานงานตามแบบ วัสดุ และจำนวนที่ต้องการ"],
    ["ดูแลการส่งมอบ", "พูดคุยเรื่องสต็อกและการจัดส่งกับทีมงานโดยตรง"],
  ] : [
    ["Sourcing & import", "Find packaging suited to your product and application."],
    ["OEM / ODM support", "Coordinate your design, material and quantity requirements."],
    ["Delivery coordination", "Discuss stock and delivery directly with our team."],
  ]
  const phone = company?.phones[0]
  const email = company?.email[0]
  return (
    <div className={`${homeFont.className} about-overview`}>
      <section className="about-intro">
        <div className="about-container">
          <Breadcrumb items={[{ label: th ? "เกี่ยวกับเรา" : "About us" }]} />
          <div className="about-intro-grid">
            <div className="about-intro-copy">
              <p className="about-brand">168 INNOVATIVE</p>
              <h1>{th ? "คู่คิดด้านบรรจุภัณฑ์" : "Your packaging partner."}<span>{th ? "ที่คุยกันได้ตั้งแต่ต้น" : "From the first conversation."}</span></h1>
              <p className="about-lead">{th ? "เราจัดหาและนำเข้าบรรจุภัณฑ์เครื่องสำอางและผลิตภัณฑ์พลาสติก พร้อมประสานงาน OEM / ODM ให้แบรนด์และผู้ผลิต" : "We source and import cosmetic packaging and plastic products, with OEM / ODM coordination for brands and manufacturers."}</p>
              <div className="about-actions"><Link className="showroom-primary" href={withLocalePath("/contact", locale)}>{th ? "คุยกับทีมงาน" : "Talk to our team"}<ArrowUpRight size={18} aria-hidden="true" /></Link><Link className="about-catalog-link" href={withLocalePath("/categories", locale)}>{th ? "ดูบรรจุภัณฑ์ของเรา" : "Explore our packaging"}<ArrowUpRight size={17} aria-hidden="true" /></Link></div>
              {company?.name && <div className="about-identity"><span>{th ? "รู้จักเรา" : "Who we are"}</span><strong>{company.name}</strong></div>}
            </div>
            {hero.image1?.src && <figure className="about-main-photo"><Image src={hero.image1.src} alt={hero.image1.alt || (th ? "ภาพกระบวนการผลิตบรรจุภัณฑ์" : "Packaging production equipment")} fill priority sizes="(max-width: 767px) 92vw, 52vw" className="object-cover" /><figcaption>{th ? "จากการจัดหา สู่การใช้งานจริง" : "From sourcing to your next product."}</figcaption></figure>}
          </div>
        </div>
      </section>
      <section className="about-services">
        <div className="about-container about-service-grid">
          <div className="about-service-context"><h2>{th ? "สิ่งที่เราช่วยคุณได้" : "What we bring to your project"}</h2><p>{th ? "โฟกัสที่สินค้าของคุณ ให้เราช่วยประสานเรื่องบรรจุภัณฑ์" : "Focus on your product. Let us help coordinate the packaging."}</p>{hero.image2?.src && <div className="about-secondary-photo"><Image src={hero.image2.src} alt={hero.image2.alt || (th ? "ภาพการจัดเก็บบรรจุภัณฑ์" : "Packaging storage")} fill sizes="(max-width: 767px) 90vw, 400px" className="object-cover" /></div>}</div>
          <div><ul className="about-service-list">{services.map(([title, description]) => <li key={title}><div><h3>{title}</h3><p>{description}</p></div><Check size={21} aria-hidden="true" /></li>)}</ul>{hero.description && <details className="about-story"><summary>{th ? "อ่านเพิ่มเติมเกี่ยวกับบริษัท" : "More about our company"}<Plus size={17} aria-hidden="true" /></summary><p>{hero.description}</p></details>}</div>
        </div>
      </section>
      <section className="about-reach">
        <div className="about-container"><div className="about-reach-panel">
          <div className="about-reach-copy"><h2>{th ? "มีสินค้าในใจแล้ว?" : "Have a product in mind?"}</h2><p>{th ? "ส่งรูปแบบที่ชอบ พร้อมจำนวนที่สนใจ ทีมงานจะช่วยคุยเรื่องตัวเลือกและรายละเอียดก่อนสั่งซื้อ" : "Share a reference and your planned quantity. Our team can help clarify options and details before you order."}</p><Link href={withLocalePath("/contact", locale)}>{th ? "ดูช่องทางติดต่อและแผนที่" : "Contact details & location"}<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
          <address className="about-contact-details">{company?.address && <div><MapPin size={20} aria-hidden="true" /><div><span>{th ? "ที่อยู่บริษัท" : "Company address"}</span><p>{company.address}</p></div></div>}{phone && <a href={`tel:${phone.number.replace(/[^+0-9]/g, "")}`}><Phone size={20} aria-hidden="true" /><div><span>{phone.label || (th ? "โทรศัพท์" : "Phone")}</span><strong>{phone.number}</strong></div></a>}{email && <a href={`mailto:${email}`}><Mail size={20} aria-hidden="true" /><div><span>{th ? "อีเมล" : "Email"}</span><strong>{email}</strong></div></a>}{!company && <p>{th ? "ดูช่องทางติดต่อทีมงานได้ที่หน้าติดต่อเรา" : "Visit our contact page to reach the team."}</p>}</address>
        </div></div>
      </section>
    </div>
  )
}
