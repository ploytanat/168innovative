// app/(site)/page.tsx
import { getHome } from './lib/api/home';
import HeroSection from './components/sections/HeroSection';

export default function HomePage() {
  const home = getHome('th')

  return (
    <>
      <HeroSection data={home.hero} />

    </>
  )
}
