'use client'

import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import { CompanyView } from '@/app/lib/types/view'
import { uiText } from '@/app/lib/i18n/ui'
import BackgroundBlobs from '../ui/BackgroundBlobs'

// Inline SVG icons to reduce bundle
const PhoneIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const MailIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const ArrowUpRightIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l10 10" />
  </svg>
)

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
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="
            relative overflow-hidden rounded-[2.5rem]
            bg-[#363636fd]
            p-6 sm:p-10 md:p-16 lg:p-20
            border border-white/10
            shadow-2xl
          "
        >
          {/* Background Layer */}
          <div className="absolute inset-0 -z-10 opacity-30">
            <BackgroundBlobs />
          </div>

          <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] items-center">

            {/* ================= LEFT CONTENT ================= */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <motion.div variants={fadeUp} className="space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-[1.1]">
                  {uiText.contact.title[locale]} <br />
                  <span className="text-blue-500 italic">
                    {uiText.contact.subtitle[locale]}
                  </span>
                </h2>
                <p className="mt-6 max-w-md text-gray-300 text-base md:text-lg leading-relaxed">
                  {uiText.contact.desc[locale]}
                </p>
              </motion.div>

              {/* Contact Card Group */}
              <motion.div
                variants={fadeUp}
                className="mt-10 w-full max-w-md space-y-4"
              >
                {/* Main Card */}
                <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl">
                  {/* Phone Section */}
                  <div className="p-6 md:p-8 border-b border-gray-50">
                    <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                      {uiText.contact.phoneLabel[locale]}
                    </p>

                    <div className="space-y-5">
                      {data.phones.map((p) => (
                        <a
                          key={p.number}
                          href={`tel:${p.number.replace(/-/g, '')}`}
                          className="group flex items-center justify-between transition-all"
                        >
                          <div className="flex items-center gap-4 text-left">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                              <PhoneIcon />
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold uppercase text-gray-400">
                                {p.label}
                              </span>
                              <span className="text-lg md:text-xl font-bold text-gray-900">
                                {p.number}
                              </span>
                            </div>
                          </div>
                          <ArrowUpRightIcon />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Email Section */}
                  <div className="p-6 md:p-8 bg-gray-50/50">
                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                      {uiText.contact.emailLabel[locale]}
                    </p>
                    <div className="space-y-4">
                      {data.email.map((e) => (
                        <a
                          key={e}
                          href={`mailto:${e}`}
                          className="group flex items-center gap-4"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">
                            <MailIcon />
                          </div>
                          <span className="text-sm md:text-base font-bold text-gray-700 break-all">
                            {e}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* LINE Official Badge */}
                {data.lineQrCode && (
                  <motion.div
                    variants={fadeUp}
                    className="
                      flex items-center gap-5 p-4 rounded-2xl
                      bg-emerald-50 border border-emerald-100 shadow-sm
                    "
                  >
                    <div className="relative h-16 w-16 rounded-xl bg-white overflow-hidden border border-emerald-600 shrink-0">
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
                      <p className="text-xs text-emerald-600/80 font-medium">
                        {uiText.contact.lineDesc[locale]}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* ================= RIGHT / GALLERY (KEEP AS IS) ================= */}
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