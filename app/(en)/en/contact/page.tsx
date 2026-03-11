import type { Metadata } from "next"
import Image from "next/image"
import { Mail, MapPin, Phone } from "lucide-react"

import BackgroundBlobs from "@/app/components/ui/BackgroundBlobs"
import ContactPhoneList from "@/app/components/ui/ContactPhoneList"
import LazyMap from "@/app/components/ui/LazyMap"
import PageIntro from "@/app/components/ui/PageIntro"
import { buildMetadata } from "@/app/config/seo"
import { getCompany } from "@/app/lib/api/company"
import type { Locale } from "@/app/lib/types/content"

export const metadata: Metadata = buildMetadata({
  locale: "en",
  title: "Contact 168 Innovative",
  description:
    "Contact 168 Innovative for product inquiries, cosmetic packaging sourcing, OEM support, and company contact details.",
  path: "/contact",
  keywords: ["contact 168 Innovative", "cosmetic packaging contact", "OEM packaging inquiry"],
})

export default async function ContactPage() {
  const locale: Locale = "en"
  const company = await getCompany(locale)

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Contact information not found</p>
      </div>
    )
  }

  return (
    <main className="bg-[#ebebeb5c] overflow-x-hidden">
      <BackgroundBlobs />

      <div className="mx-auto max-w-7xl relative px-6 pb-16 lg:px-8">
        <PageIntro
          title="Contact Us"
          description="Talk with our team about packaging products, pricing, OEM / ODM support, or sourcing requirements."
          breadcrumbs={[{ label: "Contact" }]}
        />

        <section className="relative mt-12 overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/40 shadow-2xl backdrop-blur-xl">
          <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 divide-y divide-gray-200/50 lg:grid-cols-[3fr_2fr] lg:divide-x lg:divide-y-0">
            <div className="flex justify-center p-8 md:p-14">
              <div className="w-full max-w-md space-y-12">
                <ContactSection icon={<Phone />} title="Phone">
                  <ContactPhoneList phones={company.phones} locale="en" />
                </ContactSection>

                <ContactSection icon={<Mail />} title="Email">
                  {company.email?.map((mail, i) => (
                    <p key={i} className="text-lg font-semibold text-gray-800 break-all">
                      {mail}
                    </p>
                  ))}
                </ContactSection>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-white/20 p-8 text-center md:p-14">
              {company.lineQrCode && (
                <div className="mb-8">
                  <div className="inline-block rounded-3xl bg-white p-3 shadow-xl">
                    <div className="relative block h-40 w-40">
                      <Image
                        src={company.lineQrCode.src}
                        alt={company.lineQrCode.alt}
                        fill
                        sizes="160px"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-bold uppercase tracking-widest text-gray-600">
                    Scan to Add Line
                  </p>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-4">
                {company.socials?.map(
                  (social, i) =>
                    social.icon && (
                      <a
                        key={i}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-transform hover:scale-110 active:scale-95"
                      >
                        <Image
                          src={social.icon.src}
                          alt={social.icon.alt || social.type}
                          width={48}
                          height={48}
                          className="rounded-2xl shadow-md"
                        />
                      </a>
                    )
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-8">
        <div className="mx-auto mb-12 max-w-4xl px-6 text-center">
          <div className="inline-flex items-start gap-4 text-left">
            <div className="mt-1 rounded-lg bg-black p-2">
              <MapPin className="h-5 w-5 shrink-0 text-white" />
            </div>
            <p className="text-xl font-bold leading-relaxed text-gray-800 md:text-2xl">
              {company.address}
            </p>
          </div>
        </div>

        <LazyMap
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5536486253416!2d100.523186!3d13.736717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ0JzEyLjIiTiAxMDDCsDMxJzIzLjUiRQ!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth"
          title="168 Innovative Location"
        />
      </section>
    </main>
  )
}

function ContactSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center text-center md:items-start md:text-left">
      <div className="mb-4 rounded-xl bg-[#222] p-3 text-white shadow-lg">{icon}</div>
      <h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-gray-400">
        {title}
      </h3>
      <div className="mb-6 h-1 w-12 rounded-full bg-black/10" />
      <div className="w-full">{children}</div>
    </div>
  )
}
