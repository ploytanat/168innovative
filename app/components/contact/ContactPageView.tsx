import type { ReactNode } from "react"
import Image from "next/image"
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircleMore,
  Phone,
  Sparkles,
} from "lucide-react"

import ContactPhoneList from "@/app/components/ui/ContactPhoneList"
import BackgroundBlobs from "@/app/components/ui/BackgroundBlobs"
import LazyMap from "@/app/components/ui/LazyMap"
import PageIntro from "@/app/components/ui/PageIntro"
import type { Locale } from "@/app/lib/types/content"
import type { CompanyView } from "@/app/lib/types/view"

type ContactSearchParams = {
  product?: string | string[]
  products?: string | string[]
}

type ContactPageViewProps = {
  company: CompanyView
  locale: Locale
  inquiryItems?: string[]
}

const COPY = {
  th: {
    pageTitle: "ติดต่อเรา",
    pageDescription:
      "พูดคุยกับทีมงานเรื่องสินค้า ราคา งาน OEM / ODM หรือส่งรายการสินค้าที่สนใจมาให้เราช่วยแนะนำได้ทันที",
    breadcrumb: "ติดต่อเรา",
    responseBadge: "ตอบกลับไวภายใน 24 ชม.",
    heroEyebrow: "พร้อมคุยเรื่องแพ็กเกจจิ้งของคุณ",
    heroTitle: "คุยกับทีมขายได้ตรงผ่านช่องทางที่สะดวกที่สุด",
    heroBody:
      "รวมเบอร์โทร อีเมล LINE และแผนที่ไว้ในหน้าเดียว เพื่อให้เริ่มต้นสอบถามสินค้า สเปก และใบเสนอราคาได้ง่ายขึ้น",
    inquiryTitle: "รายการที่คุณสนใจ",
    inquiryDescription: "เราจะใช้รายการนี้เป็นบริบทสำหรับการตอบกลับและเสนอสินค้าที่ใกล้เคียง",
    quickFacts: [
      "ส่งสเปกหรือภาพอ้างอิงมาได้ทันที",
      "คุยได้ทั้งโทร อีเมล และ LINE",
      "รองรับงานสั่งผลิตและงานจัดหาสินค้า",
    ],
    callCta: "โทรหาทีมขาย",
    emailCta: "ส่งอีเมลหาเรา",
    lineCta: "แชตผ่าน LINE",
    phoneEyebrow: "Phone",
    phoneTitle: "คุยกับทีมขายโดยตรง",
    phoneDescription: "เหมาะสำหรับสอบถามสต็อก ราคา และรุ่นสินค้าที่ต้องการแบบรวดเร็ว",
    phoneButton: "โทรตอนนี้",
    emailEyebrow: "Email",
    emailTitle: "ส่งรายละเอียดงานให้ประเมิน",
    emailDescription: "แนบสเปก ขนาด รูปอ้างอิง หรือจำนวนที่ต้องการ เพื่อให้ทีมประเมินได้เร็วขึ้น",
    emailButton: "เปิดอีเมล",
    socialEyebrow: "Social",
    socialTitle: "LINE และช่องทางออนไลน์",
    socialDescription: "สแกน QR เพื่อเพิ่มเพื่อน หรือเลือกช่องทางที่คุณใช้อยู่เป็นประจำ",
    lineQrCaption: "สแกนเพื่อเพิ่มเพื่อนใน LINE",
    heroImageBadge: "168 Innovative Packaging",
    galleryTitle: "ตัวอย่างสินค้าที่เราดูแล",
    locationEyebrow: "Location",
    locationTitle: "ที่อยู่และแผนที่",
    locationDescription: "ใช้ Google Maps สำหรับเส้นทาง หรือโทรหาทีมก่อนเข้ามาติดต่อเพื่อความรวดเร็ว",
    openMap: "เปิดใน Google Maps",
    mapTitle: "แผนที่ 168 Innovative",
    mapLoading: "กำลังโหลดแผนที่...",
  },
  en: {
    pageTitle: "Contact Us",
    pageDescription:
      "Reach our team for product sourcing, pricing, OEM / ODM support, or send your shortlist so we can guide you faster.",
    breadcrumb: "Contact",
    responseBadge: "Replies within 24 hrs",
    heroEyebrow: "Talk with our packaging team",
    heroTitle: "Choose the fastest way to reach sales",
    heroBody:
      "Phone, email, LINE, and location details are organized in one place so your first inquiry is easier to send and easier for us to answer.",
    inquiryTitle: "Your inquiry shortlist",
    inquiryDescription: "We will use this context to recommend relevant products and respond faster.",
    quickFacts: [
      "Send specs, references, or target quantity",
      "Reach us by phone, email, or LINE",
      "Support for sourcing and OEM / ODM projects",
    ],
    callCta: "Call Sales",
    emailCta: "Email Our Team",
    lineCta: "Chat on LINE",
    phoneEyebrow: "Phone",
    phoneTitle: "Speak with sales directly",
    phoneDescription: "Best for fast questions about product options, availability, and pricing.",
    phoneButton: "Call now",
    emailEyebrow: "Email",
    emailTitle: "Send your brief for review",
    emailDescription: "Share specs, references, size, or quantity so our team can evaluate more efficiently.",
    emailButton: "Open email",
    socialEyebrow: "Social",
    socialTitle: "LINE and online channels",
    socialDescription: "Scan the QR code to add LINE or jump to the channel you already use.",
    lineQrCaption: "Scan to add LINE",
    heroImageBadge: "168 Innovative Packaging",
    galleryTitle: "Packaging categories we support",
    locationEyebrow: "Location",
    locationTitle: "Address and map",
    locationDescription: "Use Google Maps for directions, or call the team before visiting for a faster handoff.",
    openMap: "Open in Google Maps",
    mapTitle: "168 Innovative Map",
    mapLoading: "Loading map...",
  },
} as const

const MAP_EMBED_URL = {
  th: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242.35381407222152!2d100.42350364739633!3d13.617503153068256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2bd007a6774dd%3A0xa3b3383a2a290b44!2s168%20INNOVATIVE!5e0!3m2!1sth!2sth!4v1771555949779!5m2!1sth!2sth",
  en: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5536486253416!2d100.523186!3d13.736717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ0JzEyLjIiTiAxMDDCsDMxJzIzLjUiRQ!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth",
} as const

function normalizeSearchValue(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value.join("|")
  }

  return value ?? ""
}

export function parseInquiryItems(searchParams?: ContactSearchParams) {
  const raw = normalizeSearchValue(searchParams?.products || searchParams?.product)

  if (!raw) {
    return []
  }

  return Array.from(
    new Set(
      raw
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  )
}

function buildTelHref(phone?: string) {
  if (!phone) {
    return "#"
  }

  return `tel:${phone.replace(/[^+\d]/g, "")}`
}

function buildMailtoHref(email: string, locale: Locale, inquiryItems: string[]) {
  const subject =
    locale === "th"
      ? `สอบถามสินค้า ${inquiryItems[0] ?? "และขอใบเสนอราคา"}`
      : `Product inquiry${inquiryItems[0] ? `: ${inquiryItems[0]}` : ""}`
  const body =
    locale === "th"
      ? [
          "สวัสดีทีม 168 Innovative,",
          "",
          inquiryItems.length ? `สินค้าที่สนใจ: ${inquiryItems.join(", ")}` : "สนใจสอบถามสินค้าและบริการ OEM / ODM",
          "",
          "รายละเอียดเพิ่มเติม:",
        ].join("\n")
      : [
          "Hello 168 Innovative team,",
          "",
          inquiryItems.length
            ? `Interested products: ${inquiryItems.join(", ")}`
            : "I would like to inquire about your products and OEM / ODM support.",
          "",
          "Additional details:",
        ].join("\n")

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function getSocialLabel(type: string) {
  switch (type.toLowerCase()) {
    case "line":
      return "LINE"
    case "facebook":
      return "Facebook"
    case "instagram":
      return "Instagram"
    case "shopee":
      return "Shopee"
    default:
      return type
  }
}

function ContactCard({
  icon,
  eyebrow,
  title,
  description,
  children,
}: {
  icon: ReactNode
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="deck-card h-full rounded-[1.8rem] p-6 sm:p-7">
      <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-[rgba(209,217,228,0.95)] bg-[rgba(244,247,252,0.96)] text-[var(--color-ink)] shadow-[0_8px_18px_rgba(24,35,56,0.06)]">
        {icon}
      </div>
      <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#7b899e]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
        {title}
      </h2>
      <p className="mt-3 max-w-[34ch] text-sm leading-7 text-[var(--color-ink-soft)]">
        {description}
      </p>
      <div className="mt-7">{children}</div>
    </section>
  )
}

export default function ContactPageView({
  company,
  locale,
  inquiryItems = [],
}: ContactPageViewProps) {
  const copy = COPY[locale]
  const gallery = company.contactGallery?.slice(0, 3) ?? []
  const primaryPhone = company.phones[0]?.number
  const primaryEmail = company.email[0]
  const lineSocial = company.socials.find((social) => social.type.toLowerCase() === "line")
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${company.name} ${company.address}`
  )}`

  return (
    <main className="overflow-x-hidden bg-transparent">
      <BackgroundBlobs />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(circle_at_top_right,rgba(74,134,244,0.14),transparent_28%),radial-gradient(circle_at_left_top,rgba(196,123,138,0.14),transparent_24%)]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <PageIntro
          title={copy.pageTitle}
          description={copy.pageDescription}
          breadcrumbs={[{ label: copy.breadcrumb }]}
          actions={
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(208,216,228,0.96)] bg-white/88 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-soft)] shadow-[0_8px_18px_rgba(24,35,56,0.05)] backdrop-blur">
              <Clock3 className="h-3.5 w-3.5 text-[var(--color-accent)]" />
              {copy.responseBadge}
            </div>
          }
        />

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
          <div className="deck-dark-card relative overflow-hidden rounded-[2rem] px-6 py-7 sm:px-8 sm:py-9">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(116,172,255,0.22),transparent_26%),radial-gradient(circle_at_left_bottom,rgba(255,255,255,0.08),transparent_32%)]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/72">
                <Sparkles className="h-3.5 w-3.5" />
                {copy.heroEyebrow}
              </div>
              <h2 className="mt-5 max-w-[12ch] text-3xl font-semibold tracking-tight text-white sm:text-[2.8rem] sm:leading-[1.04]">
                {copy.heroTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-[1rem] leading-8 text-white/76">
                {copy.heroBody}
              </p>

              {inquiryItems.length > 0 ? (
                <div className="mt-7 rounded-[1.5rem] border border-white/12 bg-white/8 p-5 backdrop-blur-sm">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/58">
                    {copy.inquiryTitle}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/74">
                    {copy.inquiryDescription}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {inquiryItems.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/12 bg-white/12 px-4 py-2 text-sm font-medium text-white"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {copy.quickFacts.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.35rem] border border-white/12 bg-white/8 px-4 py-4 text-sm leading-6 text-white/80 backdrop-blur-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {primaryPhone ? (
                  <a
                    href={buildTelHref(primaryPhone)}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#223149] shadow-[0_12px_24px_rgba(16,24,40,0.2)] transition-transform hover:-translate-y-0.5"
                  >
                    <Phone className="h-4 w-4" />
                    {copy.callCta}
                  </a>
                ) : null}

                {lineSocial ? (
                  <a
                    href={lineSocial.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/12"
                  >
                    <MessageCircleMore className="h-4 w-4" />
                    {copy.lineCta}
                  </a>
                ) : null}

                {primaryEmail ? (
                  <a
                    href={buildMailtoHref(primaryEmail, locale, inquiryItems)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-transparent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    <Mail className="h-4 w-4" />
                    {copy.emailCta}
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <section className="deck-card overflow-hidden rounded-[2rem] p-4 sm:p-5">
              <div className="relative aspect-[5/5.4] overflow-hidden rounded-[1.6rem] bg-[linear-gradient(145deg,#eef2f6_0%,#e2e9f1_100%)]">
                {company.contactImage ? (
                  <Image
                    src={company.contactImage.src}
                    alt={company.contactImage.alt}
                    fill
                    sizes="(max-width: 1280px) 100vw, 40vw"
                    className="object-cover"
                  />
                ) : null}
                <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(27,35,48,0.9))] px-5 py-6 text-white sm:px-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/66">
                    {copy.heroImageBadge}
                  </p>
                  <p className="mt-2 text-xl font-semibold tracking-tight">
                    {company.name}
                  </p>
                  <p className="mt-2 max-w-[32ch] text-sm leading-6 text-white/74">
                    {company.address}
                  </p>
                </div>
              </div>
            </section>

            {gallery.length > 0 ? (
              <section className="deck-card-soft rounded-[2rem] p-4 sm:p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#74839b]">
                  {copy.galleryTitle}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {gallery.map((image) => (
                    <div
                      key={image.src}
                      className="overflow-hidden rounded-[1.2rem] border border-[rgba(205,216,229,0.9)] bg-white/88 p-2 shadow-[0_10px_20px_rgba(24,35,56,0.04)]"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-[0.95rem] bg-[linear-gradient(160deg,#f5f7fb,#e8eef5)]">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 768px) 33vw, 12vw"
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-3">
          <ContactCard
            icon={<Phone className="h-5 w-5" />}
            eyebrow={copy.phoneEyebrow}
            title={copy.phoneTitle}
            description={copy.phoneDescription}
          >
            <ContactPhoneList phones={company.phones} locale={locale} />
            {primaryPhone ? (
              <a
                href={buildTelHref(primaryPhone)}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-[rgba(202,212,224,0.96)] bg-[#f7f9fc] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[rgba(150,170,196,0.96)]"
              >
                {copy.phoneButton}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            ) : null}
          </ContactCard>

          <ContactCard
            icon={<Mail className="h-5 w-5" />}
            eyebrow={copy.emailEyebrow}
            title={copy.emailTitle}
            description={copy.emailDescription}
          >
            <div className="space-y-3">
              {company.email.map((email) => (
                <a
                  key={email}
                  href={buildMailtoHref(email, locale, inquiryItems)}
                  className="flex items-center justify-between gap-3 rounded-[1.15rem] border border-[rgba(208,216,228,0.92)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-ink)] shadow-[0_8px_18px_rgba(24,35,56,0.04)] transition-colors hover:border-[rgba(147,166,194,0.92)]"
                >
                  <span className="min-w-0 break-all">{email}</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                </a>
              ))}
            </div>
            {primaryEmail ? (
              <a
                href={buildMailtoHref(primaryEmail, locale, inquiryItems)}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-[rgba(202,212,224,0.96)] bg-[#f7f9fc] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[rgba(150,170,196,0.96)]"
              >
                {copy.emailButton}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            ) : null}
          </ContactCard>

          <ContactCard
            icon={<MessageCircleMore className="h-5 w-5" />}
            eyebrow={copy.socialEyebrow}
            title={copy.socialTitle}
            description={copy.socialDescription}
          >
            {company.lineQrCode ? (
              <div className="rounded-[1.35rem] border border-[rgba(205,216,229,0.92)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,249,252,0.94))] p-4 text-center shadow-[0_10px_24px_rgba(24,35,56,0.05)]">
                <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-[1.1rem] border border-[rgba(212,221,232,0.96)] bg-white p-2 shadow-[0_8px_18px_rgba(24,35,56,0.05)]">
                  <Image
                    src={company.lineQrCode.src}
                    alt={company.lineQrCode.alt}
                    fill
                    sizes="160px"
                    className="object-contain p-2"
                  />
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
                  {copy.lineQrCaption}
                </p>
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-3">
              {company.socials.map((social) => (
                <a
                  key={`${social.type}-${social.url}`}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={getSocialLabel(social.type)}
                  className="inline-flex items-center gap-3 rounded-full border border-[rgba(205,216,229,0.94)] bg-white px-3 py-2.5 text-sm font-semibold text-[var(--color-ink)] shadow-[0_8px_18px_rgba(24,35,56,0.04)] transition-transform hover:-translate-y-0.5"
                >
                  {social.icon ? (
                    <Image
                      src={social.icon.src}
                      alt={social.icon.alt}
                      width={26}
                      height={26}
                      className="rounded-full"
                    />
                  ) : null}
                  {getSocialLabel(social.type)}
                </a>
              ))}
            </div>
          </ContactCard>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="deck-card-soft rounded-[2rem] p-7 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-[rgba(208,216,228,0.94)] bg-white text-[var(--color-ink)] shadow-[0_8px_18px_rgba(24,35,56,0.05)]">
              <MapPin className="h-5 w-5" />
            </div>
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#7b899e]">
              {copy.locationEyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
              {copy.locationTitle}
            </h2>
            <p className="mt-3 max-w-[36ch] text-sm leading-7 text-[var(--color-ink-soft)]">
              {copy.locationDescription}
            </p>

            <div className="mt-6 rounded-[1.5rem] border border-[rgba(205,216,229,0.9)] bg-white/92 p-5 shadow-[0_12px_24px_rgba(24,35,56,0.04)]">
              <p className="text-lg font-semibold text-[var(--color-ink)]">{company.name}</p>
              <p className="mt-3 text-base leading-8 text-[var(--color-ink-soft)]">
                {company.address}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={mapLink}
                target="_blank"
                rel="noreferrer"
                className="btn-primary-soft inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
              >
                {copy.openMap}
                <ArrowUpRight className="h-4 w-4" />
              </a>

              {primaryPhone ? (
                <a
                  href={buildTelHref(primaryPhone)}
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(202,212,224,0.96)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[rgba(150,170,196,0.96)]"
                >
                  {copy.callCta}
                </a>
              ) : null}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-[rgba(210,216,225,0.96)] bg-white p-3 shadow-[0_14px_28px_rgba(24,35,56,0.05)]">
            <LazyMap
              src={MAP_EMBED_URL[locale]}
              title={copy.mapTitle}
              loadingLabel={copy.mapLoading}
              className="h-[360px] rounded-[1.5rem] md:h-[520px]"
            />
          </div>
        </section>
      </div>
    </main>
  )
}
