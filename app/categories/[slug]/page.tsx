import { getCategoryBySlug } from "@/app/lib/api/categories";
import { getProductsByCategory } from "@/app/lib/api/products";
import { getArticles } from "@/app/lib/api/articles";
import { Locale } from "@/app/lib/types/content";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/app/components/ui/Breadcrumb";
import BackgroundBlobs from "@/app/components/ui/BackgroundBlobs";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

/* ================= Metadata ================= */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug, "th");

  if (!category) return { title: "ไม่พบหมวดหมู่สินค้า" };

  return {
    title: `${category.name} | บรรจุภัณฑ์เครื่องสำอาง OEM / ODM`,
    description:
      category.description ||
      `รวมสินค้าในหมวด ${category.name} สำหรับเจ้าของแบรนด์เครื่องสำอาง`,
    alternates: {
      canonical: `https://yourwebsite.com/categories/${slug}`,
    },
  };
  
}

/* ================= Page ================= */
export default async function CategoryProductsPage({ params }: Props) {
  const { slug } = await params;
  const locale: Locale = "th";

  const [category, articles] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getArticles(locale),
  ]);

  if (!category) notFound();

  const products = getProductsByCategory(category.id, locale);
  const relatedArticles = articles.slice(0, 3);

  return (
  <main className="bg-[#F8F9FA] pt-12 pb-32">
     <BackgroundBlobs />
  
      <div className="mx-auto container relative px-4 lg:px-8">
        <Breadcrumb />

        {/* ================= HERO ================= */}
        <header className="mx-auto mt-20 max-w-4xl text-center">
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
            {category.name}
          </h1>

          {category.description && (
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl">
              {category.description}
            </p>
          )}
        </header>

        {/* ================= PRODUCTS ================= */}
          <section
            aria-label="Product Lists"
             className="mt-20 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 border-t border-gray-300 pt-6"
          >
            {products.map((product, index) =>(
              <Link
                key={product.id}
                href={`/categories/${category.slug}/${product.slug}`}
                className="
                            group relative overflow-hidden rounded-xl 
                            shadow-sm
                "   
              >

                {/* IMAGE*/}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  {product.image?.src ? (
                    <Image src={product.image.src} 
                           alt={product.image.alt}
                           fill
                           priority
                          sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                          className="object-cover transition-transform duration-700
                               group-hover:scale-110 "
                          />

                  ) : (
                     <div
                    className="
        flex h-full w-full items-center justify-center
        bg-linear-to-br from-gray-100 to-gray-200
      "
                  >
                    <span className="text-xs font-semibold text-gray-400">
                      Image coming soon
                    </span>
                  </div>
                )}
                </div>

                 {/* CONTENT */}
              <div className="flex flex-col items-center p-6 text-center">
                <h2
                  className="
      text-lg font-bold text-gray-900
      transition-colors
      group-hover:text-blue-600
    "
                >
                  {product.name}
                </h2>
              </div>
            </Link>
            ))}
          </section>

            {/* ================= Knowledge / SEO Section ================= */}
            
            <section className="mt-32 rounded-[3rem] bg-white px-8 py-20 shadow-sm md:px-20">
            <div className="mx-auto max-w-5xl">
              <header className="mb-20 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  ความรู้เกี่ยวกับ{category.name}
                </h2>
                <p className="mt-4 text-gray-500">
                  แนวทางการเลือกบรรจุภัณฑ์ และการสร้างแบรนด์ให้เติบโต
                </p>
              </header>

             <div className="grid gap-16 md:grid-cols-3">
  {relatedArticles.map((article, index) => (
    <article key={article.id} className="group">
      <Link href={`/articles/${article.slug}`}>
        
        {/* IMAGE WRAPPER (จำเป็นสำหรับ fill) */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
          {article.coverImage?.src ? (
            <Image
              src={article.coverImage.src}
              alt={article.coverImage.alt || article.title}
              fill
              priority={index === 0}
              sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
              No image
            </div>
          )}
        </div>

        <h3 className="mt-6 text-lg font-bold text-gray-800 transition group-hover:text-blue-600">
          {article.title}
        </h3>
      </Link>

      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
        {article.excerpt}
      </p>
    </article>
  ))}
</div>

            </div>
          </section>

      </div>
    </main>
  );
}
