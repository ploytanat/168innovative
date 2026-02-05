'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { CompanyView } from '@/app/lib/types/view'

/* =======================
   Motion Presets
======================= */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

const stagger = {
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

/* =======================
   Component
======================= */

export default function ContactSection({ data }: { data: CompanyView }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-120px' }}
      variants={fadeUp}
      className="
        w-full container mx-auto
        py-14 md:py-24
        rounded-3xl
        bg-gradient-to-br from-[#F7F8FA] to-[#ECEDEF]
        shadow-[0_40px_80px_-40px_rgba(0,0,0,0.25)]
        overflow-hidden
      "
    >
      <div className="px-4 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] items-center text-center lg:text-left">

          {/* LEFT : INFO */}
          <motion.div
            variants={stagger}
            className="order-2 lg:order-1 z-10"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900"
            >
              Contact Us
            </motion.h2>

            <motion.div variants={fadeUp} className="mt-10 space-y-10">

              {/* Phones */}
              <div className="space-y-4">
                <div className="flex flex-col items-center lg:items-start gap-6">
                  {data.phones.map((p) => (
                    <div key={p.number} className="flex flex-col">
                      <span className="text-xs text-gray-400 uppercase tracking-widest">
                        {p.label}
                      </span>
                      <a
                        href={`tel:${p.number.replace(/-/g, '')}`}
                        className="text-xl md:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {p.number}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  Email Address
                </p>
                {data.email.map((e) => (
                  <a
                    key={e}
                    href={`mailto:${e}`}
                    className="block text-base text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {e}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* QR Code */}
            {data.lineQrCode && (
              <motion.div
                variants={fadeUp}
                className="
                  mt-12 inline-block
                  rounded-3xl
                  bg-white/80 backdrop-blur
                  border border-white/40
                  shadow-lg
                  p-6
                  mx-auto lg:mx-0
                "
              >
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-center text-gray-400">
                  Scan to Add LINE
                </p>
                <div className="relative h-32 w-32 mx-auto">
                  <Image
                    src={data.lineQrCode.src}
                    alt={data.lineQrCode.alt}
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* RIGHT : IMAGE */}
          <motion.div
            variants={fadeRight}
            className="
              order-1 lg:order-2
              relative w-full
              h-80 md:h-[420px] lg:h-[520px]
              flex items-center justify-center
            "
          >
            {data.contactImage && (
              <div className="relative h-full w-full">
                <Image
                  src={data.contactImage.src}
                  alt={data.contactImage.alt}
                  fill
                  priority
                  className="object-contain drop-shadow-xl"
                />
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </motion.section>
  )
}
