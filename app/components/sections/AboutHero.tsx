// components/sections/AboutHero.tsx
import Image from "next/image"
import { AboutHeroView, AboutSectionView, ImageView } from "@/app/lib/types/view"
import Breadcrumb from "../ui/Breadcrumb"

interface AboutHeroProps {
  hero: AboutHeroView
  whoAreWe: AboutSectionView & {
    image?: ImageView
  }
}

export default function AboutHero({ hero, whoAreWe }: AboutHeroProps) {
  return (

    
    <section className="bg-white overflow-hidden">
      {/* ================= HERO SECTION ================= */}

     

      {/* ================= WHO WE ARE ================= */}
      <div className="relative w-full min-h-[500px] flex items-center overflow-hidden border-t border-gray-50">
        <div className="absolute inset-0 z-0">
          {whoAreWe.image && (
            <Image
              src={whoAreWe.image.src}
              alt={whoAreWe.image.alt}
              fill
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/10" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-[34px] md:text-[42px] font-bold text-[#1e3a5f] mb-8">
                {whoAreWe.title}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {whoAreWe.description}
              </p>
            </div>

            <div className="lg:pt-24">
              <p className="text-gray-500 text-lg leading-relaxed border-l-4 border-gray-200 pl-8">
                We focus on product sourcing, quality control, and reliable supply from trusted manufacturing partners.
              </p>
            </div>
          </div>
        </div>
      </div>

      
    </section>
  )
}
