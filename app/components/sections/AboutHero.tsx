"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"

import type { AboutHeroView, AboutSectionView, ImageView } from "@/app/lib/types/view"
import Breadcrumb from "../ui/Breadcrumb"

interface AboutHeroProps {
  hero: AboutHeroView
  whoAreWe: AboutSectionView & {
    image?: ImageView
  }
}

function HeroBackground({ image }: { image?: ImageView }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])

  if (!image) return null

  return (
    <div
      ref={containerRef}
      className="absolute right-0 top-0 z-0 h-full w-full overflow-hidden lg:w-[56%]"
    >
      {/* Desktop / tablet */}
      <motion.div
        style={{ y }}
        className="relative hidden h-[108%] w-full will-change-transform sm:block"
      >
        {/* Vignette ขอบซ้ายไล่เข้าหาภาพ — สีตรงกับ bg จริง */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#fefcff] via-[#f5fbff]/94 via-[28%] to-[#f5fbff]/8" />
        {/* Vignette ด้านบน–ล่างเพิ่มความลึก */}
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_18%_48%,rgba(254,252,255,0.98)_0%,rgba(245,251,255,0.88)_24%,rgba(255,241,246,0.42)_48%,rgba(245,251,255,0)_72%)]" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#fefcff]/54 via-transparent via-[36%] to-[#f5fbff]/38" />

        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="(min-width: 1024px) 56vw, 100vw"
          className="object-cover object-center opacity-[0.9]"
        />
      </motion.div>

      {/* Mobile — image เบามาก เป็น texture หลังเนื้อหา */}
      <div className="relative h-full w-full sm:hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-10"
        />
        {/* overlay เพื่อป้องกัน contrast ต่ำบน mobile */}
        <div className="absolute inset-0 bg-[#f9fcff]/60" />
      </div>
    </div>
  )
}

function HeroContent({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <>
      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="w-full max-w-[46rem] rounded-[2rem] border border-[rgba(205,222,241,0.72)] bg-[linear-gradient(145deg,rgba(255,255,255,0.84),rgba(241,251,255,0.78),rgba(255,241,246,0.72))] px-6 py-7 shadow-[0_18px_52px_rgba(28,40,66,0.1)] backdrop-blur-lg sm:px-8 sm:py-9 lg:max-w-[43rem] lg:px-10 lg:py-10"
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(205,222,241,0.86)] bg-white/76 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-ink)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2ecfc4]" />
            Established Excellence
          </span>

          {/* Heading */}
          <h1 className="mt-5 text-[2rem] font-black leading-[1.08] tracking-[-0.02em] text-[var(--color-ink)] sm:text-[2.5rem] md:text-[3.15rem] lg:text-[3.6rem]">
            {title}
          </h1>

          {/* Accent divider — เพิ่ม taper ให้ดูละเอียดขึ้น */}
          <div className="mt-4 flex items-center gap-2">
            <div className="h-[2px] w-10 rounded-full bg-[#2ecfc4]" />
            <div className="h-[2px] w-3 rounded-full bg-[#f8a7b8]" />
          </div>

          {/* Description */}
          <p className="mt-5 max-w-[40rem] text-[0.95rem] leading-7 text-[var(--color-ink-soft)] sm:text-base sm:leading-8 md:text-[1.02rem]">
            {description}
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-20 mx-auto hidden w-full max-w-7xl px-6 lg:block lg:px-8">
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <div className="h-8 w-px bg-gradient-to-b from-[#8ebcf5]/70 to-transparent" />
          <div className="h-1 w-1 rounded-full bg-[#2ecfc4]/70" />
        </motion.div>
      </div>
    </>
  )
}

function WhoWeAreSection({
  whoAreWe,
  background,
}: {
  whoAreWe: AboutSectionView & { image?: ImageView }
  background?: ImageView
}) {
  return (
    <div className="relative flex min-h-[420px] w-full items-center overflow-hidden border-t border-white/50 shadow-inner md:min-h-[520px]">
      <div className="absolute inset-0 z-0">
        {background && (
          <Image
            src={background.src}
            alt={background.alt}
            fill
            sizes="100vw"
            className="object-cover object-center grayscale-[15%]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fefcff] via-[#f9fcff]/95 to-white/80 lg:bg-gradient-to-r lg:from-[#fefcff] lg:via-[#f9fcff]/95 lg:to-white/30" />
      </div>

      <div className="container mx-auto relative z-10 px-4 py-16 sm:px-6 lg:px-12 lg:py-18">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h2 className="mb-5 text-3xl font-bold leading-tight text-[var(--color-ink)] sm:text-4xl md:text-[3rem]">
              {whoAreWe.title}
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-[var(--color-ink-soft)] sm:text-lg md:text-[1.05rem]">
              {whoAreWe.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div className="relative p-1">
              <div className="absolute inset-0 rounded-3xl bg-[#8ebcf5]/10 blur-2xl" />
              <div className="relative rounded-3xl border border-[rgba(205,222,241,0.72)] bg-[linear-gradient(145deg,rgba(255,255,255,0.84),rgba(241,251,255,0.78),rgba(255,241,246,0.72))] p-7 shadow-xl backdrop-blur-xl sm:p-9 md:p-12">
                <div className="mb-5 h-1 w-12 bg-[linear-gradient(90deg,#2ecfc4,#f8a7b8)]" />
                <p className="text-lg font-semibold italic leading-relaxed text-[var(--color-ink)] sm:text-xl md:text-[1.65rem]">
                  &quot;We focus on product sourcing, quality control, and reliable supply from trusted manufacturing partners.&quot;
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function AboutHero({ hero, whoAreWe }: AboutHeroProps) {
  return (
    <section className="overflow-hidden bg-transparent">
      <div className="relative mx-auto max-w-7xl px-6 pt-6 md:pt-8 lg:px-8">
        <div className="pb-7 md:pb-8">
          <Breadcrumb />
        </div>
      </div>
      <div className="relative overflow-hidden pb-5 lg:pb-6">
        <HeroBackground image={hero.image1} />
        <HeroContent title={hero.title} description={hero.description} />
      </div>
      <WhoWeAreSection whoAreWe={whoAreWe} background={hero.image2} />
    </section>
  )
}
