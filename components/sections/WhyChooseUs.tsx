type Item = {
  title: string;
  description: string;
};

export default function WhyChooseUs({
  items,
}: {
  items: Item[];
}) {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-10">
          Why Choose Us
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-lg border p-6 bg-white"
            >
              <h3 className="font-medium mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
