// app/(site)/page.tsx
import { getHome } from './lib/api/home';
import { getCategories } from './lib/api/categories';
import { getProducts } from './lib/api/products';
import { getWhy } from './lib/api/why';
import { getCompany } from './lib/api/company';

import HeroSection from './components/sections/HeroSection';
import CategorySection from './components/sections/CategorySection';
import ProductMarquee from './components/sections/ProductMarquee';
import WhyChooseUs from './components/sections/WhyChooseUs';
import ContactSection from './components/sections/ContactSection';
import BackgroundBlobs from './components/ui/BackgroundBlobs';


export default function HomePage() {
  const home = getHome('th')
  const category = getCategories('th')
  const products = getProducts('th')
  const why = getWhy('th')
  const company = getCompany('th')
  return (
    <>
   
      <HeroSection data={home.hero} />
      <ProductMarquee items={products} />
       <CategorySection items={category} />
       
       <WhyChooseUs items={why} />
      <ContactSection data={company} />
    </>
  )
}
