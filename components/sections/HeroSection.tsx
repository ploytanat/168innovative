type Props = {
  title: string;
  description: string;
  image: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
};

export default function HeroSection({
  title,
  description,
  image,
  ctaPrimary,
  ctaSecondary,
}: Props) {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-6">
            {title}
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-xl">
            {description}
          </p>

          <div className="flex gap-4">
            <a
              href={ctaPrimary.href}
              className="inline-flex items-center justify-center rounded-md bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition"
            >
              {ctaPrimary.label}
            </a>
            <a
              href={ctaSecondary.href}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 px-6 py-3 text-sm font-medium hover:bg-gray-50 transition"
            >
              {ctaSecondary.label}
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="flex justify-center">
          <img
            src={image}
            alt="บรรจุภัณฑ์เครื่องสำอาง OEM"
            className="max-w-md w-full"
          />
        </div>
      </div>
    </section>
  );
}
