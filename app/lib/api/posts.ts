import { WP_API_URL } from "../config";

export async function getPosts() {
  const res = await fetch(
    `${WP_API_URL}/wp-json/wp/v2/posts`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}
