'use client'

import type { CompanyView } from '@/app/lib/types/view'

const COPY = {
  th: {
    title: 'พร้อมเริ่มต้นแล้วใช่ไหม?\nติดต่อเราได้เลย',
    desc: 'ทีมงานพร้อมให้คำปรึกษา ตอบรวดเร็ว ไม่มีค่าใช้จ่าย ขอใบเสนอราคาฟรีได้เลยทันที',
    call: 'โทรหาเรา',
    line: 'LINE OA',
    email: 'อีเมล',
  },
  en: {
    title: 'Ready to Start?\nContact Our Team',
    desc: 'Talk to our sales team for packaging advice and quotation support.',
    call: 'Call Us',
    line: 'LINE OA',
    email: 'Email',
  },
} as const

const ICONS = ['👩', '👨', '👩'] as const

export default function ContactSection({
  data,
  locale,
}: {
  data: CompanyView
  locale: 'th' | 'en'
}) {
  const copy = COPY[locale]

  return (
    <section id="contact" className="py-16">
      <div className="mx-auto max-w-[1180px] px-6 md:px-10">
        <div className="relative overflow-hidden rounded-[16px] bg-[linear-gradient(135deg,#c96870_0%,#c05060_50%,#a04060_100%)] px-6 py-10 md:px-10 lg:px-12">
          <div className="absolute -right-24 -top-32 h-[500px] w-[500px] rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-16 h-[300px] w-[300px] rounded-full bg-white/[0.04]" />

          <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <h2 className="whitespace-pre-line text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.2] text-white">
                {copy.title}
              </h2>
              <p className="mt-4 max-w-[560px] text-[16px] leading-8 text-white/80">
                {copy.desc}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {data.phones[0] && (
                  <a
                    href={`tel:${data.phones[0].number.replace(/-/g, '')}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[15px] font-semibold text-[#c96870] transition hover:-translate-y-0.5"
                  >
                    📞 {copy.call}
                  </a>
                )}
                {data.socials.find((social) => social.type === 'line')?.url && (
                  <a
                    href={data.socials.find((social) => social.type === 'line')!.url}
                    className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-[15px] font-medium text-white transition hover:bg-white/10"
                  >
                    💬 {copy.line}
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3.5">
              {data.phones.slice(0, 3).map((phone, index) => (
                <div
                  key={phone.number}
                  className="flex items-center gap-3.5 rounded-[16px] border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-[8px]"
                >
                  <div className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[12px] bg-white/20 text-[22px]">
                    {ICONS[index] ?? '👤'}
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-white">{phone.label}</div>
                    <div className="text-[14px] text-white/75">{phone.number}</div>
                  </div>
                </div>
              ))}

              {data.email[0] && (
                <div className="flex items-center gap-3.5 rounded-[16px] border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-[8px]">
                  <div className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[12px] bg-white/20 text-[22px]">
                    📧
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-white">{copy.email}</div>
                    <div className="text-[14px] text-white/75">{data.email[0]}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
