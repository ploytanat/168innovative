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
      <div className="relative min-h-[650px] lg:min-h-[85vh] flex items-center overflow-hidden">
        {/* Content */}
        <div className="container mx-auto px-6 lg:px-12 relative z-20 pb-20">
          <div className="max-w-2xl">
            <Breadcrumb />

            <h1 className="mt-8 text-[38px] md:text-[52px] lg:text-[62px] font-bold text-[#1e3a5f] leading-[1.15]">
              {hero.title}
            </h1>

            <p className="mt-8 text-gray-600 text-lg md:text-xl leading-relaxed max-w-lg">
              {hero.description}
            </p>

            <div className="mt-10">
              <a
                href="/products"
                className="inline-block bg-[#1e3a5f] text-white px-10 py-4 rounded-md font-semibold text-lg transition-all hover:bg-[#162c47] hover:shadow-xl active:scale-95"
              >
                View Our Products
              </a>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full z-10">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 md:via-white/30 to-transparent" />
        </div>
      </div>

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
