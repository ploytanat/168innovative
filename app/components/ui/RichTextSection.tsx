"use client"

import { motion } from "framer-motion"

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
  html: string
  className?: string
}

export default function RichTextSection({
  eyebrow,
  title,
  html,
  className = "",
}: Props) {
  return (
    <motion.section
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
        <motion.div className="mt-7 rounded-[1rem] p-6 md:mt-8 md:p-8" style={GLASS.card} variants={fadeUp} transition={{ duration: 0.55, ease: MOTION_EASE }}>
          <div
            className="rich-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </motion.div>
      </div>
    </motion.section>
  )
}
