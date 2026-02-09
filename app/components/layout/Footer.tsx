// components/Footer.tsx
import Image from "next/image"
import { CompanyView } from "@/app/lib/types/view"

export default function Footer({
  company,
  locale,
}: {
  company: CompanyView
  locale: 'th' | 'en'
}) {
  const isEN = locale === 'en'

  return (
    // 1. ปรับ Wrapper: ใช้ h-[500px] (หรือความสูงที่ใกล้เคียงคอนเทนต์) 
    // และใช้ clip-path เพื่อให้คอนเทนต์ด้านบนเลื่อนทับได้สวยงาม
    <footer
      className="relative w-full lg:h-[450px]"
      style={{ clipPath: "polygon(0% 0, 100% 0, 100% 100%, 0% 100%)" }}
    >
      {/* 2. ปรับตัวคอนเทนต์: 
          - Mobile: เป็น relative ปกติ (เรียงต่อท้าย) เพื่อไม่ให้โดนบัง
          - Desktop (lg): เป็น sticky bottom-0 เพื่อทำ Reveal Effect
      */}
      <div className="relative lg:sticky lg:bottom-0 w-full bg-white lg:bg-transparent text-zinc-900">
        
        {/* เพิ่ม Background Gradient ตามดีไซน์เดิม */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#f3e8e8] via-[#e6eef2] to-[#f7f7f7] opacity-50" />

        <div className="mx-auto max-w-7xl px-6 py-12 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-4 lg:gap-12">

            {/* LOGO + ADDRESS */}
            <div className="flex flex-col gap-4">
              <Image
                src="/images/logo.png"
                alt={company.name}
                width={120}
                height={40}
                className="object-contain"
              />
              <p className="text-sm text-gray-600 leading-relaxed">
                {company.address}
              </p>
            </div>

            {/* PHONE */}
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">
                {isEN ? 'Phone Number' : 'เบอร์โทรศัพท์'}
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {company.phones.map(p => (
                  <li key={p.number} className="hover:text-cyan-600 transition-colors">
                    {p.label}: {p.number}
                  </li>
                ))}
              </ul>
            </div>

            {/* EMAIL */}
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">
                {isEN ? 'Email' : 'อีเมล'}
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {company.email.map(e => (
                  <li key={e} className="hover:text-cyan-600 transition-colors">{e}</li>
                ))}
              </ul>
            </div>

            {/* SOCIAL */}
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">
                {isEN ? 'Social' : 'โซเชียล'}
              </h4>
              <div className="flex gap-4">
                {company.socials.map(s => (
                  <a
                    key={s.type}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-black/5 hover:bg-black/10 transition-all"
                  >
                    <Image
                      src={s.icon.src}
                      alt={s.icon.alt}
                      width={20}
                      height={20}
                    />
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* bottom */}
          <div className="mt-12 lg:mt-16 flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-8 sm:flex-row">
            <p className="text-[10px] uppercase tracking-widest text-gray-400">
              © {new Date().getFullYear()} {company.name}. All rights reserved.
            </p>
            {/* สามารถเพิ่มปุ่ม Scroll to Top เล็กๆ ตรงนี้ได้ */}
          </div>
        </div>
      </div>
    </footer>
  )
}