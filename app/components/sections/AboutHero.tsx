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
    <motion.div
      initial={{ opacity: 0, x: 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-3"
    >
      {/* Frame */}
      <div className="relative">
        {/* Corner accent dots */}
        <div className="absolute -left-2.5 -top-2.5 z-10 h-7 w-7 rounded-lg bg-[#f0788a] shadow-[0_4px_12px_rgba(240,120,138,0.35)]" />
        <div className="absolute -bottom-2.5 -right-2.5 z-10 h-5 w-5 rounded-md bg-[#6ab4e8] shadow-[0_4px_10px_rgba(106,180,232,0.35)]" />

        <div className="overflow-hidden rounded-[1.75rem] shadow-[0_24px_64px_rgba(26,22,20,0.12),0_4px_16px_rgba(26,22,20,0.06)]">
          <div className="relative aspect-[4/3] w-full bg-[#b8d0c8]">
            {image ? (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              /* Warehouse placeholder */
              <div
                className="relative h-full w-full overflow-hidden"
                style={{
                  background:
                    "linear-gradient(160deg, #d4e8e0 0%, #b8d4c8 20%, #c8dcd4 40%, #a8c4bc 60%, #b4ccc4 80%, #9ab8b0 100%)",
                }}
              >
                {/* Ceiling */}
                <div className="absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-[#a0b8b0] to-transparent" />
                {/* Lights */}
                {[20, 50, 80].map((l) => (
                  <div
                    key={l}
                    className="absolute top-0 h-[55%] w-[3px] rounded-b-full bg-gradient-to-b from-white/70 to-transparent"
                    style={{ left: `${l}%` }}
                  />
                ))}
                {/* Shelves */}
                {[28, 54, 76].map((t) => (
                  <div key={t} className="absolute inset-x-0 h-px bg-white/30" style={{ top: `${t}%` }} />
                ))}
                {/* Columns */}
                {[22, 44, 66].map((l) => (
                  <div key={l} className="absolute inset-y-0 w-px bg-white/18" style={{ left: `${l}%` }} />
                ))}
                {/* Boxes */}
                {[
                  { l: 24, t: 30, w: 16, h: 20, o: 0.22 },
                  { l: 46, t: 30, w: 18, h: 20, o: 0.18 },
                  { l: 68, t: 30, w: 13, h: 20, o: 0.25 },
                  { l: 24, t: 56, w: 12, h: 18, o: 0.20 },
                  { l: 46, t: 56, w: 20, h: 18, o: 0.15 },
                  { l: 68, t: 56, w: 16, h: 18, o: 0.22 },
                ].map((b, i) => (
                  <div
                    key={i}
                    className="absolute rounded-sm border border-white/35"
                    style={{
                      left: `${b.l}%`, top: `${b.t}%`,
                      width: `${b.w}%`, height: `${b.h}%`,
                      background: `rgba(255,255,255,${b.o})`,
                    }}
                  />
                ))}
                {/* Floor shadow */}
                <div className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-black/22 to-transparent" />
                {/* Vignette */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 50%, rgba(60,40,30,0.18) 100%)",
                  }}
                />
              </div>
            )}

            {/* Caption */}
            

            {/* Est. badge */}
    
          </div>
        </div>
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

        {/* ── Right: photo + mini strip ── */}
        <PhotoPanel
          image={hero.image1}
          extraImages={[hero.image2,  ].filter(Boolean) as ImageView[]}
        />
      </div>
    </section>
  )
}