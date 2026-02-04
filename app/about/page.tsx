// app/about/page.tsx
import AboutHero from "../components/sections/AboutHero"
import WhyChooseUs from "../components/sections/WhyChooseUs"
import { getAbout } from "../lib/api/about"

export default function AboutPage() {
  const about = getAbout('th')

  return (
    <main className="space-y-24 bg-[#eeee] ">
      <div className="container mx-auto">
      <AboutHero  hero={about.hero}
        whoAreWe={about.whoAreWe} />

      <WhyChooseUs 
  title={about.why.title}
  items={about.why.items}

  
/>
      </div>


    </main>
  )
}
