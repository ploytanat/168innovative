"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { AboutSectionView, ImageView } from "@/app/lib/types/view";

interface WhoWeAreSectionProps {
  whoAreWe: AboutSectionView & { image?: ImageView };
  background?: ImageView;
}

export default function WhoWeAreSection({ whoAreWe, background }: WhoWeAreSectionProps) {
  return (
    <div className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden border-t border-white/50 shadow-inner">
      {/* Background */}
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
  );
}
