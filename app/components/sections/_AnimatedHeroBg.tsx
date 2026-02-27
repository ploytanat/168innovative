"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ImageView } from "@/app/lib/types/view";

interface AnimatedHeroBgProps {
  image?: ImageView;
}

export default function AnimatedHeroBg({ image }: AnimatedHeroBgProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  if (!image) return null;

  return (
    <div
      ref={containerRef}
      className="absolute right-0 top-0 w-full lg:w-[55%] h-full z-0 overflow-hidden"
    >
      <motion.div
        style={{ y }}
        className="relative w-full h-full hidden sm:block will-change-transform"
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#eeeeee] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#eeeeee] lg:via-[#eeeeee]/30 lg:to-transparent" />
        <img
          src={image.src}
          alt={image.alt}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </motion.div>

      <div className="sm:hidden relative w-full h-full">
        <img
          src={image.src}
          alt={image.alt}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-20"
        />
      </div>
    </div>
  );
}
