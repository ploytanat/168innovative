"use client";

import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { AboutHeroView, AboutSectionView, ImageView } from "@/app/lib/types/view"
import Breadcrumb from "../ui/Breadcrumb"

interface AboutHeroProps {
  hero: AboutHeroView
  whoAreWe: AboutSectionView & {
    image?: ImageView
  }
}

export default function AboutHero({ hero, whoAreWe }: AboutHeroProps) {
  const containerRef = useRef(null);
  
  // สร้าง Parallax Effect เบาๆ สำหรับรูปภาพ
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={containerRef} className="bg-[#eeeeee] overflow-hidden">
      {/* ================= PREMIUM HERO SECTION (BIGGER) ================= */}
      <div className="relative min-h-[85vh] lg:min-h-[90vh] flex flex-col">
        
        {/* Top Bar Navigation Area */}
        <div className="container mx-auto px-6 pt-6 mt-8 relative z-30">
          <Breadcrumb />
        </div>

        {/* Hero Background - Full Side Coverage */}
        <div className="absolute right-0 top-0 w-full lg:w-[55%] h-full z-0 overflow-hidden">
          <motion.div style={{ y }} className="relative w-full h-full">
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#eeeeee] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#eeeeee] lg:via-[#eeeeee]/20 lg:to-transparent" />
            {hero.image && (
              <Image 
                src={hero.image.src} 
                alt={hero.image.alt} 
                fill 
                className="object-cover object-center" 
                priority 
              />
            )}
          </motion.div>
        </div>

        {/* Hero Content Area */}
        <div className="container mx-auto px-6 lg:px-12 flex-1 flex items-center relative z-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block text-[#1e3a5f] font-bold tracking-[0.3em] uppercase mb-4 text-sm"
            >
              Established Excellence
            </motion.span>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-[#1e3a5f] leading-[1.05] mb-8 tracking-tight">
              {hero.title}
            </h1>
            
            <p className="text-gray-600 text-xl md:text-2xl leading-relaxed mb-10 max-w-xl font-light">
              {hero.description}
            </p>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button className="bg-[#1e3a5f] text-white px-12 py-5 rounded-full text-lg font-semibold shadow-2xl hover:bg-[#152a45] transition-all duration-300">
                View Our Products
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator Decoration */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:block"
        >
          <div className="w-px h-20 bg-gradient-to-b from-[#1e3a5f] to-transparent opacity-30" />
        </motion.div>
      </div>

      {/* ================= WHO WE ARE (Classic Overlay Layout) ================= */}
      <div className="relative w-full min-h-[600px] flex items-center overflow-hidden border-t border-white/50 shadow-inner">
        
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          {whoAreWe.image && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="relative w-full h-full"
            >
              <Image 
                src={whoAreWe.image.src} 
                alt={whoAreWe.image.alt} 
                fill 
                className="object-cover object-center grayscale-[20%]" 
              />
            </motion.div>
          )}
          {/* Responsive Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-transparent lg:bg-gradient-to-r lg:from-white lg:via-white/95 lg:to-white/20" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-xl"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-8 leading-tight">
                {whoAreWe.title}
              </h2>
              <p className="text-gray-700 text-xl leading-relaxed font-light">
                {whoAreWe.description}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative p-1">
                <div className="absolute inset-0 bg-[#1e3a5f]/5 rounded-3xl blur-2xl" />
                <div className="relative bg-white/60 backdrop-blur-xl p-10 md:p-14 border border-white/40 shadow-2xl rounded-3xl">
                  <div className="w-12 h-1 bg-[#1e3a5f] mb-8" />
                  <p className="text-[#1e3a5f] text-2xl leading-relaxed italic font-semibold">
                    "We focus on product sourcing, quality control, and reliable supply from trusted manufacturing partners."
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}