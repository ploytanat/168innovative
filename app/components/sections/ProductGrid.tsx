type Product = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  featured_image: string;
};

export default function ProductGrid({
  products,
}: {
  products: Product[];
}) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-10">
          สินค้าแนะนำ
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <a
              key={p.id}
              href={`/products/${p.slug}`}
              className="group rounded-lg border bg-white p-6 hover:shadow-md transition"
            >
              <img
                src={p.featured_image}
                alt={p.title}
                className="mb-4 h-48 w-full object-contain"
              />
              <h3 className="text-lg font-medium mb-2 group-hover:underline">
                {p.title}
              </h3>
              <p className="text-sm text-gray-600">
                {p.excerpt}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
