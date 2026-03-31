'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Edit, Trash2, FileText } from 'lucide-react'
import { deleteArticle } from '@/app/admin/actions/articles'

export default function ArticlesClient({ articles }: { articles: Record<string, unknown>[] }) {
  const [items, setItems] = useState(articles)
  const [, startTransition] = useTransition()

  const handleDelete = (id: unknown) => {
    if (!confirm('Delete this article?')) return
    startTransition(async () => {
      await deleteArticle(Number(id))
      setItems((prev) => prev.filter((a) => a.id !== id))
    })
  }

  return (
    <div className="rounded-xl border border-gray-700 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-800 border-b border-gray-700">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Article</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Author</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Read Time</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Published</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {items.map((a) => (
            <tr key={String(a.id)} className="hover:bg-gray-800/30 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {a.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={String(a.cover_image_url)} alt="" className="w-12 h-8 rounded object-cover bg-gray-700" />
                  ) : (
                    <div className="w-12 h-8 rounded bg-gray-700 flex items-center justify-center">
                      <FileText size={12} className="text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="text-gray-200 font-medium truncate max-w-[250px]">{String(a.title_th)}</p>
                    <p className="text-gray-500 text-xs truncate max-w-[250px]">{String(a.title_en ?? '')}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-400 text-xs">{String(a.author_name ?? '—')}</td>
              <td className="px-4 py-3 text-gray-400 text-xs">{a.reading_time_minutes ? `${a.reading_time_minutes} min` : '—'}</td>
              <td className="px-4 py-3 text-gray-400 text-xs">{a.published_at ? new Date(String(a.published_at)).toLocaleDateString('th-TH') : '—'}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  a.is_published ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {a.is_published ? 'Published' : 'Draft'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/articles/${a.id}`} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                    <Edit size={15} />
                  </Link>
                  <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors">
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
