'use client'

import { useState, useTransition } from 'react'
import { Save, Plus, Trash2, Edit, X, Check } from 'lucide-react'
import FormSection from '@/app/admin/_components/FormSection'
import { upsertSiteSettings, upsertPageSeo, deletePageSeo } from '@/app/admin/actions/seo'

type Tab = 'site' | 'pages'

const inputClass = 'w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500'

export default function SeoClient({ settings: initSettings, pageSeo: initPageSeo }: {
  settings: Record<string, unknown> | null
  pageSeo: Record<string, unknown>[]
}) {
  const [tab, setTab] = useState<Tab>('site')
  const [pageSeo, setPageSeo] = useState(initPageSeo)
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null)
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSettingsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(''); setSuccess('')
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await upsertSiteSettings(fd)
      if (res.success) { setSuccess('Settings saved!'); setTimeout(() => setSuccess(''), 3000) }
      else setError(res.error ?? 'Error')
    })
  }

  const save = () => {
    if (!editing) return
    startTransition(async () => {
      const id = editing.id ? Number(editing.id) : null
      await upsertPageSeo(id, editing)
      if (id) setPageSeo(p => p.map(x => x.id === editing.id ? editing : x))
      else setPageSeo(p => [...p, editing])
      setEditing(null)
    })
  }

  const remove = (id: unknown) => {
    if (!confirm('Delete this page SEO entry?')) return
    startTransition(async () => {
      await deletePageSeo(Number(id))
      setPageSeo(p => p.filter(x => x.id !== id))
    })
  }

  const upd = (k: string, v: unknown) => setEditing(e => e ? { ...e, [k]: v } : e)

  return (
    <div className="space-y-6">
      <div className="flex gap-1 bg-gray-800 rounded-xl p-1 w-fit">
        {[{ key: 'site' as Tab, label: 'Site Settings' }, { key: 'pages' as Tab, label: 'Page SEO' }].map(t => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">{error}</div>}
      {success && <div className="bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 rounded-lg text-sm">{success}</div>}

      {tab === 'site' && (
        <form onSubmit={handleSettingsSubmit} className="space-y-5">
          {!!initSettings?.id && <input type="hidden" name="id" value={String(initSettings.id)} />}
          <FormSection title="Site Identity">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs text-gray-400 mb-1">Site Name (TH)</label><input type="text" name="site_name_th" defaultValue={String(initSettings?.site_name_th ?? '')} className={inputClass} /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Site Name (EN)</label><input type="text" name="site_name_en" defaultValue={String(initSettings?.site_name_en ?? '')} className={inputClass} /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Tagline (TH)</label><input type="text" name="tagline_th" defaultValue={String(initSettings?.tagline_th ?? '')} className={inputClass} /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Tagline (EN)</label><input type="text" name="tagline_en" defaultValue={String(initSettings?.tagline_en ?? '')} className={inputClass} /></div>
            </div>
          </FormSection>
          <FormSection title="Default SEO">
            <div><label className="block text-xs text-gray-400 mb-1">Default SEO Title (TH)</label><input type="text" name="default_seo_title_th" defaultValue={String(initSettings?.default_seo_title_th ?? '')} className={inputClass} /></div>
            <div><label className="block text-xs text-gray-400 mb-1">Default SEO Title (EN)</label><input type="text" name="default_seo_title_en" defaultValue={String(initSettings?.default_seo_title_en ?? '')} className={inputClass} /></div>
            <div><label className="block text-xs text-gray-400 mb-1">Default SEO Description (TH)</label><textarea name="default_seo_description_th" defaultValue={String(initSettings?.default_seo_description_th ?? '')} rows={3} className={`${inputClass} resize-none`} /></div>
            <div><label className="block text-xs text-gray-400 mb-1">Default SEO Description (EN)</label><textarea name="default_seo_description_en" defaultValue={String(initSettings?.default_seo_description_en ?? '')} rows={3} className={`${inputClass} resize-none`} /></div>
          </FormSection>
          <FormSection title="Open Graph & Assets">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs text-gray-400 mb-1">OG Image URL</label><input type="text" name="og_image_url" defaultValue={String(initSettings?.og_image_url ?? '')} className={inputClass} /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Favicon URL</label><input type="text" name="favicon_url" defaultValue={String(initSettings?.favicon_url ?? '')} className={inputClass} /></div>
            </div>
          </FormSection>
          <FormSection title="Analytics">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs text-gray-400 mb-1">Google Analytics ID</label><input type="text" name="google_analytics_id" defaultValue={String(initSettings?.google_analytics_id ?? '')} className={inputClass} placeholder="G-XXXXXXXXXX" /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Facebook Pixel ID</label><input type="text" name="facebook_pixel_id" defaultValue={String(initSettings?.facebook_pixel_id ?? '')} className={inputClass} /></div>
            </div>
          </FormSection>
          <div className="flex justify-end">
            <button type="submit" disabled={isPending} className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg">
              <Save size={16} />{isPending ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      )}

      {tab === 'pages' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setEditing({ locale: 'th', is_published: true })}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg">
              <Plus size={15} /> Add Page SEO
            </button>
          </div>
          <div className="rounded-xl border border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Page Key</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Locale</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Description</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
                  <th className="text-right px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {pageSeo.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No page SEO entries.</td></tr>
                ) : pageSeo.map(p => (
                  <tr key={String(p.id)} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3 font-mono text-xs text-blue-300">{String(p.page_key ?? '')}</td>
                    <td className="px-4 py-3 text-gray-400 uppercase text-xs font-semibold">{String(p.locale)}</td>
                    <td className="px-4 py-3 text-gray-300 truncate max-w-[200px]">{String(p.title ?? '')}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs truncate max-w-[250px]">{String(p.description ?? '')}</td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${p.is_published ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}><span className="w-1.5 h-1.5 rounded-full bg-current" />{p.is_published ? 'On' : 'Off'}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditing({ ...p })} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"><Edit size={14} /></button>
                        <button onClick={() => remove(p.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Page SEO</h3>
              <button onClick={() => setEditing(null)}><X size={18} className="text-gray-400 hover:text-white" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-400 mb-1">Page Key</label><input value={String(editing.page_key ?? '')} onChange={e => upd('page_key', e.target.value)} className={inputClass} placeholder="e.g. home, about, contact" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Locale</label>
                  <select value={String(editing.locale ?? 'th')} onChange={e => upd('locale', e.target.value)} className={inputClass}>
                    <option value="th">TH</option><option value="en">EN</option>
                  </select>
                </div>
                <div className="col-span-2"><label className="block text-xs text-gray-400 mb-1">Title</label><input value={String(editing.title ?? '')} onChange={e => upd('title', e.target.value)} className={inputClass} /></div>
                <div className="col-span-2"><label className="block text-xs text-gray-400 mb-1">Description</label><textarea value={String(editing.description ?? '')} onChange={e => upd('description', e.target.value)} rows={3} className={`${inputClass} resize-none`} /></div>
                <div className="col-span-2"><label className="block text-xs text-gray-400 mb-1">Keywords</label><input value={String(editing.keywords ?? '')} onChange={e => upd('keywords', e.target.value)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">OG Title</label><input value={String(editing.og_title ?? '')} onChange={e => upd('og_title', e.target.value)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">OG Description</label><input value={String(editing.og_description ?? '')} onChange={e => upd('og_description', e.target.value)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">OG Image URL</label><input value={String(editing.og_image_url ?? '')} onChange={e => upd('og_image_url', e.target.value)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Canonical URL</label><input value={String(editing.canonical_url ?? '')} onChange={e => upd('canonical_url', e.target.value)} className={inputClass} /></div>
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"><input type="checkbox" checked={!!editing.is_published} onChange={e => upd('is_published', e.target.checked)} />Active</label>
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
