'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'
import { deleteCategory } from '@/app/admin/actions/categories'

export default function CategoriesClient({ categories }: { categories: Record<string, unknown>[] }) {
  const [items, setItems] = useState(categories)
  const [, startTransition] = useTransition()

  const handleDelete = (id: unknown) => {
    if (!confirm('Delete this category? Products in this category will lose their category assignment.')) return
    startTransition(async () => {
      await deleteCategory(Number(id))
      setItems((prev) => prev.filter((c) => c.id !== id))
    })
  }

  return (
    <div className="rounded-xl border border-gray-700 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-800 border-b border-gray-700">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Slug</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Products</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Order</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {items.map((c) => (
            <tr key={String(c.id)} className="hover:bg-gray-800/30 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {c.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={String(c.image_url)} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-700" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-700" />
                  )}
                  <div>
                    <p className="text-gray-200 font-medium">{String(c.name_th)}</p>
                    <p className="text-gray-500 text-xs">{String(c.name_en ?? '')}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-400 font-mono text-xs">{String(c.slug)}</td>
              <td className="px-4 py-3 text-gray-400">{String(c.product_count ?? 0)}</td>
              <td className="px-4 py-3 text-gray-400">{String(c.sort_order ?? 0)}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  c.is_published ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {c.is_published ? 'Published' : 'Draft'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/categories/${c.id}`} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                    <Edit size={15} />
                  </Link>
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
