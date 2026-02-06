// app/(site)/page.tsx
import { getHome } from './lib/api/home';
import { getCategories } from './lib/api/categories';
import { getProducts } from './lib/api/products';
import { getWhy } from './lib/api/why';
import { getCompany } from './lib/api/company';

import HeroCarousel from './components/sections/HeroCarousel';
import CategorySection from './components/sections/CategorySection';
import ProductMarquee from './components/sections/ProductMarquee';
import WhyChooseUs from './components/sections/WhyChooseUs';
import ContactSection from './components/sections/ContactSection';



export default function HomePage() {

  const locale = 'th'

  const home = getHome(locale)
  const category = getCategories(locale)
  const products = getProducts(locale)
  const why = getWhy(locale)
  const company = getCompany(locale)

  return (
    <>
      <HeroCarousel hero={home.hero} />
      <ProductMarquee
        items={products}
        categorySlug="spout"
        locale={locale}
      />

      <CategorySection items={category} locale={locale} />
      <WhyChooseUs items={why} locale={locale} />
      <ContactSection data={company} locale={locale}  />
    </>
  )
}
