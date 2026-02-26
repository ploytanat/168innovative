"use client";

import dynamic from "next/dynamic";
import { AboutHeroView, AboutSectionView, ImageView } from "@/app/lib/types/view";

// only load these on the client
const AnimatedHeroBg = dynamic(() => import("./_AnimatedHeroBg"), { ssr: false });
const HeroContent = dynamic(() => import("./_HeroContent"), { ssr: false });
const WhoWeAreSection = dynamic(() => import("./_WhoWeAreSection"), { ssr: false });

interface DynamicSectionsProps {
  hero: AboutHeroView;
  whoAreWe: AboutSectionView & {
    image?: ImageView;
  };
}

export default function DynamicSections({ hero, whoAreWe }: DynamicSectionsProps) {
  return (
    <>
      {/* Background Image (parallax handled in client-only chunk) */}
      <AnimatedHeroBg image={hero.image1} />

      {/* Content (animated in client chunk) */}
      <HeroContent title={hero.title} description={hero.description} />

      {/* ================= WHO WE ARE ================= */}
      <WhoWeAreSection whoAreWe={whoAreWe} background={hero.image2} />
    </>
  );
}
