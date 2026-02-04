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
    <section className="bg-[#eeee] overflow-hidden">
      <div className="container mx-auto px-6 pt-4">
       <Breadcrumb />        
      </div>

      {/* ================= HERO SECTION ================= */}
    <div className="relative container mx-auto flex items-center">
      
        {/* Background Image with Fade Effect */}
        <div className="absolute right-0 top-0 w-1/2 h-full z-0 hidden lg:block">
          <div className="absolute inset-0 z-10 bg-linear-to-r from-[#eee] via-[#ECEBEB]/20 to-transparent" />
          {hero.image && (
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10 py-16 ">
          <div className="max-w-xl ">
            <h1 className="text-[32px] md:text-[42px] font-bold text-[#1e3a5f] leading-tight mb-6">
              {hero.title}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {hero.description}
            </p>
            <button className="bg-[#1e3a5f] text-white px-8 py-3 rounded-md font-medium hover:bg-[#152a45] transition-colors">
              View Our Products
            </button>
          </div>
        </div>
      
        </div>

      {/* ================= WHO WE ARE (With Responsive Overlay) ================= */}
      <div className="relative w-full min-h-50 flex items-center overflow-hidden border-t border-gray-100">
        <div className="absolute inset-0 z-0">
          {whoAreWe.image && (
            <Image
              src={whoAreWe.image.src}
              alt={whoAreWe.image.alt}
              fill
              className="object-cover object-center"
              priority
            />
          )}
          {/* ปรับ Gradient: จอเล็กไล่จากบนลงล่าง | จอใหญ่ไล่จากซ้ายไปขวา */}
          <div className="absolute inset-0 bg-linear-to-b from-white via-white/80 to-transparent lg:bg-gradient-to-r lg:from-white lg:via-white/90 lg:to-transparent" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10 py-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="max-w-xl">
              
              <h2 className="text-[30px] md:text-[40px] font-bold text-[#1e3a5f] mb-6 leading-tight">
                {whoAreWe.title}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {whoAreWe.description}
              </p>
            </div>

            <div className="lg:pt-20">
              <div className="bg-white/40 backdrop-blur-sm p-8 border-l-4 border-[#1e3a5f] shadow-sm">
                <p className="text-gray-600 text-lg leading-relaxed italic">
                  "We focus on product sourcing, quality control, and reliable supply from trusted manufacturing partners."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}