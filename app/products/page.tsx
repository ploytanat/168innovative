import { getProducts } from "@/app/lib/api/products";
import { Locale } from "@/app/lib/types/content";

export default async function ProductsPage() {
  const locale: Locale = "th"; // ชั่วคราว

  const products = await getProducts(locale);

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-6">Products</h1>

      <div className="grid gap-6">
        {products.map((p) => (
          <div key={p.id} className="border p-4">
            <h2 className="text-lg font-bold">{p.name}</h2>
            <p>{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
