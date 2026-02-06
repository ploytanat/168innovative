import { getCompany } from "@/app/lib/api/company";
import { Locale } from "@/app/lib/types/content";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import BackgroundBlobs from "@/app/components/ui/BackgroundBlobs";
import Breadcrumb from "@/app/components/ui/Breadcrumb";
export default async function ContactPage() {
  const locale: Locale = "en";
  const company = await getCompany(locale);

  return (
    <main className="min-h-screen pt-24 bg-[#ebebeb5c] relative overflow-hidden font-sans">
      <BackgroundBlobs />

      <div className="mx-auto container px-4 sm:px-6 relative z-10 pb-16">
        <Breadcrumb />
        
        {/* ===== HEADER ===== */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-black text-center">
            Contact Us

          </h1>
        </header>

        {/* ===== MAIN CONTACT CARD ===== */}
        <section className="relative mx-auto max-w-5xl rounded-[2.5rem] border border-white/40 bg-white/40 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Decorative inner blobs */}
          <div className="pointer-events-none absolute -top-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200/50">
            
            {/* LEFT SIDE: DIRECT CONTACT */}
            <div className="p-8 md:p-14 space-y-12">
              {/* Phone Section */}
              <ContactSection icon={<Phone />} title="Phone">
                {company.phones.map((p, i) => (
                  <div key={i} className="mb-4 last:mb-0">
                    <p className="text-2xl font-bold text-gray-800">{p.number}</p>
                    <p className="text-sm font-medium text-gray-500">คุณ{p.label}</p>
                  </div>
                ))}
              </ContactSection>

              {/* Email Section */}
              <ContactSection icon={<Mail />} title="Email">
                {company.email.map((mail, i) => (
                  <p key={i} className="text-lg font-semibold text-gray-800 break-all">
                    {mail}
                  </p>
                ))}
              </ContactSection>
            </div>

            {/* RIGHT SIDE: CONNECT & QR */}
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
                  <p className="mt-4 font-bold text-gray-600 tracking-widest uppercase text-sm">Scan to Add Line</p>
                </div>
              )}

              {/* Social Icons */}
              <div className="flex gap-4">
                {company.socials?.map((social) => (
                  <a
                    key={social.type}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 active:scale-95 transition-transform"
                  >
                    <Image
                      src={social.icon.src}
                      alt={social.icon.alt}
                      width={48}
                      height={48}
                      className="rounded-2xl shadow-md"
                    />
                  </a>
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

        <div className="w-full h-[450px] relative grayscale-[0.2] hover:grayscale-0 transition-all duration-700">
          <iframe
            title="Map"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31023.288683516108!2d100.41833173541261!3d13.602242447810424!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2bd007a6774dd%3A0xa3b3383a2a290b44!2s168%20INNOVATIVE!5e0!3m2!1sen!2sus!4v1770371390818!5m2!1sen!2sus" // แนะนำให้ใช้ embed link เต็มรูปแบบ
            className="w-full h-full border-none"
            loading="lazy"
          />
        </div>
      </section>
    </main>
  );
}

/**
 * Sub-component สำหรับจัดกลุ่ม Icon + Text
 */
function ContactSection({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
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