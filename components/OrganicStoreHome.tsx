import ClientsSection from "@/components/ClientsSection"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import IngredientStories from "@/components/IngredientStories"
import ProductGrid from "@/components/ProductGrid"
import PromoGrid from "@/components/PromoGrid"
import ReviewsSection from "@/components/ReviewsSection"
import USPBar from "@/components/USPBar"
import type { OrganicHomepageData } from "@/types/homepage"

interface OrganicStoreHomeProps {
  data: OrganicHomepageData
}

export default function OrganicStoreHome({ data }: OrganicStoreHomeProps) {
  return (
    <div
      data-organic-homepage
      className="bg-white font-[Helvetica_Neue,Helvetica,Arial,sans-serif] leading-[1.6] text-[#333]"
    >
      <Header links={data.headerLinks} />
      <HeroSection hero={data.hero} />
      <USPBar items={data.uspItems} />
      <ProductGrid
        id="bestsellers"
        title="Bestsellers"
        viewAllHref={data.bestsellingProducts[0]?.href ?? "#"}
        items={data.bestsellingProducts}
      />
      <IngredientStories stories={data.ingredientStories} />
      <PromoGrid promo={data.promo} />
      <ReviewsSection
        reviews={data.reviews}
        reviewCountLabel={data.reviewCountLabel}
      />
      <ClientsSection section={data.clientsSection} />
      <Footer footer={data.footer} />
    </div>
  )
}
