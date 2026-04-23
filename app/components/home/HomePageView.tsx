import ArticleJournal from "@/app/components/sections/ArticleJournal"
import CategorySection from "@/app/components/sections/CategorySection"
import CategoryStories from "@/app/components/sections/CategoryStories"
import ClientsSection from "@/app/components/sections/ClientsSection"
import ContactSection from "@/app/components/sections/ContactSection"
import FirstTimeBanner from "@/app/components/sections/FirstTimeBanner"
import HeroSection from "@/app/components/sections/HeroSection"
import ProductMarquee from "@/app/components/sections/ProductMarquee"
import QualityBanner from "@/app/components/sections/QualityBanner"
import USPBar from "@/app/components/sections/USPBar"
import WhyChooseUs from "@/app/components/sections/WhyChooseUs"
import type {
  ArticleView,
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
  articles: ArticleView[]
}

export default function HomePageView({
  locale,
  heroSlides,
  categories,
  products,
  whys,
  company,
  articles,
}: HomePageViewProps) {
  return (
    <div className="bg-[#f8f8f4]">
      {/* 1. Hero */}
      <HeroSection slides={heroSlides} categories={categories} locale={locale} />

      {/* 2. USP strip */}
      <USPBar locale={locale} />

      {/* 3. Category stories (circular thumbnails) */}
      <CategoryStories items={categories} locale={locale} />

      {/* 4. Bestsellers — static 4-col product grid */}
      <ProductMarquee items={products} locale={locale} limit={8} variant="popular" />

      {/* 5. First-time / OEM primer dark CTA */}
      <FirstTimeBanner locale={locale} />

      {/* 6. Reviews / Why choose us */}
      <WhyChooseUs items={whys} locale={locale} />

      {/* 7. Client logos marquee */}
      <ClientsSection locale={locale} />

      {/* 8. Category showcase grid */}
      <CategorySection items={categories} locale={locale} />

      {/* 9. Quality dark banner */}
      <QualityBanner locale={locale} company={company} />

      {/* 10. Journal / articles */}
      <ArticleJournal articles={articles} locale={locale} />

      {/* 11. Contact CTA */}
      {company ? <ContactSection data={company} locale={locale} /> : null}
    </div>
  )
}
