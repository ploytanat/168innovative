const WP = process.env.WP_API_URL;

export async function getPosts() {
  const res = await fetch(`${WP}/wp-json/wp/v2/posts`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to fetch WP");

  return res.json();
}
