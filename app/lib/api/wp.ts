import { fetchWordPress } from "./fetch-wordpress"
const WP = process.env.WP_API_URL;

if (!WP) {
  throw new Error("WP_API_URL is not defined");
}

export async function getPosts() {
  const res = await fetchWordPress(`${WP}/wp-json/wp/v2/posts`, {
    next: { revalidate: 60 },
  });

  if (!res?.ok) {
    return [];
  }

  return res.json();
  
}
export interface WPPost {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
}
