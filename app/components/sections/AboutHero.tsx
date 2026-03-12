"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"

import type { AboutHeroView, AboutSectionView, ImageView } from "@/app/lib/types/view"

import Breadcrumb from "../ui/Breadcrumb"

interface AboutHeroProps {
  hero: AboutHeroView
  whoAreWe: AboutSectionView & { image?: ImageView }
}

// ─── Ambient orbs (kept very subtle so they never compete with text) ───────────
function DecorOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      <motion.div
        animate={{ y: [0, -18, 0], x: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className="absolute -right-20 top-[8%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(46,207,196,0.05)_0%,transparent_68%)] blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 14, 0], x: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 9, ease: "easeInOut", delay: 1.5 }}
        className="absolute -left-16 bottom-[10%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(202,184,242,0.05)_0%,transparent_68%)] blur-3xl"
      />
    </div>
  )
}

// ─── Parallax background ──────────────────────────────────────────────────────
function HeroBackground({ image }: { image?: ImageView }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })
  const rawY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const y = useSpring(rawY, { stiffness: 60, damping: 20 })

  if (!image) return null

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
    </div>
  )
}

// ─── Tag pill ─────────────────────────────────────────────────────────────────
function TagPill() {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="liquid-glass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0d7a72]"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2ecfc4] opacity-50" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2ecfc4]" />
      </span>
      Established Excellence
    </motion.span>
  )
}

// ─── Hero content card ────────────────────────────────────────────────────────
function HeroContent({ title, description }: { title: string; description: string }) {
  const words = title.split(" ")

  return (
    <>
      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-20">
        {/* Solid white card — guarantees text contrast regardless of background image */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="liquid-glass-panel relative w-full max-w-[42rem] rounded-[2rem] px-7 py-9 sm:px-10 sm:py-12 lg:px-12 lg:py-14"
        >
          <TagPill />

          {/* Word-stagger headline */}
          <h1 className="mt-6 text-[2rem] font-black leading-[1.1] tracking-[-0.025em] text-gray-900 sm:text-[2.6rem] md:text-[3.1rem] lg:text-[3.6rem]">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="mr-[0.2em] inline-block last:mr-0"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0 }}
            className="mt-5 flex items-center gap-2"
          >
            <div className="h-[3px] w-12 rounded-full bg-[#2ecfc4]" />
            <div className="h-[3px] w-4 rounded-full bg-[#9ddcf6]" />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-[34rem] text-[1.02rem] leading-[1.82] text-gray-600 sm:text-[1.06rem]"
          >
            {description}
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div className="relative z-20 mx-auto hidden w-full max-w-7xl justify-start px-14 lg:flex">
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1.5"
        >
          <div className="h-9 w-px bg-gradient-to-b from-[#2ecfc4]/60 to-transparent" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#2ecfc4]/60" />
        </motion.div>
      </div>
    </>
  )
}

// ─── Who we are section ───────────────────────────────────────────────────────
function WhoWeAreSection({
  whoAreWe,
  background,
}: {
  whoAreWe: AboutSectionView & { image?: ImageView }
  background?: ImageView
}) {
  return (
    <div className="relative flex min-h-[460px] w-full flex-col overflow-hidden border-t border-gray-100 md:min-h-[540px]">
      {/* Background: heavy white overlay so text stays legible */}
      <div className="absolute inset-0 z-0">
        {background && (
          <Image
            src={background.src}
            alt={background.alt}
            fill
            sizes="100vw"
            className="object-cover object-center opacity-30 grayscale-[40%]"
          />
        )}
        <div className="absolute inset-0 bg-white/93 lg:bg-gradient-to-r lg:from-white lg:from-[48%] lg:via-white/96 lg:to-white/60" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-16 sm:px-6 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <span className="mb-5 inline-flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2ecfc4]">
              <span className="h-px w-8 bg-[#2ecfc4]" />
              Who we are
            </span>

            <h2 className="mb-5 text-3xl font-black leading-[1.12] tracking-[-0.02em] text-gray-900 sm:text-4xl md:text-[2.8rem]">
              {whoAreWe.title}
            </h2>

            <p className="text-[1.02rem] leading-[1.82] text-gray-600 sm:text-[1.06rem]">
              {whoAreWe.description}
            </p>

            {/* Stats row */}
            <div className="mt-10 flex gap-10 border-t border-gray-100 pt-8">
              {[
                { value: "15+", label: "Years active" },
                { value: "200+", label: "Trusted partners" },
                { value: "99%", label: "Quality rate" },
              ].map(({ value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-0.5"
                >
                  <span className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">{value}</span>
                  <span className="text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-gray-400">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: quote card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              {/* Soft glow halo */}
              <div className="absolute -inset-2 rounded-[2.3rem] bg-gradient-to-br from-[#2ecfc4]/6 via-[#8ebcf5]/5 to-[#cab8f2]/6 blur-xl" />

              {/* Solid white card */}
              <div className="liquid-glass-panel relative rounded-[2rem] p-8 sm:p-10 md:p-12">
                {/* Decorative quote glyph */}
                <div className="pointer-events-none absolute -top-3 right-8 select-none text-[8rem] font-black leading-none text-gray-100">
                  &ldquo;
                </div>

                <div className="mb-6 h-1 w-12 rounded-full bg-gradient-to-r from-[#2ecfc4] to-[#9ddcf6]" />

                <p className="relative text-[1.18rem] font-semibold italic leading-[1.78] text-gray-800 sm:text-[1.3rem] md:text-[1.4rem]">
                  &quot;We focus on product sourcing, quality control, and reliable supply from trusted manufacturing partners.&quot;
                </p>

                <div className="liquid-glass-pill mt-8 inline-flex items-center gap-2.5 rounded-full px-4 py-2">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#2ecfc4] to-[#8ebcf5]" />
                  <span className="text-xs font-semibold tracking-wide text-gray-500">
                    Our core philosophy
                  </span>
                </div>
              </div>
            </div>
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

      <WhoWeAreSection whoAreWe={whoAreWe} background={hero.image2} />
    </section>
  )
}
