import { getHome } from "../lib/api";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const home = await getHome();
  const { hero } = home;

  return (
    <main className="bg-white">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT: TEXT */}
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {hero.title}
          </h1>

          <p className="text-gray-600 text-lg mb-10 max-w-xl">
            {hero.description}
          </p>

          <div className="flex gap-4">
            <Link
              href={hero.ctaPrimary.href}
              className="px-6 py-3 rounded-md bg-slate-800 text-white"
            >
              {hero.ctaPrimary.label}
            </Link>

            <Link
              href={hero.ctaSecondary.href}
              className="px-6 py-3 rounded-md border border-gray-300"
            >
              {hero.ctaSecondary.label}
            </Link>
          </div>
        </div>

        {/* RIGHT: IMAGE */}
        <div className="relative">
          <div className="absolute inset-0 bg-sky-100 rounded-2xl" />
          <Image
            src={hero.image}
            alt={hero.title}
            width={900}
            height={700}
            className="relative z-10 w-full h-auto object-contain p-10"
            priority
          />
        </div>

      </section>

    </main>
  );
}
