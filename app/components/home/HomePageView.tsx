import ClientsSection from "@/app/components/sections/ClientsSection"
import CategorySection from "@/app/components/sections/CategorySection"
import ContactSection from "@/app/components/sections/ContactSection"
import FirstTimeBanner from "@/app/components/sections/FirstTimeBanner"
import HeroSection from "@/app/components/sections/HeroSection"
import ProductMarquee from "@/app/components/sections/ProductMarquee"
import QualityBanner from "@/app/components/sections/QualityBanner"
import WhyChooseUs from "@/app/components/sections/WhyChooseUs"
import type {
  CategoryView,
  CompanyView,
  HeroSlideView,
  ProductView,
  WhyItemView,
} from "@/app/lib/types/view"

type Locale = "th" | "en"

interface HomePageViewProps {
  locale: Locale
  heroSlides: HeroSlideView[]
  categories: CategoryView[]
  products: ProductView[]
  whys: WhyItemView[]
  company?: CompanyView | null
}

export default function HomePageView({
  locale,
  heroSlides,
  categories,
  products,
  whys,
  company,
}: HomePageViewProps) {
  return (
    <div className="bg-[#f8f8f4]">
      <HeroSection slides={heroSlides} categories={categories} locale={locale} />
      <ClientsSection locale={locale} />
      <CategorySection items={categories} locale={locale} />
      <ProductMarquee items={products} locale={locale} limit={8} variant="popular" />
      <QualityBanner locale={locale} company={company} />
      <WhyChooseUs items={whys} locale={locale} />
      <FirstTimeBanner locale={locale} />
      {company ? <ContactSection data={company} locale={locale} /> : null}
    </div>
  )
}
