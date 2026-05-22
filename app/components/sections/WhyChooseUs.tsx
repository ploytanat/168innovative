"use client"

import Image from "next/image"
import { motion } from "framer-motion"

import { uiText } from "@/app/lib/i18n/ui"
import { WhyItemView } from "@/app/lib/types/view"

import { fadeUp, MOTION_EASE, MOTION_VIEWPORT, staggerSmall } from "../ui/motion"
import { CONTAINER, HOME, SECTION_HEADING, SECTION_PAD } from "./home-theme"

interface WhyChooseUsProps {
  items: WhyItemView[]
  locale: "th" | "en"
}

export default function WhyChooseUs({ items, locale }: WhyChooseUsProps) {
  if (!items.length) return null

  return (
    <section className={`relative ${SECTION_PAD}`} style={{ background: HOME.surface }}>
      <div className={CONTAINER}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <motion.div
          className="max-w-2xl"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={MOTION_VIEWPORT}
          transition={{ duration: 0.55, ease: MOTION_EASE }}
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-9" style={{ background: HOME.accent }} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: HOME.accent }}>
              {locale === "th" ? "จุดเด่น" : "Why us"}
            </span>
          </div>
          <h2
            className={`mt-4 ${SECTION_HEADING} font-bold text-[clamp(1.9rem,1.3rem+1.9vw,2.9rem)]`}
            style={{ color: HOME.ink }}
          >
            {uiText.whyChooseUs.title[locale]}
          </h2>
          <p className="mt-4 text-[0.97rem] leading-[1.8]" style={{ color: HOME.inkMid }}>
            {locale === "th"
              ? "ตั้งแต่ต้นทางโรงงานจนถึงมือแบรนด์ — เหตุผลที่ลูกค้า OEM เลือกทำงานกับเรา"
              : "From factory source to your brand — why OEM clients choose to work with us."}
          </p>
        </motion.div>

        {/* ── Cards ──────────────────────────────────────────────── */}
        <motion.div
          className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4"
          variants={staggerSmall}
          initial="hidden"
          whileInView="visible"
          viewport={MOTION_VIEWPORT}
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              className="home-card group flex flex-col rounded-2xl p-6"
              variants={fadeUp}
              transition={{ duration: 0.5, ease: MOTION_EASE }}
              style={{ background: HOME.surface, border: `1px solid ${HOME.line}` }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: HOME.accentTint }}
                >
                  {item.image?.src ? (
                    <div className="relative h-7 w-7">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt || item.title}
                        fill
                        sizes="28px"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} style={{ color: HOME.accent }}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                </div>
                <span className="text-[1.6rem] font-bold leading-none tabular-nums" style={{ color: HOME.lineSoft }}>
                  {(index + 1).toString().padStart(2, "0")}
                </span>
              </div>

              <h3
                className={`mt-5 ${SECTION_HEADING} font-semibold text-[1.05rem]`}
                style={{ color: HOME.ink }}
              >
                {item.title}
              </h3>

              <span className="mt-2.5 h-px w-7" style={{ background: HOME.accent }} />

              <p className="mt-3 text-[0.88rem] leading-[1.72]" style={{ color: HOME.inkMid }}>
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
