import Link from "next/link"

type Locale = "th" | "en"

const copy = {
  th: {
    heading: "ไม่พบหน้าที่คุณต้องการ",
    description:
      "หน้านี้อาจถูกย้าย ลบ หรือไม่เคยมีอยู่ ลองกลับไปหน้าแรกหรือติดต่อทีมงานของเรา",
    homeHref: "/",
    homeLabel: "กลับหน้าแรก",
    contactHref: "/contact",
    contactLabel: "ติดต่อเรา",
  },
  en: {
    heading: "Page not found",
    description:
      "This page may have been moved, deleted, or never existed. Try returning home or contact our team.",
    homeHref: "/en",
    homeLabel: "Back Home",
    contactHref: "/en/contact",
    contactLabel: "Contact Us",
  },
} as const

export default function NotFoundView({ locale }: { locale: Locale }) {
  const text = copy[locale]

  return (
    <section className="not-found-page" aria-labelledby="not-found-title">
      <p className="not-found-code" aria-hidden="true">404</p>
      <h1 id="not-found-title">{text.heading}</h1>
      <p className="not-found-description">{text.description}</p>
      <div className="not-found-actions">
        <Link href={text.homeHref} className="btn-primary-soft">{text.homeLabel}</Link>
        <Link href={text.contactHref} className="not-found-contact">{text.contactLabel}</Link>
      </div>
    </section>
  )
}
