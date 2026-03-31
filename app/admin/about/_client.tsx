'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, Save, Edit, X, Check } from 'lucide-react'
import { upsertAboutSection, deleteAboutSection } from '@/app/admin/actions/about'

const inputClass = 'w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500'

export default function AboutClient({ sections: initSections }: { sections: Record<string, unknown>[] }) {
  const [sections, setSections] = useState(initSections)
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null)
  const [isPending, startTransition] = useTransition()

  const upd = (k: string, v: unknown) => setEditing(e => e ? { ...e, [k]: v } : e)

  const save = () => {
    if (!editing) return
    startTransition(async () => {
      const id = editing.id ? Number(editing.id) : null
      await upsertAboutSection(id, editing)
      if (id) setSections(s => s.map(x => x.id === editing.id ? editing : x))
      else setSections(s => [...s, editing])
      setEditing(null)
    })
  }

  const remove = (id: unknown) => {
    if (!confirm('Delete this section?')) return
    startTransition(async () => {
      await deleteAboutSection(Number(id))
      setSections(s => s.filter(x => x.id !== id))
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setEditing({ section_key: '', sort_order: sections.length, is_published: true })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg">
          <Plus size={15} /> Add Section
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center"><p className="text-gray-500 text-sm">No sections yet.</p></div>
      ) : (
        <div className="space-y-3">
          {sections.map(sec => (
            <div key={String(sec.id)} className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded font-mono">{String(sec.section_key)}</span>
                  {!sec.is_published && <span className="text-xs bg-yellow-900/40 text-yellow-400 px-2 py-0.5 rounded">Draft</span>}
                </div>
                <p className="text-gray-200 font-medium">{String(sec.title_th ?? '')}</p>
                <p className="text-gray-500 text-sm">{String(sec.title_en ?? '')}</p>
                <p className="text-gray-400 text-xs mt-1 line-clamp-2">{String(sec.description_th ?? '')}</p>
                <div className="flex gap-4 mt-2">
                  {!!sec.image_primary_url && <span className="text-xs text-gray-500">Primary image ✓</span>}
                  {!!sec.image_secondary_url && <span className="text-xs text-gray-500">Secondary image ✓</span>}
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing({ ...sec })} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"><Edit size={14} /></button>
                <button onClick={() => remove(sec.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">About Section</h3>
              <button onClick={() => setEditing(null)}><X size={18} className="text-gray-400 hover:text-white" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-400 mb-1">Section Key</label><input value={String(editing.section_key ?? '')} onChange={e => upd('section_key', e.target.value)} className={inputClass} placeholder="e.g. hero, mission" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Sort Order</label><input type="number" value={String(editing.sort_order ?? 0)} onChange={e => upd('sort_order', e.target.value)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Eyebrow (TH)</label><input value={String(editing.eyebrow_th ?? '')} onChange={e => upd('eyebrow_th', e.target.value)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Eyebrow (EN)</label><input value={String(editing.eyebrow_en ?? '')} onChange={e => upd('eyebrow_en', e.target.value)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Title (TH)</label><input value={String(editing.title_th ?? '')} onChange={e => upd('title_th', e.target.value)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Title (EN)</label><input value={String(editing.title_en ?? '')} onChange={e => upd('title_en', e.target.value)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Description (TH)</label><textarea value={String(editing.description_th ?? '')} onChange={e => upd('description_th', e.target.value)} rows={4} className={`${inputClass} resize-none`} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Description (EN)</label><textarea value={String(editing.description_en ?? '')} onChange={e => upd('description_en', e.target.value)} rows={4} className={`${inputClass} resize-none`} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Primary Image URL</label><input value={String(editing.image_primary_url ?? '')} onChange={e => upd('image_primary_url', e.target.value)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Secondary Image URL</label><input value={String(editing.image_secondary_url ?? '')} onChange={e => upd('image_secondary_url', e.target.value)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Primary Image Alt (TH)</label><input value={String(editing.image_primary_alt_th ?? '')} onChange={e => upd('image_primary_alt_th', e.target.value)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Primary Image Alt (EN)</label><input value={String(editing.image_primary_alt_en ?? '')} onChange={e => upd('image_primary_alt_en', e.target.value)} className={inputClass} /></div>
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"><input type="checkbox" checked={!!editing.is_published} onChange={e => upd('is_published', e.target.checked)} />Published</label>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setEditing(null)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg">Cancel</button>
              <button onClick={save} disabled={isPending} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg"><Check size={15} />Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
