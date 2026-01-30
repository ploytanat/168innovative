// app/en/page.tsx
import { getHome } from "../lib/api/home"

export default function HomePageEN() {
  const home = getHome('en')

  return (
    <>
      <h1>{home.hero.title}</h1>
      <p>{home.hero.description}</p>
    </>
  )
}
