// app/about/page.tsx
import AboutHero from "@/app/components/sections/AboutHero"
import WhyChooseUs from "@/app/components/sections/WhyChooseUs"
import { getAbout } from "@/app/lib/api/about"

export default function AboutPage() {
  const about = getAbout('en')

  return (
    <main className="space-y-24">
      <AboutHero  hero={about.hero}
        whoAreWe={about.whoAreWe} />

      <WhyChooseUs
  title={about.why.title}
  items={about.why.items}
/>

    </main>
  )
}
