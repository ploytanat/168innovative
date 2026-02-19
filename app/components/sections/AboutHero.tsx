"use client"

import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import {
  AboutHeroView,
  AboutSectionView,
} from "@/app/lib/types/view"
import Breadcrumb from "../ui/Breadcrumb"

interface AboutHeroProps {
  hero: AboutHeroView
  whoAreWe: AboutSectionView
}

export default function AboutHero({
  hero,
  whoAreWe,
}: AboutHeroProps) {

  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"])

  return (
    <section ref={containerRef} className="bg-[#eeeeee] overflow-hidden">

      {/* ================= HERO ================= */}
      <div className="relative min-h-[80vh] flex flex-col">

        {/* Breadcrumb */}
        <div className="container mx-auto px-6 pt-10 relative z-30">
          <Breadcrumb />
        </div>

        {/* Background Image - แก้ไขให้ใช้ hero.image ตรงๆ */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {hero.image1 && (
            <motion.div
              style={{ y }}
              className="relative w-full h-full"
            >
              <Image
                src={hero.image1.src}
                alt={hero.image1.alt}
                fill
                priority
                className="object-cover object-center"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 flex-1 flex items-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="uppercase tracking-[0.25em] text-xs text-[#1e3a5f] font-semibold">
              Established Excellence
            </span>

            <h1 className="text-4xl md:text-6xl font-black text-[#1e3a5f] leading-tight mt-4 mb-6">
              {hero.title}
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed">
              {hero.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ================= WHO WE ARE ================= */}
      <div className="relative py-24 border-t border-white/50">

        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-[#1e3a5f] mb-6">
              {whoAreWe.title}
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed">
              {whoAreWe.description}
            </p>
          </motion.div>

          {/* Image */}
          {hero.image2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-[400px] rounded-3xl overflow-hidden shadow-xl"
            >
              <Image
                src={hero.image2.src}
                alt={hero.image2.alt}
                fill
                className="object-cover object-center"
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}