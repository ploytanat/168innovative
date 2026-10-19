import { fetchWordPress } from "./fetch-wordpress"
import { WP_API_URL } from "../config";

export async function getPosts() {
  const res = await fetchWordPress(
    `${WP_API_URL}/wp-json/wp/v2/posts`,
    { next: { revalidate: 60 } }
  );

  if (!res?.ok) {
    return [];
  }

  return res.json();
}
