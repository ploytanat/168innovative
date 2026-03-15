"use client"

import { motion } from "framer-motion"
import Image from "next/image"

import type { AboutHeroView, ImageView } from "@/app/lib/types/view"
import Breadcrumb from "../ui/Breadcrumb"
import { COLORS, GLASS, SECTION_BACKGROUNDS, SOFT_IMAGE_BG, SOFT_IMAGE_BG_ALT } from "../ui/designSystem"

interface AboutHeroProps {
  hero: AboutHeroView
}

const easeOut = [0.16, 1, 0.3, 1] as const
const viewportOnce = { once: true, amount: 0.35 } as const

const chipItems = [
  { label: "Product Sourcing", style: { ...GLASS.card, color: COLORS.dark } },
  { label: "Quality Control", style: { ...GLASS.card, color: COLORS.brandNavy, background: SOFT_IMAGE_BG } },
  { label: "Supply Chain", style: { ...GLASS.card, color: COLORS.brandMuted, background: SOFT_IMAGE_BG_ALT } },
]

function PastelBlobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute -right-20 -top-32 h-[580px] w-[580px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(154,191,231,0.16) 0%, transparent 70%)" }}
        animate={{ x: [0, -18, 0], y: [0, 16, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -left-16 h-[420px] w-[420px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(215,223,232,0.18) 0%, transparent 70%)" }}
        animate={{ x: [0, 14, 0], y: [0, -12, 0], scale: [1, 0.97, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />
      <motion.div
        className="absolute left-[38%] top-[38%] h-[300px] w-[300px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(198,208,221,0.14) 0%, transparent 70%)" }}
        animate={{ x: [0, 10, 0], y: [0, -14, 0], scale: [1, 1.03, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
    </div>
  )
}

function PhotoPanel({
  image,
  extraImages,
}: {
  image?: { src: string; alt: string }
  extraImages?: { src: string; alt: string }[]
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.9, delay: 0.1, ease: easeOut }}
      className="flex flex-col gap-3"
    >
      <motion.div
        className="overflow-hidden rounded-[1.15rem] p-2"
        style={GLASS.secondary}
        whileHover={{ y: -6, rotate: -1 }}
        transition={{ duration: 0.5, ease: easeOut }}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[0.95rem]" style={{ background: SOFT_IMAGE_BG }}>
          <motion.div
            aria-hidden
            className="absolute inset-x-[12%] top-[-10%] z-[1] h-[42%] rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.28) 0%, transparent 72%)" }}
            animate={{ opacity: [0.35, 0.65, 0.35], x: [0, 12, 0] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
          />
          {image ? (
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.08 }}
              whileInView={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              viewport={viewportOnce}
              transition={{ duration: 1.3, ease: easeOut }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          ) : (
            <div
              className="relative h-full w-full overflow-hidden"
              style={{
                background:
                  "linear-gradient(160deg, #eef4fb 0%, #d7e5f5 20%, #ecf2f8 44%, #d3e2f2 68%, #e5eef8 100%)",
              }}
            >
              <div className="absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-[#c5d0db] to-transparent" />
              {[20, 50, 80].map((l) => (
                <div
                  key={l}
                  className="absolute top-0 h-[55%] w-[3px] rounded-b-full bg-gradient-to-b from-white/70 to-transparent"
                  style={{ left: `${l}%` }}
                />
              ))}
              {[28, 54, 76].map((t) => (
                <div key={t} className="absolute inset-x-0 h-px bg-white/30" style={{ top: `${t}%` }} />
              ))}
              {[22, 44, 66].map((l) => (
                <div key={l} className="absolute inset-y-0 w-px bg-white/20" style={{ left: `${l}%` }} />
              ))}
              {[
                { l: 24, t: 30, w: 16, h: 20, o: 0.22 },
                { l: 46, t: 30, w: 18, h: 20, o: 0.18 },
                { l: 68, t: 30, w: 13, h: 20, o: 0.25 },
                { l: 24, t: 56, w: 12, h: 18, o: 0.2 },
                { l: 46, t: 56, w: 20, h: 18, o: 0.15 },
                { l: 68, t: 56, w: 16, h: 18, o: 0.22 },
              ].map((block, index) => (
                <div
                  key={index}
                  className="absolute rounded-sm border border-white/35"
                  style={{
                    left: `${block.l}%`,
                    top: `${block.t}%`,
                    width: `${block.w}%`,
                    height: `${block.h}%`,
                    background: `rgba(255,255,255,${block.o})`,
                  }}
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-black/22 to-transparent" />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 50%, rgba(60,40,30,0.18) 100%)",
                }}
              />
            </div>
          )}

          <motion.div
            className="absolute right-3 top-3 z-10 rounded-[0.9rem] px-3 py-1.5 shadow-[0_8px_18px_rgba(24,35,56,0.10)]"
            style={GLASS.card}
            initial={{ opacity: 0, y: -10, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ y: -2, scale: 1.03 }}
            viewport={viewportOnce}
            transition={{ duration: 0.55, delay: 0.35, ease: easeOut }}
          >
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em]" style={{ color: COLORS.dark }}>
              Est. 2022
            </p>
          </motion.div>
        </div>
      </motion.div>

      {extraImages && extraImages.length > 0 && (
        <div className={`grid gap-2.5 ${extraImages.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {extraImages.slice(0, 3).map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.5, delay: 0.28 + index * 0.08, ease: easeOut }}
              className="group relative overflow-hidden rounded-[0.95rem]"
              style={{ ...GLASS.card, aspectRatio: "4/3", background: SOFT_IMAGE_BG_ALT }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width:1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#9abfe7]/0 transition-colors duration-300 group-hover:bg-[#9abfe7]/12" />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default function AboutHero({ hero }: AboutHeroProps) {
  const words = hero.title.split(" ")

  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-4 sm:px-6 lg:px-8 lg:pb-16" style={{ background: SECTION_BACKGROUNDS.warm }}>
      <PastelBlobs />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="px-2 pb-6">
          <Breadcrumb />
        </div>

        <div className="relative px-2 py-2 lg:px-0 lg:py-4">
          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <div
                className="absolute bottom-[12%] right-1/2 top-[12%] hidden w-px lg:block"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(154,191,231,0.3) 30%, rgba(154,191,231,0.3) 70%, transparent)",
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.4, ease: easeOut }}
                className="mb-5 inline-flex items-center gap-2.5"
              >
                <motion.span
                  className="h-2 w-2 rounded-full bg-[#182338]"
                  style={{ boxShadow: "0 0 0 3px rgba(154,191,231,0.18)" }}
                  animate={{ scale: [1, 1.55, 1], opacity: [1, 0.72, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="font-body text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: COLORS.soft }}>
                  About our company
                </span>
              </motion.div>

              <h1 className="font-heading mb-0 text-[2rem] leading-[1.1] tracking-tight sm:text-[2.4rem] lg:text-[2.4rem]" style={{ color: COLORS.dark }}>
                {words.map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.55, delay: 0.08 + index * 0.07, ease: easeOut }}
                    className="mr-[0.18em] inline-block last:mr-0"
                  >
                    {index === 1 ? (
                      <motion.em
                        style={{ fontStyle: "normal", color: COLORS.brandNavy }}
                        initial={{ backgroundSize: "100% 0%" }}
                        whileInView={{ backgroundSize: "100% 100%" }}
                        viewport={viewportOnce}
                        transition={{ duration: 0.7, delay: 0.22, ease: easeOut }}
                        className="rounded-[0.28em] bg-gradient-to-t from-[#d9e9f8] to-transparent px-[0.08em]"
                      >
                        {word}
                      </motion.em>
                    ) : (
                      word
                    )}
                  </motion.span>
                ))}
              </h1>

              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.6, delay: 0.46, ease: easeOut }}
                style={{ originX: 0 }}
                className="mb-5 mt-4 flex items-center gap-2"
              >
                <div className="h-[1.5px] w-11 rounded-full" style={{ background: COLORS.dark }} />
                <div className="h-[1.5px] w-[18px] rounded-full bg-[#9abfe7]" />
                <div className="h-[5px] w-[5px] rounded-full bg-[#dbe3ec]" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.65, delay: 0.52, ease: easeOut }}
                className="mb-9 max-w-[38rem] text-[0.98rem] leading-[1.9] tracking-[0.005em] sm:text-[1rem]"
                style={{ color: COLORS.mid }}
              >
                {hero.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.5, delay: 0.62, ease: easeOut }}
                className="flex flex-wrap gap-2.5"
              >
                {chipItems.map(({ label, style }, index) => (
                  <motion.span
                    key={label}
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ y: -3, scale: 1.03 }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.4, delay: 0.66 + index * 0.08, ease: easeOut }}
                    className="rounded-[0.9rem] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em]"
                    style={style}
                  >
                    {label}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            <div className="relative">
              <PhotoPanel
                image={hero.image1}
                extraImages={[hero.image2].filter(Boolean) as ImageView[]}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
