import { getHome } from '@/app/lib/api/home'
import HeroCarousel from '@/app/components/sections/HeroCarousel'

export default function HomeENPage() {
  const home = getHome('en')

  return (
    <>
      <HeroCarousel hero={home.hero} />
      {/* section อื่น */}
    </>
  )
}
