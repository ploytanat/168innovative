import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        <div className="font-bold text-lg">168 Innovative</div>

        <ul className="flex gap-6 text-sm">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/products">Products</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
}
