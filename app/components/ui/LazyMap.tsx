"use client";

import { useEffect, useRef, useState } from "react";
import { COLORS, GLASS, PAGE_BG } from "@/app/components/ui/designSystem";

interface LazyMapProps {
  src: string;
  title?: string;
}

export default function LazyMap({ src, title = "Map" }: LazyMapProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "50px" }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[450px] w-full overflow-hidden rounded-[1.1rem] grayscale-[0.2] transition-all duration-700 hover:grayscale-0"
      style={{ ...GLASS.primary, background: PAGE_BG }}
    >
      {isLoaded ? (
        <iframe
          title={title}
          src={src}
          className="w-full h-full border-none"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ ...GLASS.stats, background: "rgba(255,255,255,0.42)" }}
        >
          <p className="text-sm" style={{ color: COLORS.mid }}>Loading map...</p>
        </div>
      )}
    </div>
  );
}
