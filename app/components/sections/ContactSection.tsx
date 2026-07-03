import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, ShoppingBag, type LucideIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { uiText } from "@/app/lib/i18n/ui"
import { CompanyView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

import { CONTAINER, HOME, SECTION_HEADING, SECTION_PAD } from "./home-theme"

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  facebook: Facebook,
  line: MessageCircle,
  instagram: Instagram,
  shopee: ShoppingBag,
}

const COPY = {
  sendMessage: { th: "ส่งข้อความหาเรา", en: "Send us a message" },
  followUs:    { th: "ติดตามเรา",        en: "Follow us" },
} as const

export default function ContactSection({ data, locale }: { data: CompanyView; locale: "th" | "en" }) {
  return (
    <section id="contact" className={`relative ${SECTION_PAD}`} style={{ background: HOME.dark }}>
      <div className={CONTAINER}>
        <div className="grid gap-10 md:grid-cols-[1fr_1.05fr] md:gap-12 lg:gap-14">

          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: HOME.mint }}>
              {locale === "th" ? "ติดต่อเรา" : "Get in touch"}
            </p>
            <h2 className={`mt-4 ${SECTION_HEADING} text-[clamp(1.6rem,1.1rem+1.8vw,2.5rem)] font-bold`} style={{ color: HOME.darkText }}>
              {uiText.contact.title[locale]}<br />
              <span style={{ color: HOME.mint }}>{uiText.contact.subtitle[locale]}</span>
            </h2>
            <p className="mt-4 max-w-md text-[1.05rem] leading-[1.7]" style={{ color: HOME.darkMuted }}>
              {uiText.contact.desc[locale]}
            </p>

            <Link href={withLocalePath("/contact", locale)}
              className="home-btn home-btn-light mt-7 inline-flex items-center rounded px-6 py-3 text-[14px] font-bold">
              {COPY.sendMessage[locale]} →
            </Link>

            {data.address && (
              <div className="mt-7 flex items-start gap-3" style={{ color: HOME.darkMuted }}>
                <MapPin className="mt-0.5 h-5 w-5 shrink-0" style={{ color: HOME.mint }} />
                <p className="text-[1rem] leading-[1.65]">{data.address}</p>
              </div>
            )}

            {data.socials.length > 0 && (
              <div className="mt-7">
                <p className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: HOME.darkDim }}>
                  {COPY.followUs[locale]}
                </p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {data.socials.map(s => {
                    const Icon = SOCIAL_ICONS[s.type] ?? MessageCircle
                    return (
                      <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.type}
                        className="flex h-11 w-11 items-center justify-center rounded transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6f0d9]"
                        style={{ background: HOME.darkTile, border: `1px solid ${HOME.darkLine}`, color: HOME.darkText }}>
                        <Icon className="h-[18px] w-[18px]" />
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-lg" style={{ background: HOME.surface, border: `1px solid ${HOME.line}` }}>
            <div className="p-7 sm:p-8">
              <p className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: HOME.inkSoft }}>
                {uiText.contact.phoneLabel[locale]}
              </p>
              <div className="mt-4 space-y-3">
                {data.phones.map(phone => (
                  <a key={phone.number} href={`tel:${phone.number.replace(/-/g, "")}`}
                    className="home-card flex items-center gap-3.5 rounded-lg px-4 py-3"
                    style={{ background: HOME.cream, border: `1px solid ${HOME.line}` }}>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded"
                      style={{ background: HOME.mintSoft, color: HOME.mintInk }}>
                      <Phone className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <span>
                      <span className="block text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: HOME.inkSoft }}>
                        {phone.label}
                      </span>
                      <span className="text-[1.1rem] font-bold" style={{ color: HOME.ink }}>
                        {phone.number}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {data.email.length > 0 && (
              <div className="border-t px-7 py-6 sm:px-8" style={{ borderColor: HOME.line }}>
                <p className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: HOME.inkSoft }}>
                  {uiText.contact.emailLabel[locale]}
                </p>
                <div className="mt-3 space-y-2.5">
                  {data.email.map(email => (
                    <a key={email} href={`mailto:${email}`} className="flex items-center gap-3.5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded"
                        style={{ background: HOME.mist, color: HOME.inkMid }}>
                        <Mail className="h-5 w-5" strokeWidth={1.6} />
                      </span>
                      <span className="break-all text-[1rem] font-semibold" style={{ color: HOME.ink }}>
                        {email}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {data.lineQrCode && (
              <div className="flex items-center gap-4 border-t px-7 py-6 sm:px-8"
                style={{ borderColor: HOME.line, background: HOME.mintSoft }}>
                <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg"
                  style={{ border: `1px solid ${HOME.line}`, background: HOME.surface }}>
                  <Image src={data.lineQrCode.src} alt={data.lineQrCode.alt} fill sizes="72px" className="object-contain p-1.5" />
                </div>
                <div>
                  <p className="text-[1rem] font-bold" style={{ color: HOME.ink }}>
                    {uiText.contact.lineLabel[locale]}
                  </p>
                  <p className="mt-1 text-[0.95rem] leading-[1.55]" style={{ color: HOME.inkMid }}>
                    {uiText.contact.lineDesc[locale]}
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
