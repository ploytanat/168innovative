// app/(site)/page.tsx
import { getHome } from "./lib/api/home"

export default function HomePage() {
  const home = getHome('th')

  return (
    <>
      <h1>{home.hero.title}</h1>
      <p>{home.hero.description}</p>
    </>
  )
}
