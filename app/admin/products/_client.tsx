'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Edit, Trash2, ChevronUp, ChevronDown, Package } from 'lucide-react'
import { deleteProduct, toggleProductPublished, updateProductSortOrder } from '@/app/admin/actions/products'

interface Product {
  id: unknown
  name_th: unknown
  name_en: unknown
  sku: unknown
  image_url: unknown
  category_name: unknown
  variant_count: unknown
  sort_order: unknown
  is_published: unknown
}

export default function ProductsClient({ products }: { products: Record<string, unknown>[] }) {
  const [items, setItems] = useState<Product[]>(products as unknown as Product[])
  const [, startTransition] = useTransition()

  const handleDelete = (id: unknown) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    startTransition(async () => {
      await deleteProduct(Number(id))
      setItems((prev) => prev.filter((p) => p.id !== id))
    })
  }

  const handleTogglePublished = (id: unknown, current: unknown) => {
    const next = !current
    startTransition(async () => {
      await toggleProductPublished(Number(id), next)
      setItems((prev) => prev.map((p) => p.id === id ? { ...p, is_published: next } : p))
    })
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items]
    const swapIdx = direction === 'up' ? index - 1 : index + 1
    if (swapIdx < 0 || swapIdx >= newItems.length) return
    ;[newItems[index], newItems[swapIdx]] = [newItems[swapIdx], newItems[index]]
    setItems(newItems)
    startTransition(async () => {
      await updateProductSortOrder(Number(newItems[index].id), index)
      await updateProductSortOrder(Number(newItems[swapIdx].id), swapIdx)
    })
  }

  return (
    <div className="rounded-xl border border-gray-700 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-800 border-b border-gray-700">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-12">Order</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">SKU</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Variants</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {items.map((p, idx) => (
            <tr key={String(p.id)} className="hover:bg-gray-800/30 transition-colors">
              {/* Sort controls */}
              <td className="px-4 py-3">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => handleMove(idx, 'up')} disabled={idx === 0}
                    className="text-gray-600 hover:text-gray-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                    <ChevronUp size={14} />
                  </button>
                  <button onClick={() => handleMove(idx, 'down')} disabled={idx === items.length - 1}
                    className="text-gray-600 hover:text-gray-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                    <ChevronDown size={14} />
                  </button>
                </div>
              </td>

              {/* Product */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={String(p.image_url)} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-700" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
                      <Package size={14} className="text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="text-gray-200 font-medium">{String(p.name_th)}</p>
                    <p className="text-gray-500 text-xs">{String(p.name_en ?? '')}</p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-3 text-gray-400">{String(p.category_name ?? '—')}</td>
              <td className="px-4 py-3 text-gray-400 font-mono text-xs">{String(p.sku ?? '—')}</td>
              <td className="px-4 py-3 text-gray-400">{String(p.variant_count ?? 0)}</td>

              {/* Status toggle */}
              <td className="px-4 py-3">
                <button
                  onClick={() => handleTogglePublished(p.id, p.is_published)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                    p.is_published
                      ? 'bg-green-900/40 text-green-400 hover:bg-green-900/60'
                      : 'bg-yellow-900/40 text-yellow-400 hover:bg-yellow-900/60'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {p.is_published ? 'Published' : 'Draft'}
                </button>
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    title="Edit"
                  >
                    <Edit size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                    title="Delete"
                  >
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
