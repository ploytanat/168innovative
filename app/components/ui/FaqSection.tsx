"use client"

import { motion } from "framer-motion"

import type { FAQItemView } from "@/app/lib/types/view"
import {
  COLORS,
  EYEBROW_PILL_STYLE,
  GLASS,
  SECTION_BORDER,
} from "@/app/components/ui/designSystem"
import { fadeUp, MOTION_EASE, MOTION_VIEWPORT, staggerSmall } from "@/app/components/ui/motion"

type Props = {
  eyebrow?: string
  title: string
  items?: FAQItemView[] | null
  className?: string
  sectionId?: string
}

export default function FaqSection({
  eyebrow,
  title,
  items,
  className = "",
  sectionId = "faq",
}: Props) {
  if (!Array.isArray(items) || items.length === 0) return null

  return (
    <motion.section
      id={sectionId}
      className={className}
      variants={staggerSmall}
      initial="hidden"
      whileInView="visible"
      viewport={MOTION_VIEWPORT}
    >
      <div className="border-t pt-7 md:pt-10" style={{ borderColor: SECTION_BORDER }}>
        {eyebrow ? (
          <motion.p className="inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]" style={EYEBROW_PILL_STYLE} variants={fadeUp} transition={{ duration: 0.45, ease: MOTION_EASE }}>
            {eyebrow}
          </motion.p>
        ) : null}
        <motion.h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight md:text-[2rem]" style={{ color: COLORS.dark }} variants={fadeUp} transition={{ duration: 0.55, ease: MOTION_EASE }}>
          {title}
        </motion.h2>
        <motion.div className="mt-7 space-y-4 md:mt-8 md:space-y-5" variants={staggerSmall}>
          {items.map((item, index) => (
            <motion.details
              key={`${item.question}-${index}`}
              className="group rounded-[1rem] p-5 md:p-6"
              style={GLASS.card}
              variants={fadeUp}
              transition={{ duration: 0.45, ease: MOTION_EASE }}
            >
              <summary className="cursor-pointer list-none pr-8 text-[1.05rem] font-semibold leading-7 marker:hidden" style={{ color: COLORS.dark }}>
                {item.question}
              </summary>
              <div
                className="rich-content mt-4 text-base md:mt-5"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            </motion.details>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
