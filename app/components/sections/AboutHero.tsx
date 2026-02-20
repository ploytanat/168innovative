"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AboutHeroView, AboutSectionView, ImageView } from "@/app/lib/types/view";
import Breadcrumb from "../ui/Breadcrumb";

interface AboutHeroProps {
  hero: AboutHeroView;
  whoAreWe: AboutSectionView & {
    image?: ImageView;
  };
}

export default function AboutHero({ hero, whoAreWe }: AboutHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section ref={containerRef} className="bg-[#eeeeee] overflow-hidden">
      {/* ================= HERO ================= */}
      <div className="relative min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] flex flex-col">

        {/* Breadcrumb */}
        <div className="container mx-auto px-4 sm:px-6 pt-6 mt-6 relative z-30">
          <Breadcrumb />
        </div>

        {/* Background Image */}
        <div className="absolute right-0 top-0 w-full lg:w-[55%] h-full z-0 overflow-hidden">
          {/* ✅ เพิ่ม will-change-transform ให้ browser จอง GPU layer ไว้ล่วงหน้า */}
          <motion.div
            style={{ y }}
            className="relative w-full h-full hidden sm:block will-change-transform"
          >
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#eeeeee] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#eeeeee] lg:via-[#eeeeee]/30 lg:to-transparent" />
            {hero.image1 && (
              <Image
                src={hero.image1.src}
                alt={hero.image1.alt}
                fill
                // ✅ บอก Next.js ว่ารูปนี้กว้างแค่ไหนในแต่ละ breakpoint → ดาวน์โหลดรูปขนาดที่เหมาะสม
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center"
                priority
              />
            )}
          </motion.div>

          {/* Mobile fallback (no parallax) */}
          <div className="sm:hidden relative w-full h-full">
            {hero.image1 && (
              <Image
                src={hero.image1.src}
                alt={hero.image1.alt}
                fill
                sizes="100vw"
                className="object-cover object-center opacity-20"
                priority
              />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 flex-1 flex items-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="max-w-xl sm:max-w-2xl"
          >
            <span className="inline-block text-[#1e3a5f] font-semibold tracking-[0.25em] uppercase mb-4 text-xs sm:text-sm">
              Established Excellence
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#1e3a5f] leading-tight mb-6">
              {hero.title}
            </h1>

            <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
              {hero.description}
            </p>

            <button className="bg-[#1e3a5f] text-white px-8 sm:px-10 py-4 rounded-full text-base sm:text-lg font-semibold shadow-xl hover:bg-[#152a45] transition">
              View Our Products
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator (Desktop only) */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:block"
        >
          <div className="w-px h-20 bg-gradient-to-b from-[#1e3a5f] to-transparent opacity-30" />
        </motion.div>
      </div>

      {/* ================= WHO WE ARE ================= */}
      <div className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden border-t border-white/50 shadow-inner">

        {/* Background */}
        <div className="absolute inset-0 z-0">
          {hero.image2 && (
            <Image
              src={hero.image2.src}
              alt={hero.image2.alt}
              fill
              // ✅ รูป background เต็มหน้าจอ
              sizes="100vw"
              className="object-cover object-center grayscale-[15%]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white/80 lg:bg-gradient-to-r lg:from-white lg:via-white/95 lg:to-white/30" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-28 items-center">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-xl"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-6 leading-tight">
                {whoAreWe.title}
              </h2>
              <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed">
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
                <div className="absolute inset-0 bg-[#1e3a5f]/5 rounded-3xl blur-2xl" />
                <div className="relative bg-white/70 backdrop-blur-xl p-8 sm:p-10 md:p-14 border border-white/40 shadow-xl rounded-3xl">
                  <div className="w-12 h-1 bg-[#1e3a5f] mb-6" />
                  <p className="text-[#1e3a5f] text-lg sm:text-xl md:text-2xl leading-relaxed italic font-semibold">
                    "We focus on product sourcing, quality control, and reliable supply from trusted manufacturing partners."
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}