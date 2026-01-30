// app/(site)/page.tsx
import { getHome } from './lib/api/home';
import { getCategories } from './lib/api/categories';
import { getProducts } from './lib/api/products';
import HeroSection from './components/sections/HeroSection';
import CategorySection from './components/sections/CategorySection';
import ProductMarquee from './components/sections/ProductMarquee';

export default function HomePage() {
  const home = getHome('th')
  const category = getCategories('th')
  const products = getProducts('th')

  return (
    <>
      <HeroSection data={home.hero} />
       <CategorySection items={category} />
       <ProductMarquee items={products} />
    </>
  )
}
