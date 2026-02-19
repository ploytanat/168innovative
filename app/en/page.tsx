// app/en/page.tsx

import { getHome } from '@/app/lib/api/home'
import { getProducts } from '@/app/lib/api/products'
import { getCategories } from '../lib/api/categories'
import { getWhy } from '../lib/api/why'
import { getCompany } from '../lib/api/company'

import HeroCarousel from '@/app/components/sections/HeroCarousel'
import ProductMarquee from '@/app/components/sections/ProductMarquee'
import CategorySection from '../components/sections/CategorySection'
import WhyChooseUs from '../components/sections/WhyChooseUs'
import ContactSection from '../components/sections/ContactSection'

export default function HomeENPage() {
  const locale = 'en'
  const home = getHome(locale)
  const products = getProducts(locale)
  const category = getCategories(locale)
  const why = getWhy(locale)
  const company = getCompany(locale)
  return (
    <>
      <HeroCarousel hero={home.hero} />

     {/*
      <WhyChooseUs items={why} locale={locale} />
      <ContactSection data={company} locale={locale} />
*/}
    </>
  )
}
