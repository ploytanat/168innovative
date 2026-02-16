import { Metadata } from "next";
import { WPPost } from "../lib/api/wp";

const WP = process.env.WP_API_URL;

export const revalidate = 60; // ISR 60 วินาที

async function getPosts(): Promise<WPPost[]> {
  if (!WP) {
    throw new Error("WP_API_URL is not defined");
  }

  const res = await fetch(`${WP}/wp-json/wp/v2/posts`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch WordPress posts");
  }

  return res.json();
}

export const metadata: Metadata = {
  title: "Blog | 168 Innovative",
  description: "Latest articles and insights",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>

      {posts.length === 0 && (
        <p className="text-gray-500">No posts found.</p>
      )}

      <div className="space-y-10">
        {posts.map((post) => (
          <article key={post.id} className="border-b pb-6">
            <h2
              className="text-xl font-semibold mb-2"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            <div
              className="text-gray-600"
              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
            />
          </article>
        ))}
      </div>
    </main>
  );
}
