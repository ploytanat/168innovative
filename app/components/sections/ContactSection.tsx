'use client'

import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import { CompanyView } from '@/app/lib/types/view'
import { Phone, Mail } from 'lucide-react'
import { uiText } from '@/app/lib/i18n/ui'

/* =======================
   Motion Variants
======================= */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

const stagger: Variants = {
  show: {
    transition: { staggerChildren: 0.12 },
  },
}

interface ContactSectionProps {
  data: CompanyView
  locale: 'th' | 'en'
}

export default function ContactSection({
  data,
  locale,
}: ContactSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-white/40 border border-white overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="relative rounded-[3rem] bg-[#F8F9FB] p-8 md:p-16 lg:p-20 shadow-xl shadow-slate-200/50 border border-white overflow-hidden"
        >
          <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr] items-center relative z-10">
            
            {/* LEFT */}
            <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
              <motion.h2
                variants={fadeUp}
                className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1]"
              >
                {uiText.contact.title[locale]} <br />
                <span className="text-blue-600">
                  {uiText.contact.subtitle[locale]}
                </span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="mt-6 text-gray-500 text-lg max-w-md"
              >
                {uiText.contact.desc[locale]}
              </motion.p>

              {/* CONTACT CARD */}
              <motion.div variants={fadeUp} className="mt-12 w-full max-w-md">
                <div className="overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
                  
                  {/* Phone */}
                  <div className="p-6 md:p-8 border-b border-slate-50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 text-left">
                      {uiText.contact.phoneLabel[locale]}
                    </p>

                    <div className="space-y-6">
                      {data.phones.map((p) => (
                        <a
                          key={p.number}
                          href={`tel:${p.number.replace(/-/g, '')}`}
                          className="group flex items-center gap-4 text-left"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Phone size={20} />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              {p.label}
                            </span>
                            <div className="text-xl font-bold text-slate-900 group-hover:text-blue-600">
                              {p.number}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="p-6 md:p-8 bg-slate-50/30">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 text-left">
                      {uiText.contact.emailLabel[locale]}
                    </p>

                    <div className="space-y-4">
                      {data.email.map((e) => (
                        <a
                          key={e}
                          href={`mailto:${e}`}
                          className="group flex items-center gap-4"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border text-slate-400 group-hover:bg-slate-900 group-hover:text-white">
                            <Mail size={18} />
                          </div>
                          <span className="font-semibold text-slate-600 break-all">
                            {e}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* LINE */}
                {data.lineQrCode && (
                  <div className="mt-6 flex items-center gap-5 p-4 rounded-[2rem] bg-emerald-50/50 border border-emerald-100/50">
                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-white">
                      <Image
                        src={data.lineQrCode.src}
                        alt={data.lineQrCode.alt}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-900">
                        {uiText.contact.lineLabel[locale]}
                      </p>
                      <p className="text-xs text-emerald-600/80">
                        {uiText.contact.lineDesc[locale]}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* RIGHT IMAGE */}
         <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="order-1 lg:order-2 relative" > <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative h-80 md:h-[500px] w-full" > {data.contactImage && ( <Image src={data.contactImage.src} alt={data.contactImage.alt} fill priority className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]" /> )} </motion.div> {/* Decorative Blur */} <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[120%] h-[120%] bg-blue-100/40 rounded-full blur-3xl" /> </motion.div> </div> </motion.div>
      </div>
    </section>
  )
}
