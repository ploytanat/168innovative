import type { Metadata } from "next"
import Image from "next/image"
import { ArrowRight, CalendarDays } from "lucide-react"

import LocalizedLink from "@/app/components/ui/LocalizedLink"
import PageIntro from "@/app/components/ui/PageIntro"
import { buildMetadata } from "@/app/config/seo"
import { getArticles } from "@/app/lib/api/articles"

export const metadata: Metadata = buildMetadata({
  locale: "en",
  title: "Articles & In-Depth Insights",
  description:
    "Articles about cosmetic packaging, OEM production, sourcing decisions, and brand-building strategies for modern businesses.",
  path: "/articles",
  keywords: ["cosmetic packaging articles", "OEM insights", "packaging knowledge"],
})

export default async function ArticlesPage() {
  const locale = "en"
  const articles = await getArticles(locale)

  if (!articles.length) {
    return (
      <main className="min-h-screen bg-transparent">
        <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <PageIntro
            eyebrow="Articles & Insights"
            title="Articles & In-Depth Insights"
            description="No articles at this time."
            breadcrumbs={[{ label: "Articles" }]}
          />
        </div>
      </main>
    )
  }

  const [featured, ...others] = articles

  return (
    <main className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-7xl px-6 pb-32 lg:px-8">
        <PageIntro
          eyebrow="Articles & Insights"
          title="Articles & In-Depth Insights"
          description="Stay updated on packaging trends, OEM manufacturing decisions, and sourcing ideas that support a cleaner launch path."
          breadcrumbs={[{ label: "Articles" }]}
        />

        {featured && (
          <section className="mt-10 mb-20 border-t border-[rgba(211,217,225,0.96)] pt-6">
            <LocalizedLink
              href={`/articles/${featured.slug}`}
              className="deck-card-soft group grid overflow-hidden rounded-[1.15rem] transition-shadow hover:shadow-[0_22px_44px_rgba(28,40,66,0.1)] lg:grid-cols-[1.1fr_1fr]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] lg:aspect-auto lg:min-h-[360px] lg:rounded-r-none">
                <Image
                  src={featured.coverImage?.src || "/placeholder.jpg"}
                  alt={featured.coverImage?.alt || featured.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>

              <div className="flex flex-col justify-center p-6 md:p-8">
                <span className="inline-flex w-fit items-center rounded-[0.9rem] border border-[rgba(108,131,162,0.2)] bg-[var(--color-accent-soft)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent)]">
                  Featured Article
                </span>

                <h2 className="mt-5 font-heading text-2xl font-bold leading-snug text-[var(--color-ink)] md:text-3xl">
                  {featured.title}
                </h2>

                <p className="mt-4 line-clamp-3 text-base leading-8 text-[var(--color-ink-soft)]">
                  {featured.excerpt}
                </p>

                {featured.publishedAt && (
                  <p className="mt-6 flex items-center gap-1.5 text-[12px] text-[#6f8099]">
                    <CalendarDays size={12} />
                    {new Date(featured.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}

                <div className="mt-8 flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] transition-all group-hover:gap-3">
                  Read More
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </LocalizedLink>
          </section>
        )}

        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {others.map((article) => (
            <LocalizedLink
              key={article.id}
              href={`/articles/${article.slug}`}
              className="deck-card group flex flex-col rounded-[1rem] p-2.5"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[0.95rem] bg-[linear-gradient(145deg,#eef4fb,#f6f9ff)]">
                {article.coverImage ? (
                  <Image
                    src={article.coverImage.src}
                    alt={article.coverImage.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(145deg,#eef2f6,#f5f7fa)]" />
                )}
              </div>

              {article.publishedAt && (
                <p className="mt-4 flex items-center gap-1.5 text-[12px] text-[#6f8099]">
                  <CalendarDays size={11} />
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              )}

              <h3 className="mt-2 font-heading text-lg font-bold leading-snug text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
                {article.title}
              </h3>

              <p className="mt-2 line-clamp-2 text-base leading-7 text-[var(--color-ink-soft)]">
                {article.excerpt}
              </p>

              <div className="mt-3 h-px w-0 bg-[linear-gradient(90deg,#2a2d33,#7d94b0,#dbe3ec)] transition-all duration-300 group-hover:w-10" />
            </LocalizedLink>
          ))}
        </div>
      </div>
    </main>
  )
}
