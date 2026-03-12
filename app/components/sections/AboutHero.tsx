"use client"

import { motion } from "framer-motion"
import Image from "next/image"

import type { AboutHeroView, ImageView } from "@/app/lib/types/view"
import Breadcrumb from "../ui/Breadcrumb"

interface AboutHeroProps {
  hero: AboutHeroView
}

// ─── Decorative background blobs ─────────────────────────────────────────────
function PastelBlobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Mint — top right */}
      <div
        className="absolute -right-20 -top-32 h-[580px] w-[580px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(62,207,184,0.13) 0%, transparent 70%)",
        }}
      />
      {/* Blush — bottom left */}
      <div
        className="absolute -bottom-24 -left-16 h-[420px] w-[420px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(240,120,138,0.10) 0%, transparent 70%)",
        }}
      />
      {/* Sky — centre */}
      <div
        className="absolute left-[38%] top-[38%] h-[300px] w-[300px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(106,180,232,0.08) 0%, transparent 70%)",
        }}
      />
    </div>
  )
}

// ─── Warehouse photo + mini photo strip ──────────────────────────────────────
function PhotoPanel({
  image,
  extraImages,
}: {
  image?: { src: string; alt: string }
  extraImages?: { src: string; alt: string }[]
}) {
  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden">
      {/* Desktop: strong left fade so card text is always on white */}
      <motion.div
        style={{ y }}
        className="relative hidden h-[112%] w-full will-change-transform sm:block"
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-white/98 from-[20%] via-white/80 via-[42%] to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/40 via-transparent to-white/20" />
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-70"
        />
      </motion.div>

      {/* Mobile: near-invisible */}
      <div className="relative h-full w-full sm:hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-[0.06]"
        />
      </div>

      {/* Mini photo strip */}
      {extraImages && extraImages.length > 0 && (
        <div className={`grid gap-2.5 ${extraImages.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {extraImages.slice(0, 3).map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.28 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-2xl shadow-[0_4px_16px_rgba(26,22,20,0.08)]"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width:1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Subtle mint overlay on hover */}
              <div className="absolute inset-0 bg-[#3ecfb8]/0 transition-colors duration-300 group-hover:bg-[#3ecfb8]/10" />
            </motion.div>
          ))}
        </div>
      )}

    </motion.div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AboutHero({ hero }: AboutHeroProps) {
  const words = hero.title.split(" ")

  return (
    <section className="relative overflow-hidden bg-white">
      <PastelBlobs />

      {/* Breadcrumb */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-6 lg:px-10">
        <Breadcrumb />
      </div>

      {/* Split grid */}
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-20">

        {/* ── Left: text ── */}
        <div>
          {/* Separator line (desktop only) */}
          <div className="absolute bottom-[12%] right-1/2 top-[12%] hidden w-px lg:block"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(62,207,184,0.3) 30%, rgba(62,207,184,0.3) 70%, transparent)",
            }}
          />

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 inline-flex items-center gap-2.5"
          >
            <span
              className="h-2 w-2 rounded-full bg-[#3ecfb8]"
              style={{ boxShadow: "0 0 0 3px rgba(62,207,184,0.2)" }}
            />
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[#3ecfb8]">
              About our company
            </span>
          </motion.div>

          {/* Headline — Cormorant Garamond via next/font or @import */}
          <h1
            className="mb-0 text-[1.9rem] font-bold leading-[1.18] tracking-[-0.02em] text-[#1a1614] sm:text-[2.4rem] lg:text-[3rem]"
            style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.08 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="mr-[0.18em] inline-block last:mr-0"
              >
                {/* Second word gets italic mint colour */}
                {i === 1 ? (
                  <em style={{ fontStyle: "italic", color: "#3ecfb8" }}>{word}</em>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </h1>

          {/* Accent rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.46, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0 }}
            className="mb-5 mt-4 flex items-center gap-2"
          >
            <div className="h-[1.5px] w-11 rounded-full bg-[#1a1614]" />
            <div className="h-[1.5px] w-[18px] rounded-full bg-[#3ecfb8]" />
            <div className="h-[5px] w-[5px] rounded-full bg-[#f0788a]" />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
            className="mb-9  max-w-[38rem] text-[0.95rem] font-light leading-[1.82] tracking-[0.005em] text-[#5a524c] sm:text-[1rem]"
          >
            {hero.description}
          </motion.p>

          {/* Tag chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-2"
          >
            {[
              {
                label: "Product Sourcing",
                cls: "bg-[#1a1614] text-[#fafaf8] shadow-[0_4px_16px_rgba(26,22,20,0.2)]",
              },
              {
                label: "Quality Control",
                cls: "border border-[rgba(62,207,184,0.35)] bg-[#e6faf6] text-[#0a8a78] shadow-[0_2px_8px_rgba(62,207,184,0.12)]",
              },
              {
                label: "Supply Chain",
                cls: "border border-[rgba(240,120,138,0.3)] bg-[#fef0f2] text-[#c0384c] shadow-[0_2px_8px_rgba(240,120,138,0.10)]",
              },
            ].map(({ label, cls }) => (
              <span
                key={label}
                className={`rounded-full px-[18px] py-2 text-xs font-medium tracking-[0.02em] transition-transform duration-200 hover:-translate-y-px ${cls}`}
              >
                {label}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AboutHero({ hero, whoAreWe }: AboutHeroProps) {
  return (
    <section className="overflow-hidden bg-white">
      <div className="relative mx-auto max-w-7xl px-6 pt-6 md:pt-8 lg:px-8">
        <div className="pb-7 md:pb-8">
          <Breadcrumb />
        </div>
      </div>

      <div className="relative overflow-hidden pb-6 lg:pb-8">
        <HeroBackground image={hero.image1} />
        <DecorOrbs />
        <HeroContent title={hero.title} description={hero.description} />
      </div>
    </section>
  )
}