import Image from "next/image"

import { uiText } from "@/app/lib/i18n/ui"
import { CompanyView } from "@/app/lib/types/view"

import { CONTAINER, HOME, SECTION_HEADING, SECTION_PAD } from "./home-theme"

const PhoneIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const MailIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const PinIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
      d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

interface ContactSectionProps {
  data: CompanyView
  locale: "th" | "en"
}

export default function ContactSection({ data, locale }: ContactSectionProps) {
  return (
    <section id="contact" className={`relative ${SECTION_PAD}`} style={{ background: HOME.cream }}>
      <div className={CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">

          {/* ── Left: message ────────────────────────────────────── */}
          <div>
            <p
              className="text-[12px] font-bold uppercase tracking-[0.14em]"
              style={{ color: HOME.mintInk }}
            >
              {locale === "th" ? "ติดต่อเรา" : "Get in touch"}
            </p>
            <h2
              className={`mt-4 ${SECTION_HEADING} text-[clamp(1.6rem,1.1rem+1.8vw,2.5rem)] font-bold`}
              style={{ color: HOME.ink }}
            >
              {uiText.contact.title[locale]} {uiText.contact.subtitle[locale]}
            </h2>
            <p className="mt-4 max-w-md text-[1rem] leading-[1.7]" style={{ color: HOME.inkMid }}>
              {uiText.contact.desc[locale]}
            </p>

            {data.address && (
              <div className="mt-7 flex items-start gap-3" style={{ color: HOME.inkMid }}>
                <span className="mt-0.5 shrink-0" style={{ color: HOME.mintInk }}><PinIcon /></span>
                <p className="text-[0.92rem] leading-[1.65]">{data.address}</p>
              </div>
            )}
          </div>

          {/* ── Right: contact card ──────────────────────────────── */}
          <div
            className="overflow-hidden rounded-lg"
            style={{ background: HOME.surface, border: `1px solid ${HOME.line}` }}
          >
            {/* Phones */}
            <div className="p-7 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: HOME.inkSoft }}>
                {uiText.contact.phoneLabel[locale]}
              </p>
              <div className="mt-4 space-y-3">
                {data.phones.map(phone => (
                  <a
                    key={phone.number}
                    href={`tel:${phone.number.replace(/-/g, "")}`}
                    className="home-card flex items-center gap-3.5 rounded-[6px] px-4 py-3"
                    style={{ background: HOME.cream, border: `1px solid ${HOME.line}` }}
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                      style={{ background: HOME.mintSoft, color: HOME.mintInk }}
                    >
                      <PhoneIcon />
                    </span>
                    <span>
                      <span className="block text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: HOME.inkSoft }}>
                        {phone.label}
                      </span>
                      <span className="text-[1.05rem] font-bold" style={{ color: HOME.ink }}>
                        {phone.number}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Emails */}
            {data.email.length > 0 && (
              <div className="border-t px-7 py-6 sm:px-8" style={{ borderColor: HOME.line }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: HOME.inkSoft }}>
                  {uiText.contact.emailLabel[locale]}
                </p>
                <div className="mt-3 space-y-2.5">
                  {data.email.map(email => (
                    <a key={email} href={`mailto:${email}`} className="flex items-center gap-3.5">
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                        style={{ background: HOME.mist, color: HOME.inkMid }}
                      >
                        <MailIcon />
                      </span>
                      <span className="break-all text-[0.95rem] font-semibold" style={{ color: HOME.ink }}>
                        {email}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* LINE */}
            {data.lineQrCode && (
              <div
                className="flex items-center gap-4 border-t px-7 py-6 sm:px-8"
                style={{ borderColor: HOME.line, background: HOME.mintSoft }}
              >
                <div
                  className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[6px]"
                  style={{ border: `1px solid ${HOME.line}`, background: HOME.surface }}
                >
                  <Image
                    src={data.lineQrCode.src}
                    alt={data.lineQrCode.alt}
                    fill
                    sizes="72px"
                    className="object-contain p-1.5"
                  />
                </div>
                <div>
                  <p className="text-[0.95rem] font-bold" style={{ color: HOME.ink }}>
                    {uiText.contact.lineLabel[locale]}
                  </p>
                  <p className="mt-1 text-[0.85rem] leading-[1.55]" style={{ color: HOME.inkMid }}>
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
