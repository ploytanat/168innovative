'use client'

import { useState, useTransition } from 'react'
import { Save, Plus, Trash2, Edit, X, Check } from 'lucide-react'
import FormSection from '@/app/admin/_components/FormSection'
import StatusToggle from '@/app/admin/_components/StatusToggle'
import { upsertCompanyProfile, upsertContactMethod, deleteContactMethod, upsertGalleryImage, deleteGalleryImage } from '@/app/admin/actions/company'

type Tab = 'profile' | 'contacts' | 'gallery'

const inputClass = 'w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500'

export default function CompanyClient({ profile: initProfile, contacts: initContacts, gallery: initGallery }: {
  profile: Record<string, unknown> | null
  contacts: Record<string, unknown>[]
  gallery: Record<string, unknown>[]
}) {
  const [tab, setTab] = useState<Tab>('profile')
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [contacts, setContacts] = useState(initContacts)
  const [gallery, setGallery] = useState(initGallery)
  const [editingContact, setEditingContact] = useState<Record<string, unknown> | null>(null)
  const [editingGallery, setEditingGallery] = useState<Record<string, unknown> | null>(null)

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(''); setSuccess('')
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await upsertCompanyProfile(fd)
      if (res.success) { setSuccess('Profile saved!'); setTimeout(() => setSuccess(''), 3000) }
      else setError(res.error ?? 'Error')
    })
  }

  const saveContact = () => {
    if (!editingContact || !initProfile?.id) return
    startTransition(async () => {
      const id = editingContact.id ? Number(editingContact.id) : null
      await upsertContactMethod(id, Number(initProfile.id), editingContact)
      if (!id) setContacts(c => [...c, editingContact])
      else setContacts(c => c.map(x => x.id === editingContact.id ? editingContact : x))
      setEditingContact(null)
    })
  }

  const removeContact = (id: unknown) => {
    if (!confirm('Delete this contact method?')) return
    startTransition(async () => {
      await deleteContactMethod(Number(id))
      setContacts(c => c.filter(x => x.id !== id))
    })
  }

  const saveGalleryItem = () => {
    if (!editingGallery || !initProfile?.id) return
    startTransition(async () => {
      const id = editingGallery.id ? Number(editingGallery.id) : null
      await upsertGalleryImage(id, Number(initProfile.id), {
        image_url: String(editingGallery.image_url ?? ''),
        alt_th: String(editingGallery.alt_th ?? ''),
        alt_en: String(editingGallery.alt_en ?? ''),
        sort_order: Number(editingGallery.sort_order ?? 0),
        is_published: !!editingGallery.is_published,
      })
      if (!id) setGallery(g => [...g, editingGallery])
      else setGallery(g => g.map(x => x.id === editingGallery.id ? editingGallery : x))
      setEditingGallery(null)
    })
  }

  const removeGallery = (id: unknown) => {
    if (!confirm('Delete this image?')) return
    startTransition(async () => {
      await deleteGalleryImage(Number(id))
      setGallery(g => g.filter(x => x.id !== id))
    })
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'profile', label: 'Profile' },
    { key: 'contacts', label: 'Contact Methods' },
    { key: 'gallery', label: 'Gallery' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex gap-1 bg-gray-800 rounded-xl p-1 w-fit">
        {TABS.map(t => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">{error}</div>}
      {success && <div className="bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 rounded-lg text-sm">{success}</div>}

      {tab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="space-y-5">
          {!!initProfile?.id && <input type="hidden" name="id" value={String(initProfile.id)} />}
          <FormSection title="Legal Information">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs text-gray-400 mb-1">Legal Name (TH)</label><input type="text" name="legal_name_th" defaultValue={String(initProfile?.legal_name_th ?? '')} className={inputClass} /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Legal Name (EN)</label><input type="text" name="legal_name_en" defaultValue={String(initProfile?.legal_name_en ?? '')} className={inputClass} /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Short Name</label><input type="text" name="short_name" defaultValue={String(initProfile?.short_name ?? '')} className={inputClass} /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Founded Year</label><input type="number" name="founded_year" defaultValue={String(initProfile?.founded_year ?? '')} className={inputClass} /></div>
            </div>
          </FormSection>
          <FormSection title="Tagline & Description">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs text-gray-400 mb-1">Tagline (TH)</label><input type="text" name="tagline_th" defaultValue={String(initProfile?.tagline_th ?? '')} className={inputClass} /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Tagline (EN)</label><input type="text" name="tagline_en" defaultValue={String(initProfile?.tagline_en ?? '')} className={inputClass} /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Description (TH)</label><textarea name="description_th" defaultValue={String(initProfile?.description_th ?? '')} rows={4} className={`${inputClass} resize-none`} /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Description (EN)</label><textarea name="description_en" defaultValue={String(initProfile?.description_en ?? '')} rows={4} className={`${inputClass} resize-none`} /></div>
            </div>
          </FormSection>
          <FormSection title="Branding">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs text-gray-400 mb-1">Logo URL</label><input type="text" name="logo_url" defaultValue={String(initProfile?.logo_url ?? '')} className={inputClass} /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Favicon URL</label><input type="text" name="favicon_url" defaultValue={String(initProfile?.favicon_url ?? '')} className={inputClass} /></div>
            </div>
          </FormSection>
          <FormSection title="Address">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs text-gray-400 mb-1">Address (TH)</label><textarea name="address_th" defaultValue={String(initProfile?.address_th ?? '')} rows={3} className={`${inputClass} resize-none`} /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Address (EN)</label><textarea name="address_en" defaultValue={String(initProfile?.address_en ?? '')} rows={3} className={`${inputClass} resize-none`} /></div>
            </div>
          </FormSection>
          <FormSection title="Publishing">
            <StatusToggle name="is_published" defaultChecked={!!initProfile?.is_published} />
          </FormSection>
          <div className="flex justify-end">
            <button type="submit" disabled={isPending} className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg">
              <Save size={16} />{isPending ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      )}

      {tab === 'contacts' && (
        <div className="space-y-4">
          {!initProfile?.id && <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-lg text-sm">Save a company profile first.</div>}
          <div className="flex justify-end">
            <button onClick={() => setEditingContact({ method_type: 'phone', sort_order: contacts.length, is_published: true })}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg">
              <Plus size={15} /> Add Contact
            </button>
          </div>
          <div className="rounded-xl border border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Label (TH)</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Value</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">href</th>
                  <th className="text-right px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {contacts.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No contact methods.</td></tr>
                ) : contacts.map(c => (
                  <tr key={String(c.id)} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-gray-300 font-mono text-xs">{String(c.method_type)}</td>
                    <td className="px-4 py-3 text-gray-300">{String(c.label_th ?? '')}</td>
                    <td className="px-4 py-3 text-gray-400">{String(c.value ?? '')}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono truncate max-w-[200px]">{String(c.href ?? '')}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingContact({ ...c })} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"><Edit size={14} /></button>
                        <button onClick={() => removeContact(c.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'gallery' && (
        <div className="space-y-4">
          {!initProfile?.id && <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-lg text-sm">Save a company profile first.</div>}
          <div className="flex justify-end">
            <button onClick={() => setEditingGallery({ image_url: '', alt_th: '', alt_en: '', sort_order: gallery.length, is_published: true })}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg">
              <Plus size={15} /> Add Image
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {gallery.length === 0 ? (
              <div className="col-span-4 bg-gray-800 border border-gray-700 rounded-xl p-12 text-center"><p className="text-gray-500 text-sm">No gallery images.</p></div>
            ) : gallery.map(img => (
              <div key={String(img.id)} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={String(img.image_url)} alt="" className="w-full h-32 object-cover bg-gray-700" />
                <div className="p-3 flex items-center justify-between">
                  <p className="text-gray-400 text-xs truncate">{String(img.alt_th ?? '')}</p>
                  <div className="flex gap-1">
                    <button onClick={() => setEditingGallery({ ...img })} className="p-1 text-gray-500 hover:text-white"><Edit size={12} /></button>
                    <button onClick={() => removeGallery(img.id)} className="p-1 text-gray-500 hover:text-red-400"><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {editingContact && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Contact Method</h3>
              <button onClick={() => setEditingContact(null)}><X size={18} className="text-gray-400 hover:text-white" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-400 mb-1">Type</label>
                  <select value={String(editingContact.method_type ?? 'phone')} onChange={e => setEditingContact(c => c ? { ...c, method_type: e.target.value } : c)} className={inputClass}>
                    {['phone','email','line','facebook','instagram','youtube','website','address','whatsapp'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs text-gray-400 mb-1">Sort Order</label><input type="number" value={String(editingContact.sort_order ?? 0)} onChange={e => setEditingContact(c => c ? { ...c, sort_order: e.target.value } : c)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Label (TH)</label><input value={String(editingContact.label_th ?? '')} onChange={e => setEditingContact(c => c ? { ...c, label_th: e.target.value } : c)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Label (EN)</label><input value={String(editingContact.label_en ?? '')} onChange={e => setEditingContact(c => c ? { ...c, label_en: e.target.value } : c)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Value (display)</label><input value={String(editingContact.value ?? '')} onChange={e => setEditingContact(c => c ? { ...c, value: e.target.value } : c)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">href (link)</label><input value={String(editingContact.href ?? '')} onChange={e => setEditingContact(c => c ? { ...c, href: e.target.value } : c)} className={inputClass} /></div>
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"><input type="checkbox" checked={!!editingContact.is_published} onChange={e => setEditingContact(c => c ? { ...c, is_published: e.target.checked } : c)} />Published</label>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setEditingContact(null)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg">Cancel</button>
              <button onClick={saveContact} disabled={isPending} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg"><Check size={15} />Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {editingGallery && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Gallery Image</h3>
              <button onClick={() => setEditingGallery(null)}><X size={18} className="text-gray-400 hover:text-white" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-xs text-gray-400 mb-1">Image URL</label><input value={String(editingGallery.image_url ?? '')} onChange={e => setEditingGallery(g => g ? { ...g, image_url: e.target.value } : g)} className={inputClass} /></div>
              {!!editingGallery.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={String(editingGallery.image_url)} alt="" className="w-full h-40 object-cover rounded-lg bg-gray-700" />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-400 mb-1">Alt (TH)</label><input value={String(editingGallery.alt_th ?? '')} onChange={e => setEditingGallery(g => g ? { ...g, alt_th: e.target.value } : g)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Alt (EN)</label><input value={String(editingGallery.alt_en ?? '')} onChange={e => setEditingGallery(g => g ? { ...g, alt_en: e.target.value } : g)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Sort Order</label><input type="number" value={String(editingGallery.sort_order ?? 0)} onChange={e => setEditingGallery(g => g ? { ...g, sort_order: e.target.value } : g)} className={inputClass} /></div>
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"><input type="checkbox" checked={!!editingGallery.is_published} onChange={e => setEditingGallery(g => g ? { ...g, is_published: e.target.checked } : g)} />Published</label>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setEditingGallery(null)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg">Cancel</button>
              <button onClick={saveGalleryItem} disabled={isPending} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg"><Check size={15} />Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
