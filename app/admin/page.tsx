// app/admin/page.tsx

export const metadata = {
  title: 'Admin Dashboard',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-sm text-gray-500 mb-2">
            Total Products
          </h3>
          <p className="text-2xl font-bold">
            0
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-sm text-gray-500 mb-2">
            Total Articles
          </h3>
          <p className="text-2xl font-bold">
            0
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-sm text-gray-500 mb-2">
            Last Update
          </h3>
          <p className="text-2xl font-bold">
            -
          </p>
        </div>

      </div>
    </div>
  )
}
