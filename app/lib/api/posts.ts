import { getWordPressPosts } from "./wordpress-source"
import { loadWithWordPressFallback } from "./wp"

export async function getPosts() {
  return loadWithWordPressFallback(
    "posts",
    () => getWordPressPosts(),
    () => []
  )
}
