"use client";

import { useEffect, useRef, useState } from "react";

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
      className="w-full h-[450px] relative grayscale-[0.2] hover:grayscale-0 transition-all duration-700 bg-gray-200"
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
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-gray-500 text-sm">Loading map...</p>
        </div>
      )}
    </div>
  );
}
