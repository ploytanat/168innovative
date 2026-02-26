import dynamic from "next/dynamic";
import { AboutHeroView, AboutSectionView, ImageView } from "@/app/lib/types/view";
import Breadcrumb from "../ui/Breadcrumb";

// these chunks only load on the client when the user visits the about page
const AnimatedHeroBg = dynamic(() => import("./_AnimatedHeroBg"), { ssr: false });
const HeroContent = dynamic(() => import("./_HeroContent"), { ssr: false });
const WhoWeAreSection = dynamic(() => import("./_WhoWeAreSection"), { ssr: false });

interface AboutHeroProps {
  hero: AboutHeroView;
  whoAreWe: AboutSectionView & {
    image?: ImageView;
  };
}

export default function AboutHero({ hero, whoAreWe }: AboutHeroProps) {
  return (
    <section className="bg-[#eeeeee] overflow-hidden">
      {/* ================= HERO ================= */}
      <div className="relative min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] flex flex-col">

        {/* Breadcrumb */}
        <div className="container mx-auto px-4 sm:px-6 pt-6 mt-6 relative z-30">
          <Breadcrumb />
        </div>

        {/* Background Image (parallax handled in client-only chunk) */}
        <AnimatedHeroBg image={hero.image1} />

        {/* Content (animated in client chunk) */}
        <HeroContent title={hero.title} description={hero.description} />
      </div>

      {/* ================= WHO WE ARE ================= */}
      <WhoWeAreSection whoAreWe={whoAreWe} background={hero.image2} />
    </section>
  );
}