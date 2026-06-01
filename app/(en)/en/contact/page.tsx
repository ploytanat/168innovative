import type { Metadata } from "next"
import Image from "next/image"
import { Mail, MapPin, Phone } from "lucide-react"

import { HOME } from "@/app/components/sections/home-theme"
import LazyMap from "@/app/components/ui/LazyMap"
import PageIntro from "@/app/components/ui/PageIntro"
import { buildMetadata } from "@/app/config/seo"
import { getCompany } from "@/app/lib/api/company"
import type { Locale } from "@/app/lib/types/content"
import type { CompanyView } from "@/app/lib/types/view"

const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5536486253416!2d100.523186!3d13.736717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ0JzEyLjIiTiAxMDDCsDMxJzIzLjUiRQ!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth"

export const metadata: Metadata = buildMetadata({
  locale: "en",
  title: "Contact 168 Innovative",
  description:
    "Contact 168 Innovative for product inquiries, cosmetic packaging sourcing, OEM support, and company contact details.",
  path: "/contact",
  keywords: ["contact 168 Innovative", "cosmetic packaging contact", "OEM packaging inquiry"],
})

const COPY = {
  phoneLabel: "Phone",
  emailLabel: "Email",
  salesLabel: "Sales Team",
  qrLabel: "Scan to add on LINE",
  socialLabel: "Other channels",
  locationLabel: "Location",
}

function isOfficeLabel(label: string) {
  const n = label.trim().toLowerCase()
  return n.includes("สำนักงานใหญ่") || n.includes("ติดต่อสำนักงาน") || n.includes("head office") || n.includes("office")
}

export default async function ContactPage() {
  const locale: Locale = "en"
  const company = await getCompany(locale)

  if (!company) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Contact information not found</p>
      </div>
    )
  }

  return (
    <main className="overflow-x-hidden bg-transparent">
      <div className="relative mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <PageIntro
          title="Contact Us"
          description="Talk with our team about packaging products, pricing, OEM / ODM support, or sourcing requirements."
          breadcrumbs={[{ label: "Contact" }]}
        />

        <section className="mt-10 lg:mt-12">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[3fr_2fr]">

            {/* Left: Phone + Email */}
            <div
              className="rounded-2xl p-7 md:p-10"
              style={{ background: HOME.surface, border: `1px solid ${HOME.line}` }}
            >
              <div className="grid gap-y-10 gap-x-10 sm:grid-cols-2">
                <ContactBlock icon={<Phone className="h-[18px] w-[18px]" strokeWidth={1.6} />} label={COPY.phoneLabel}>
                  <PhoneList phones={company.phones} salesLabel={COPY.salesLabel} />
                </ContactBlock>

                <ContactBlock icon={<Mail className="h-[18px] w-[18px]" strokeWidth={1.6} />} label={COPY.emailLabel}>
                  <ul className="space-y-2">
                    {company.email.map((mail, i) => (
                      <li key={i}>
                        <a
                          href={`mailto:${mail}`}
                          className="text-[1.05rem] font-semibold break-all transition-colors hover:opacity-70"
                          style={{ color: HOME.ink }}
                        >
                          {mail}
                        </a>
                      </li>
                    ))}
                  </ul>
                </ContactBlock>
              </div>
            </div>

            {/* Right: QR + socials */}
            <div
              className="flex flex-col items-center justify-center rounded-2xl p-7 text-center md:p-10"
              style={{ background: HOME.cream, border: `1px solid ${HOME.line}` }}
            >
              {company.lineQrCode && (
                <div className="flex flex-col items-center">
                  <div
                    className="rounded-xl p-2.5"
                    style={{ background: HOME.surface, border: `1px solid ${HOME.line}` }}
                  >
                    <div className="relative h-36 w-36 sm:h-40 sm:w-40">
                      <Image
                        src={company.lineQrCode.src}
                        alt={company.lineQrCode.alt}
                        fill
                        sizes="160px"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: HOME.mintInk }}>
                    {COPY.qrLabel}
                  </p>
                </div>
              )}

              {company.socials && company.socials.length > 0 && (
                <>
                  {company.lineQrCode && (
                    <span aria-hidden className="my-6 inline-block h-px w-10" style={{ background: HOME.line }} />
                  )}
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: HOME.inkSoft }}>
                    {COPY.socialLabel}
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {company.socials.map((s, i) =>
                      s.icon ? (
                        <a
                          key={i}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.type}
                          className="block overflow-hidden rounded-xl transition-transform hover:-translate-y-0.5"
                          style={{ background: HOME.surface, border: `1px solid ${HOME.line}` }}
                        >
                          <Image
                            src={s.icon.src}
                            alt={s.icon.alt || s.type}
                            width={44}
                            height={44}
                            className="block"
                          />
                        </a>
                      ) : null
                    )}
                  </div>
                </>
              )}
            </div>

          </div>
        </section>
      </div>

      {/* Address + Map */}
      <section className="mt-2">
        <div className="mx-auto mb-8 max-w-3xl px-6">
          <div
            className="flex items-start gap-4 rounded-xl p-5"
            style={{ background: HOME.surface, border: `1px solid ${HOME.line}` }}
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              style={{ background: HOME.mintSoft, color: HOME.mintInk }}
            >
              <MapPin className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: HOME.inkSoft }}>
                {COPY.locationLabel}
              </p>
              <p className="mt-1.5 text-[1.05rem] font-bold leading-[1.55] md:text-[1.15rem]" style={{ color: HOME.ink }}>
                {company.address}
              </p>
            </div>
          </div>
        </div>

        <LazyMap src={MAP_SRC} title="168 Innovative Location" />
      </section>
    </main>
  )
}

function ContactBlock({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-2.5">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: HOME.mist, color: HOME.mintInk }}
        >
          {icon}
        </span>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: HOME.inkSoft }}>
          {label}
        </p>
      </div>
      {children}
    </div>
  )
}

function PhoneList({ phones, salesLabel }: { phones: CompanyView["phones"]; salesLabel: string }) {
  const office = phones.filter(p => isOfficeLabel(p.label))
  const sales = phones.filter(p => !isOfficeLabel(p.label))

  return (
    <div>
      <ul className="space-y-4">
        {office.map((phone, i) => (
          <PhoneRow key={`${phone.number}-${i}`} number={phone.number} label={phone.label} />
        ))}
      </ul>

      {office.length > 0 && sales.length > 0 && (
        <p className="mb-3 mt-6 text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: HOME.inkSoft }}>
          {salesLabel}
        </p>
      )}

      <ul className="space-y-4">
        {sales.map((phone, i) => (
          <PhoneRow key={`${phone.number}-${i}`} number={phone.number} label={phone.label} />
        ))}
      </ul>
    </div>
  )
}

function PhoneRow({ number, label }: { number: string; label: string }) {
  return (
    <li>
      <a
        href={`tel:${number.replace(/-/g, "")}`}
        className="block transition-colors hover:opacity-70"
      >
        <p className="text-[1.3rem] font-bold tabular-nums" style={{ color: HOME.ink }}>{number}</p>
        <p className="text-[13px]" style={{ color: HOME.inkMid }}>{label}</p>
      </a>
    </li>
  )
}
