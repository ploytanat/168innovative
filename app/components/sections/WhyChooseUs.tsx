"use client"

import Image from "next/image"
import { motion } from "framer-motion"

import { uiText } from "@/app/lib/i18n/ui"
import { WhyItemView } from "@/app/lib/types/view"
import {
  COLORS,
  EYEBROW_PILL_STYLE,
  SECTION_BACKGROUNDS,
  SECTION_BORDER,
} from "@/app/components/ui/designSystem"
import { fadeUp, MOTION_EASE, MOTION_VIEWPORT, staggerSmall } from "@/app/components/ui/motion"

interface WhyChooseUsProps {
  items: WhyItemView[]
  locale: "th" | "en"
}

const GLASS_CARDS = [
  {
    bg: 'rgba(255,255,255,0.62)',
    border: '1px solid rgba(200,210,230,0.70)',
    iconBg: 'rgba(58,123,213,0.10)',
    iconBorder: 'rgba(58,123,213,0.18)',
    bar: 'linear-gradient(90deg,#3a7bd5,transparent)',
    iconColor: '#3a7bd5',
  },
  {
    bg: 'rgba(240,246,255,0.68)',
    border: '1px solid rgba(180,210,240,0.65)',
    iconBg: 'rgba(42,184,176,0.10)',
    iconBorder: 'rgba(42,184,176,0.20)',
    bar: 'linear-gradient(90deg,#2ab8b0,transparent)',
    iconColor: '#2ab8b0',
  },
  {
    bg: 'rgba(240,255,252,0.65)',
    border: '1px solid rgba(180,230,220,0.65)',
    iconBg: 'rgba(16,185,129,0.10)',
    iconBorder: 'rgba(16,185,129,0.20)',
    bar: 'linear-gradient(90deg,#10b981,transparent)',
    iconColor: '#10b981',
  },
  {
    bg: 'rgba(248,242,255,0.65)',
    border: '1px solid rgba(200,180,240,0.55)',
    iconBg: 'rgba(130,90,220,0.10)',
    iconBorder: 'rgba(130,90,220,0.20)',
    bar: 'linear-gradient(90deg,#825adc,transparent)',
    iconColor: '#825adc',
  },
]

export default function WhyChooseUs({ items, locale }: WhyChooseUsProps) {
  if (!items.length) return null

  return (
    <section
      className="relative overflow-hidden py-14 sm:py-16 md:py-24"
      style={{ background: SECTION_BACKGROUNDS.cool }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t pt-6" style={{ borderColor: SECTION_BORDER }}>

          {/* Header */}
          <motion.div
            className="mb-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
            variants={staggerSmall}
            initial="hidden"
            whileInView="visible"
            viewport={MOTION_VIEWPORT}
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.55, ease: MOTION_EASE }}>
              <p
                className="inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]"
                style={EYEBROW_PILL_STYLE}
              >
                Core Strengths
              </p>
              <h2
                className="font-heading mt-3 text-[clamp(1.9rem,3vw,3.2rem)] leading-[1.04]"
                style={{ color: COLORS.dark }}
              >
                {uiText.whyChooseUs.title[locale]}
              </h2>
            </motion.div>
           
          </motion.div>

          {/* Cards */}
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerSmall}
            initial="hidden"
            whileInView="visible"
            viewport={MOTION_VIEWPORT}
          >
            {items.map((item, index) => {
              const card = GLASS_CARDS[index % GLASS_CARDS.length]

              return (
                <motion.div
                  key={index}
                  className="group relative overflow-hidden rounded-[0.95rem] p-5 sm:p-6 transition-transform duration-300 hover:-translate-y-1"
                  variants={fadeUp}
                  transition={{ duration: 0.5, ease: MOTION_EASE }}
                  whileHover={{ y: -6 }}
                  style={{
                    background: card.bg,
                    border: card.border,
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 2px 12px rgba(30,40,80,0.06)',
                  }}
                >
                  {/* Top shimmer */}
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px"
                    style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)' }}
                  />

                  {/* Icon */}
                  <div
                    className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-[10px]"
                    style={{ background: card.iconBg, border: `1px solid ${card.iconBorder}` }}
                  >
                    {item.image?.src ? (
                      <div className="relative h-6 w-6">
                        <Image
                          src={item.image.src}
                          alt={item.image.alt || item.title}
                          fill
                          sizes="24px"
                          className="object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        style={{ color: card.iconColor }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    )}
                  </div>

                  {/* Accent bar */}
                  <div
                    className="mb-2 h-[2px] w-6 rounded-full"
                    style={{ background: card.bar }}
                  />

                  <h3 className="text-[15px] font-semibold leading-tight" style={{ color: '#1a2232' }}>
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-[13px] leading-[1.75]" style={{ color: '#4a5a72' }}>
                    {item.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
