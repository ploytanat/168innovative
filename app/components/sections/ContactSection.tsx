'use client'

import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import { Phone, Mail } from 'lucide-react'
import { CompanyView } from '@/app/lib/types/view'
import { uiText } from '@/app/lib/i18n/ui'
import BackgroundBlobs from '../ui/BackgroundBlobs'

/* =======================
   Motion Variants
======================= */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

const stagger: Variants = {
  show: { transition: { staggerChildren: 0.12 } },
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
    <section
      id="contact"
      className="relative py-16 md:py-24 bg-white/40 border-y border-white "
    >
      <div className="container mx-auto px-4 md:px-10  ">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="
            relative overflow-hidden rounded-[2.5rem]
            bg-[#363636fd]
            p-6 sm:p-10 md:p-16 lg:p-20
            border border-white
            shadow-2xl
          "
        >
          {/* Background */}
          <div className="absolute inset-0 -z-10 ">
            <BackgroundBlobs />
          </div>

          <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] items-center">

            {/* ================= LEFT ================= */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <motion.h2
                variants={fadeUp}
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white  leading-tight"
              >
                {uiText.contact.title[locale]} <br />
                <span className="text-blue-600">
                  {uiText.contact.subtitle[locale]}
                </span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-md text-white text-base md:text-lg"
              >
                {uiText.contact.desc[locale]}
              </motion.p>

              {/* Contact Card */}
              <motion.div
                variants={fadeUp}
                className="mt-10 w-full max-w-md"
              >
                <div className="overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-xl">

                  {/* Phone */}
                  <div className="p-6 md:p-8 border-b border-slate-50">
                    <p className="mb-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {uiText.contact.phoneLabel[locale]}
                    </p>

                    <div className="space-y-5">
                      {data.phones.map((p) => (
                        <a
                          key={p.number}
                          href={`tel:${p.number.replace(/-/g, '')}`}
                          className="group flex items-center gap-4"
                        >
                          <div className="
                            flex h-12 w-12 items-center justify-center
                            rounded-2xl bg-blue-50 text-blue-600
                            group-hover:bg-blue-600 group-hover:text-white
                            transition-colors
                          ">
                            <Phone size={20} aria-hidden />
                          </div>
                          <div className="text-left">
                            <span className="block text-[10px] font-bold uppercase text-slate-500">
                              {p.label}
                            </span>
                            <span className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-blue-600">
                              {p.number}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="p-6 md:p-8 bg-slate-50/40">
                    <p className="mb-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {uiText.contact.emailLabel[locale]}
                    </p>

                    <div className="space-y-4">
                      {data.email.map((e) => (
                        <a
                          key={e}
                          href={`mailto:${e}`}
                          className="group flex items-center gap-4"
                        >
                          <div className="
                            flex h-11 w-11 items-center justify-center
                            rounded-xl bg-white border border-slate-200
                            text-slate-500
                            group-hover:bg-slate-900 group-hover:text-white
                            transition-colors
                          ">
                            <Mail size={18} aria-hidden />
                          </div>
                          <span className="text-sm md:text-base font-bold text-slate-700 break-all">
                            {e}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* LINE */}
                {data.lineQrCode && (
                  <motion.div
                    variants={fadeUp}
                    className="
                      mt-6 flex items-center gap-5
                      p-4 rounded-2xl
                      bg-emerald-50 border border-emerald-100
                    "
                  >
                    <div className="relative h-16 w-16 rounded-xl bg-white overflow-hidden border border-emerald-600">
                      <Image
                        src={data.lineQrCode.src}
                        alt={data.lineQrCode.alt}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-emerald-900">
                        {uiText.contact.lineLabel[locale]}
                      </p>
                      <p className="text-xs text-emerald-600/80">
                        {uiText.contact.lineDesc[locale]}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* ================= RIGHT / GALLERY ================= */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-6 md:gap-8">
                {data.contactGallery?.slice(0, 4).map((img, i) => {
                  const zigzag = i % 2 === 1
                  return (
                    <motion.div
                      key={img.src}
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 6 + i * 0.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className={`
                        relative overflow-hidden rounded-3xl shadow-xl bg-white
                        transform-gpu
                        ${zigzag ? 'translate-y-10 md:translate-y-14' : ''}
                      `}
                    >
                      <div className="relative h-[220px] sm:h-[260px] lg:h-[300px] w-full">
                        <Image
                          src={img.src}
                          alt={img.alt || 'Product'}
                          fill
                          sizes="(max-width: 768px) 50vw, 400px"
                          className="
                            object-cover object-center
                            transition-transform duration-700 ease-out
                            hover:scale-[1.05]
                          "
                        />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}
