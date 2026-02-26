import { AboutHeroView, AboutSectionView, ImageView } from "@/app/lib/types/view";
import Breadcrumb from "../ui/Breadcrumb";
import DynamicSections from "./_DynamicSections";

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

        {/* Dynamic animated sections (client-only) */}
        <DynamicSections hero={hero} whoAreWe={whoAreWe} />
      </div>
    </section>
  );
}