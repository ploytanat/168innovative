import type { CSSProperties } from "react"

import Image from "next/image"

import { uiText } from "@/app/lib/i18n/ui"
import { CompanyView } from "@/app/lib/types/view"

import BackgroundBlobs from "../ui/BackgroundBlobs"

const PhoneIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)

const MailIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

const ArrowUpRightIcon = () => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16V4m0 0L3 8m4-4l10 10"
    />
  </svg>
)

interface ContactSectionProps {
  data: CompanyView
  locale: "th" | "en"
}

export default function ContactSection({
  data,
  locale,
}: ContactSectionProps) {
  return (
    <section id="contact" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[rgba(205,222,241,0.82)] bg-[linear-gradient(135deg,#ffffff_0%,#eefbff_44%,#fff0f5_100%)] p-6 shadow-[0_32px_90px_rgba(28,40,66,0.14)] sm:p-10 md:p-16 lg:p-20">
          <div className="absolute inset-0 -z-10 opacity-25">
            <BackgroundBlobs />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(248,167,184,0.16),transparent_24%),radial-gradient(circle_at_left_center,rgba(46,207,196,0.14),transparent_26%),radial-gradient(circle_at_bottom,rgba(202,184,242,0.16),transparent_26%)]" />

          <div className="grid items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="space-y-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  Contact Desk
                </p>
                <h2 className="text-3xl font-black leading-[1.1] text-[var(--color-ink)] sm:text-4xl md:text-6xl">
                  {uiText.contact.title[locale]} <br />
                  <span className="text-[#8ebcf5]">
                    {uiText.contact.subtitle[locale]}
                  </span>
                </h2>
                <p className="mt-6 max-w-md text-[1.05rem] leading-8 text-[var(--color-ink-soft)] md:text-lg">
                  {uiText.contact.desc[locale]}
                </p>
              </div>

              <div className="mt-10 w-full max-w-md space-y-4">
                  <div className="overflow-hidden rounded-[2rem] border border-[rgba(205,222,241,0.72)] bg-white/92 shadow-2xl">
                  <div className="border-b border-[#eef2f6] p-6 md:p-8">
                    <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                      {uiText.contact.phoneLabel[locale]}
                    </p>

                    <div className="space-y-5">
                      {data.phones.map((phone) => (
                        <a
                          key={phone.number}
                          href={`tel:${phone.number.replace(/-/g, "")}`}
                          className="group flex items-center justify-between transition-all"
                        >
                          <div className="flex items-center gap-4 text-left">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf9f7] text-[var(--color-accent)] transition-all duration-300 group-hover:bg-[var(--color-accent)] group-hover:text-white">
                              <PhoneIcon />
                            </div>
                            <div>
                              <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-[#7487a3]">
                                {phone.label}
                              </span>
                              <span className="text-xl font-bold text-[var(--color-ink)] md:text-[1.4rem]">
                                {phone.number}
                              </span>
                            </div>
                          </div>
                          <ArrowUpRightIcon />
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[linear-gradient(145deg,#f6fdff,#fff3f7)] p-6 md:p-8">
                    <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                      {uiText.contact.emailLabel[locale]}
                    </p>
                    <div className="space-y-4">
                      {data.email.map((email) => (
                        <a
                          key={email}
                          href={`mailto:${email}`}
                          className="group flex items-center gap-4"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(205,222,241,0.72)] bg-white text-[#8fa2b8] transition-all duration-300 group-hover:bg-[var(--color-ink)] group-hover:text-white">
                            <MailIcon />
                          </div>
                          <span className="break-all text-base font-bold text-[var(--color-ink)] md:text-[1.05rem]">
                            {email}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {data.lineQrCode && (
                  <div className="flex items-center gap-5 rounded-2xl border border-[rgba(46,207,196,0.26)] bg-[linear-gradient(145deg,rgba(238,253,249,0.9),rgba(242,237,255,0.86))] p-4 shadow-sm backdrop-blur">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[rgba(46,207,196,0.42)] bg-white">
                      <Image
                        src={data.lineQrCode.src}
                        alt={data.lineQrCode.alt}
                        fill
                        sizes="4rem"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-[var(--color-ink)]">
                        {uiText.contact.lineLabel[locale]}
                      </p>
                      <p className="text-[13px] font-medium leading-6 text-[var(--color-ink-soft)]">
                        {uiText.contact.lineDesc[locale]}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6 md:gap-8">
                {data.contactGallery?.slice(0, 4).map((image, index) => {
                  const zigzag = index % 2 === 1

                  return (
                    <div
                      key={image.src}
                      className={`floating-animation relative overflow-hidden rounded-3xl border border-white/10 bg-white/80 shadow-xl ${zigzag ? "translate-y-10 md:translate-y-14" : ""}`}
                      style={
                        {
                          "--floating-duration": `${6 + index * 0.4}s`,
                        } as CSSProperties
                      }
                    >
                      <div className="relative h-[220px] w-full sm:h-[260px] lg:h-[300px]">
                        <Image
                          src={image.src}
                          alt={image.alt || "Product"}
                          fill
                          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 35vw, 20vw"
                          className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.05]"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
