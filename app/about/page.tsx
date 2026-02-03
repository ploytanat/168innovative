import { getAbout } from '@/app/lib/api/about'
import AboutHero from '@/app/components/sections/AboutHero'
import WhoWeAre from '@/app/components/sections/WhoWeAre'
import WhyChooseUs from '@/app/components/sections/WhyChooseUs'

export default function AboutPage() {
  const about = getAbout('th')

  return (
    <>
      <AboutHero data={about.hero} />
    
    </>
  )
}
