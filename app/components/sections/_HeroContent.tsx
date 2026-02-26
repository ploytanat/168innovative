"use client";

import { motion } from "framer-motion";

interface HeroContentProps {
  title: string;
  description: string;
}

export default function HeroContent({ title, description }: HeroContentProps) {
  return (
    <>
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
            {title}
          </h1>

          <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
            {description}
          </p>

          <button className="bg-[#1e3a5f] text-white px-8 sm:px-10 py-4 rounded-full text-base sm:text-lg font-semibold shadow-xl hover:bg-[#152a45] transition">
            View Our Products
          </button>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:block"
      >
        <div className="w-px h-20 bg-gradient-to-b from-[#1e3a5f] to-transparent opacity-30" />
      </motion.div>
    </>
  );
}
