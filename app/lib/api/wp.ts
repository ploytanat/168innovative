const WP = process.env.WP_API_URL;

if (!WP) {
  throw new Error("WP_API_URL is not defined");
}

export async function getPosts() {
  const res = await fetch(`${WP}/wp-json/wp/v2/posts`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch WordPress posts");
  }

  return res.json();
  
}
console.log("WP_API_URL:", process.env.WP_API_URL);
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
