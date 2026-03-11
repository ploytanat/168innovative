// app/admin/layout.tsx
import Link from 'next/link'

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>

        <nav className="space-y-4 text-sm">
          <Link
            href="/admin"
            className="block text-gray-700 hover:text-black"
          >
            Dashboard
          </Link>

          <Link
            href="/admin/products"
            className="block text-gray-700 hover:text-black"
          >
            Products
          </Link>

          <Link
            href="/admin/articles"
            className="block text-gray-700 hover:text-black"
          >
            Articles
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  )
}
