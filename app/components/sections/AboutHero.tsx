// components/sections/AboutHero.tsx
import Image from "next/image"
import { AboutHeroView, AboutSectionView, ImageView } from "@/app/lib/types/view"
import Breadcrumb from "../ui/Breadcrumb"

interface AboutHeroProps {
  hero: AboutHeroView
  whoAreWe: AboutSectionView & { image?: ImageView }
}

export default function AboutHero({ hero, whoAreWe }: AboutHeroProps) {
  return (
    <div className="bg-white">
      {/* --- HERO SECTION (TOP - LARGE) --- */}
      <section className="relative min-h-[700px] lg:min-h-[80vh] flex items-center overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-20">
          <div className="max-w-2xl">
            <Breadcrumb />
            <h1 className="mt-8 text-[40px] md:text-[52px] lg:text-[60px] font-bold text-[#1e3a5f] leading-[1.1]">
              {hero.title}
            </h1>
            <p className="mt-8 text-gray-600 text-lg md:text-xl leading-relaxed max-w-lg">
              {hero.description}
            </p>
            <div className="mt-10">
              <a href="/products" className="inline-block bg-[#1e3a5f] text-white px-10 py-4 rounded-md font-semibold transition hover:bg-[#162c47] shadow-lg">
                View Our Products
              </a>
            </div>
          </div>
        </div>

        {/* Right Fade Image */}
        <div className="absolute top-0 right-0 w-full lg:w-[55%] h-full z-10">
          <Image src={hero.image.src} alt={hero.image.alt} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
        </div>
      </section>

      {/* --- WHO WE ARE (WITH BG IMAGE) --- */}
      <section className="relative min-h-[450px] flex items-center overflow-hidden border-t border-gray-50">
        <div className="absolute inset-0 z-0">
          {whoAreWe.image && (
            <Image src={whoAreWe.image.src} alt={whoAreWe.image.alt} fill className="object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-[32px] md:text-[40px] font-bold text-[#1e3a5f]">
                {whoAreWe.title}
              </h2>
              <p className="mt-6 text-gray-700 text-lg leading-relaxed">
                {whoAreWe.description}
              </p>
            </div>
            <div className="lg:pt-16 lg:pl-10">
               <p className="text-gray-500 text-lg italic border-l-4 border-gray-200 pl-6">
                 We focus on product sourcing, quality control, and reliable supply from trusted manufacturing partners.
               </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}