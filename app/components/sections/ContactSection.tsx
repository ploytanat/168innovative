"use client"

import Image from "next/image"
import { motion } from "framer-motion"

import { uiText } from "@/app/lib/i18n/ui"
import { CompanyView } from "@/app/lib/types/view"

import { fadeUp, MOTION_EASE, MOTION_VIEWPORT, staggerSmall } from "../ui/motion"
import { CONTAINER, DISPLAY_HEADING, HOME, SECTION_PAD } from "./home-theme"

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

const ArrowIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 17L17 7M7 7h10v10" />
  </svg>
)

interface ContactSectionProps {
  data: CompanyView
  locale: "th" | "en"
}

export default function ContactSection({ data, locale }: ContactSectionProps) {
  const gallery = data.contactGallery?.slice(0, 4) ?? []

  return (
    <section id="contact" className={`relative ${SECTION_PAD}`} style={{ background: HOME.darkBg }}>
      <div className={CONTAINER}>
        <motion.div
          className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14"
          variants={staggerSmall}
          initial="hidden"
          whileInView="visible"
          viewport={MOTION_VIEWPORT}
        >
          {/* ── Left: message ────────────────────────────────────── */}
          <motion.div variants={fadeUp} transition={{ duration: 0.55, ease: MOTION_EASE }}>
            <div className="flex items-center gap-3">
              <span className="h-px w-9" style={{ background: "#86a9da" }} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#86a9da" }}>
                {locale === "th" ? "ติดต่อเรา" : "Get in touch"}
              </span>
            </div>

            <h2
              className={`mt-5 ${DISPLAY_HEADING} font-bold text-[clamp(2rem,1.4rem+2.4vw,3.2rem)]`}
              style={{ color: HOME.onDark }}
            >
              {uiText.contact.title[locale]}{" "}
              <span style={{ color: "#86a9da" }}>{uiText.contact.subtitle[locale]}</span>
            </h2>

            <p className="mt-5 max-w-md text-[1rem] leading-[1.85]" style={{ color: HOME.onDarkMid }}>
              {uiText.contact.desc[locale]}
            </p>

            {data.address && (
              <div className="mt-8 flex items-start gap-3" style={{ color: HOME.onDarkMid }}>
                <span className="mt-0.5 shrink-0" style={{ color: "#86a9da" }}><PinIcon /></span>
                <p className="text-[0.92rem] leading-[1.7]">{data.address}</p>
              </div>
            )}

            {/* Gallery strip */}
            {gallery.length > 0 && (
              <div className="mt-9 grid grid-cols-4 gap-2.5">
                {gallery.map(image => (
                  <div
                    key={image.src}
                    className="relative aspect-square overflow-hidden rounded-xl"
                    style={{ border: `1px solid ${HOME.darkLine}`, background: HOME.darkPanel }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt || "168 Innovative"}
                      fill
                      sizes="(max-width:1024px) 22vw, 12vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Right: contact card ──────────────────────────────── */}
          <motion.div
            className="overflow-hidden rounded-2xl"
            style={{ background: HOME.surface }}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: MOTION_EASE }}
          >
            {/* Phones */}
            <div className="p-7 sm:p-9">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: HOME.inkSoft }}>
                {uiText.contact.phoneLabel[locale]}
              </p>
              <div className="mt-5 space-y-3">
                {data.phones.map(phone => (
                  <a
                    key={phone.number}
                    href={`tel:${phone.number.replace(/-/g, "")}`}
                    className="home-card group flex items-center justify-between gap-4 rounded-xl px-4 py-3.5"
                    style={{ border: `1px solid ${HOME.line}`, background: HOME.paper }}
                  >
                    <span className="flex items-center gap-3.5">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ background: HOME.accentTint, color: HOME.accent }}
                      >
                        <PhoneIcon />
                      </span>
                      <span>
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: HOME.inkSoft }}>
                          {phone.label}
                        </span>
                        <span className="text-[1.05rem] font-bold" style={{ color: HOME.ink }}>
                          {phone.number}
                        </span>
                      </span>
                    </span>
                    <span style={{ color: HOME.accent }}><ArrowIcon /></span>
                  </a>
                ))}
              </div>
            </div>

            {/* Emails */}
            {data.email.length > 0 && (
              <div className="border-t px-7 py-7 sm:px-9" style={{ borderColor: HOME.line }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: HOME.inkSoft }}>
                  {uiText.contact.emailLabel[locale]}
                </p>
                <div className="mt-4 space-y-3">
                  {data.email.map(email => (
                    <a key={email} href={`mailto:${email}`} className="group flex items-center gap-3.5">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ border: `1px solid ${HOME.line}`, color: HOME.inkMid }}
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
                className="flex items-center gap-5 border-t px-7 py-7 sm:px-9"
                style={{ borderColor: HOME.line, background: HOME.accentTint }}
              >
                <div
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl"
                  style={{ border: `1px solid ${HOME.line}`, background: HOME.surface }}
                >
                  <Image
                    src={data.lineQrCode.src}
                    alt={data.lineQrCode.alt}
                    fill
                    sizes="5rem"
                    className="object-contain p-1.5"
                  />
                </div>
                <div>
                  <p className="text-[0.95rem] font-bold" style={{ color: HOME.ink }}>
                    {uiText.contact.lineLabel[locale]}
                  </p>
                  <p className="mt-1 text-[0.85rem] leading-[1.6]" style={{ color: HOME.inkMid }}>
                    {uiText.contact.lineDesc[locale]}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
