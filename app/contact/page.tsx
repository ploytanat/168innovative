import { getCompany } from "@/app/lib/api/company";
import { Locale } from "@/app/lib/types/content";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import Breadcrumb from "../components/ui/Breadcrumb";
import BackgroundBlobs from "../components/ui/BackgroundBlobs";

export default async function ContactPage() {
  const locale: Locale = "th";
  const company = await getCompany(locale);

  // กรณีหาข้อมูลบริษัทไม่เจอ
  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>ไม่พบข้อมูลติดต่อ</p>
      </div>
    );
  }

  return (
    <main className="pt-12 bg-[#ebebeb5c] font-sans overflow-x-hidden">
      <BackgroundBlobs />

      <div className="mx-auto container relative px-4 lg:px-8">
        <Breadcrumb />

        {/* ===== HEADER ===== */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-black text-center">
            {locale === "th" ? "ติดต่อเรา" : "Contact Us"}
          </h1>
        </header>

        {/* ===== MAIN CONTACT CARD ===== */}
        <section className="relative rounded-[2.5rem] border border-white/40 bg-white/40 backdrop-blur-xl shadow-2xl overflow-hidden mb-16">
          <div className="pointer-events-none absolute -top-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[3fr_2fr] divide-y lg:divide-y-0 lg:divide-x divide-gray-200/50">
            
            {/* ===== LEFT SIDE: DIRECT CONTACT ===== */}
            <div className="p-8 md:p-14 flex justify-center">
              <div className="w-full max-w-md space-y-12">
                <ContactSection icon={<Phone />} title="Phone">
                  {company.phones?.map((p, i) => (
                    <div key={i} className="mb-4 last:mb-0">
                      <p className="text-2xl font-bold text-gray-800">{p.number}</p>
                      <p className="text-sm font-medium text-gray-500">คุณ {p.label}</p>
                    </div>
                  ))}
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

            {/* ===== RIGHT SIDE: CONNECT & QR ===== */}
            <div className="p-8 md:p-14 bg-white/20 flex flex-col items-center justify-center text-center">
              {company.lineQrCode && (
                <div className="mb-8">
                  <div className="bg-white p-3 rounded-3xl shadow-xl inline-block">
                    <div className="relative h-40 w-40">
                      <Image
                        src={company.lineQrCode.src}
                        alt={company.lineQrCode.alt}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <p className="mt-4 font-bold text-gray-600 tracking-widest uppercase text-sm">
                    {locale === "th" ? "สแกนเพื่อเพิ่มเพื่อน" : "Scan to Add Line"}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-4">
                {company.socials?.map((social, i) => (
                  social.icon && (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 active:scale-95 transition-transform"
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
                ))}
              </div>
            </div>
          </div>
        </section>

       
      </div>

      {/* ===== ADDRESS & MAP SECTION ===== */}
      <section className="mt-8">
        <div className="max-w-4xl mx-auto px-6 mb-12 text-center">
          <div className="inline-flex items-start gap-4 text-left">
            <div className="bg-black p-2 rounded-lg mt-1">
              <MapPin className="w-5 h-5 text-white shrink-0" />
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed">
              {company.address}
            </p>
          </div>
        </div>

        {/* Google Maps Embed (แนะนำให้ใช้ URL เต็มจาก Google Maps) */}
        <div className="w-full h-[450px] relative grayscale-[0.2] hover:grayscale-0 transition-all duration-700 bg-gray-200">
           <iframe
            title="Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242.35381407222152!2d100.42350364739633!3d13.617503153068256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2bd007a6774dd%3A0xa3b3383a2a290b44!2s168%20INNOVATIVE!5e0!3m2!1sth!2sth!4v1771555949779!5m2!1sth!2sth"
            className="w-full h-full border-none"
            loading="lazy"
            allowFullScreen
          />

        
        </div>
      </section>
    </main>
  );
}

function ContactSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left">
      <div className="bg-[#222] p-3 rounded-xl mb-4 shadow-lg text-white">
        {icon}
      </div>
      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
        {title}
      </h3>
      <div className="w-12 h-1 bg-black/10 mb-6 rounded-full" />
      <div className="w-full">{children}</div>
    </div>
  );
}