import Image from "next/image"

import type { HeroModel } from "@/types/homepage"

interface HeroSectionProps {
  hero: HeroModel
}

export default function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section className="flex items-center bg-[#e0f2f1] py-[80px]">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-[20px]">
        <div className="flex-1 pr-[50px]">
          <h1 className="mb-[20px] font-[Helvetica_Neue,Helvetica,Arial,sans-serif] text-[48px] leading-[1.1] font-bold uppercase text-[#333]">
            {hero.title}
          </h1>
          <p className="mb-[30px] max-w-[400px] text-[16px] text-[#555]">
            {hero.description}
          </p>
          <a
            href={hero.ctaHref}
            className="inline-block cursor-pointer rounded-[5px] border-none bg-[#333] px-[20px] py-[10px] font-bold text-white"
          >
            {hero.ctaLabel}
          </a>
        </div>
        <div className="flex-1">
          <div className="relative mx-auto h-[400px] w-[80%]">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              sizes="(min-width: 1200px) 384px, 40vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
