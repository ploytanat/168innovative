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
  locale: "th",
  title: "ติดต่อ 168 Innovative",
  description:
    "ติดต่อ 168 Innovative เพื่อสอบถามสินค้า บรรจุภัณฑ์เครื่องสำอาง งาน OEM และบริการสั่งผลิต พร้อมช่องทางโทร อีเมล และแผนที่บริษัท",
  path: "/contact",
  keywords: ["ติดต่อ 168 Innovative", "สอบถามสินค้า", "OEM packaging contact"],
})

export default async function ContactPage() {
  const locale: Locale = "th"
  const company = await getCompany(locale)

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>ไม่พบข้อมูลติดต่อ</p>
      </div>
    )
  }

  return (
    <main className="overflow-x-hidden bg-transparent">
      <BackgroundBlobs />

      <div className="mx-auto max-w-7xl relative px-6 pb-16 lg:px-8">
        <PageIntro
          title="ติดต่อเรา"
          description="สอบถามข้อมูลสินค้า ราคา และบริการ OEM / ODM ผ่านโทรศัพท์ อีเมล หรือช่องทางโซเชียลของบริษัท"
          breadcrumbs={[{ label: "ติดต่อเรา" }]}
        />

        <section className="relative mt-12 overflow-hidden rounded-[2.5rem] border border-[rgba(205,222,241,0.78)] bg-[linear-gradient(145deg,rgba(255,255,255,0.84),rgba(241,251,255,0.8),rgba(255,241,246,0.74))] shadow-[0_24px_64px_rgba(28,40,66,0.1)] backdrop-blur-xl">
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#cab8f2]/18 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#9ddcf6]/20 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 divide-y divide-[rgba(205,222,241,0.62)] lg:grid-cols-[3fr_2fr] lg:divide-x lg:divide-y-0">
            <div className="flex justify-center p-8 md:p-14">
              <div className="w-full max-w-md space-y-12">
                <ContactSection icon={<Phone />} title="Phone">
                  <ContactPhoneList phones={company.phones} locale="th" />
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

            <div className="flex flex-col items-center justify-center bg-white/16 p-8 text-center md:p-14">
              {company.lineQrCode && (
                <div className="mb-8">
                  <div className="inline-block rounded-3xl border border-[rgba(205,222,241,0.72)] bg-white/88 p-3 shadow-xl">
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
                  <p className="mt-4 text-sm font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">
                    สแกนเพื่อเพิ่มเพื่อน
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
                            className="rounded-2xl border border-[rgba(205,222,241,0.72)] bg-white/72 p-1.5 transition-transform hover:scale-110 active:scale-95"
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
            <div className="mt-1 rounded-lg bg-[linear-gradient(135deg,#2ecfc4,#8ebcf5)] p-2">
              <MapPin className="h-5 w-5 shrink-0 text-white" />
            </div>
            <p className="text-xl font-bold leading-relaxed text-[var(--color-ink)] md:text-2xl">
              {company.address}
            </p>
          </div>
        </div>

        <LazyMap
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242.35381407222152!2d100.42350364739633!3d13.617503153068256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2bd007a6774dd%3A0xa3b3383a2a290b44!2s168%20INNOVATIVE!5e0!3m2!1sth!2sth!4v1771555949779!5m2!1sth!2sth"
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
      <div className="mb-4 rounded-xl bg-[linear-gradient(135deg,#2ecfc4,#8ebcf5)] p-3 text-white shadow-lg">{icon}</div>
      <h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[#8ea0b8]">
        {title}
      </h3>
      <div className="mb-6 h-1 w-12 rounded-full bg-[linear-gradient(90deg,#2ecfc4,#f8a7b8)]" />
      <div className="w-full">{children}</div>
    </div>
  )
}
