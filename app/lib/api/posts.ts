import { WP_API_URL } from "../config";
import { fetchWithDevCache } from "./dev-cache";

export async function getPosts() {
  const res = await fetchWithDevCache(
    `${WP_API_URL}/wp-json/wp/v2/posts`,
    { next: { revalidate: 60 } },
    60
  );

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}
