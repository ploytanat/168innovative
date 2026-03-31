'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, Save, Edit, X, Check } from 'lucide-react'
import {
  upsertHeroSlide, deleteHeroSlide, upsertSlideStats, upsertSlideChips,
  upsertTickerItem, deleteTickerItem,
  upsertProcessStep, deleteProcessStep,
  upsertTestimonial, deleteTestimonial,
  upsertWhyItem, deleteWhyItem,
} from '@/app/admin/actions/homepage'

type Tab = 'hero' | 'ticker' | 'process' | 'testimonials' | 'why'

const TABS: { key: Tab; label: string }[] = [
  { key: 'hero', label: 'Hero Slides' },
  { key: 'ticker', label: 'Ticker' },
  { key: 'process', label: 'Process Steps' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'why', label: 'Why Choose Us' },
]

const inputClass = 'w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500'
const smallInput = `${inputClass} text-xs`

interface Stat { id?: unknown; metric_value?: unknown; label_th?: unknown; label_en?: unknown; sort_order?: unknown }
interface Chip { id?: unknown; label_th?: unknown; label_en?: unknown; sort_order?: unknown }
interface Slide extends Record<string, unknown> { id?: unknown; stats?: Stat[]; chips?: Chip[] }

function HeroSlideEditor({ slide, onSave, onDelete }: { slide: Slide; onSave: (s: Slide) => void; onDelete: () => void }) {
  const [data, setData] = useState<Slide>(slide)
  const [isPending, startTransition] = useTransition()
  const [subTab, setSubTab] = useState<'fields' | 'stats' | 'chips'>('fields')

  const upd = (k: string, v: unknown) => setData(d => ({ ...d, [k]: v }))

  const handleSave = () => {
    startTransition(async () => {
      const fd = new FormData()
      Object.entries(data).forEach(([k, v]) => { if (typeof v !== 'object') fd.set(k, String(v ?? '')) })
      await upsertHeroSlide(data.id ? Number(data.id) : null, fd)
      if (data.id) {
        const stats = (data.stats ?? []) as Stat[]
        const chips = (data.chips ?? []) as Chip[]
        await upsertSlideStats(Number(data.id), stats.map((s, i) => ({ metric_value: String(s.metric_value ?? ''), label_th: String(s.label_th ?? ''), label_en: String(s.label_en ?? ''), sort_order: i })))
        await upsertSlideChips(Number(data.id), chips.map((c, i) => ({ label_th: String(c.label_th ?? ''), label_en: String(c.label_en ?? ''), sort_order: i })))
      }
      onSave(data)
    })
  }

  const addStat = () => setData(d => ({ ...d, stats: [...(d.stats ?? []), { metric_value: '', label_th: '', label_en: '', sort_order: d.stats?.length ?? 0 }] }))
  const removeStat = (i: number) => setData(d => ({ ...d, stats: (d.stats ?? []).filter((_, j) => j !== i) }))
  const updStat = (i: number, k: keyof Stat, v: string) => setData(d => ({ ...d, stats: (d.stats ?? []).map((s, j) => j === i ? { ...s, [k]: v } : s) }))

  const addChip = () => setData(d => ({ ...d, chips: [...(d.chips ?? []), { label_th: '', label_en: '', sort_order: d.chips?.length ?? 0 }] }))
  const removeChip = (i: number) => setData(d => ({ ...d, chips: (d.chips ?? []).filter((_, j) => j !== i) }))
  const updChip = (i: number, k: keyof Chip, v: string) => setData(d => ({ ...d, chips: (d.chips ?? []).map((c, j) => j === i ? { ...c, [k]: v } : c) }))

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-gray-900/50 border-b border-gray-700">
        <div className="flex gap-2">
          {(['fields', 'stats', 'chips'] as const).map(t => (
            <button key={t} type="button" onClick={() => setSubTab(t)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${subTab === t ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={isPending} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg">
            <Save size={12} />{isPending ? 'Saving...' : 'Save Slide'}
          </button>
          <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="p-5">
        {subTab === 'fields' && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Theme</label>
                <select value={String(data.theme ?? 'sky')} onChange={e => upd('theme', e.target.value)} className={inputClass}>
                  {['rose', 'sky', 'violet', 'emerald'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Badge Variant</label>
                <select value={String(data.badge_variant ?? 'new')} onChange={e => upd('badge_variant', e.target.value)} className={inputClass}>
                  {['hot', 'new', 'promo', 'featured'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Sort Order</label>
                <input type="number" value={String(data.sort_order ?? 0)} onChange={e => upd('sort_order', e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Badge Text (TH)</label>
                <input value={String(data.badge_text_th ?? '')} onChange={e => upd('badge_text_th', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Badge Text (EN)</label>
                <input value={String(data.badge_text_en ?? '')} onChange={e => upd('badge_text_en', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Title (TH)</label>
                <input value={String(data.title_th ?? '')} onChange={e => upd('title_th', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Title (EN)</label>
                <input value={String(data.title_en ?? '')} onChange={e => upd('title_en', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Description (TH)</label>
                <textarea value={String(data.description_th ?? '')} onChange={e => upd('description_th', e.target.value)} rows={2} className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Description (EN)</label>
                <textarea value={String(data.description_en ?? '')} onChange={e => upd('description_en', e.target.value)} rows={2} className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Image URL</label>
                <input value={String(data.image_url ?? '')} onChange={e => upd('image_url', e.target.value)} className={inputClass} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">CTA Primary href</label>
                <input value={String(data.cta_primary_href ?? '')} onChange={e => upd('cta_primary_href', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">CTA Primary Label (TH)</label>
                <input value={String(data.cta_primary_label_th ?? '')} onChange={e => upd('cta_primary_label_th', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">CTA Primary Label (EN)</label>
                <input value={String(data.cta_primary_label_en ?? '')} onChange={e => upd('cta_primary_label_en', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">CTA Secondary Label (TH)</label>
                <input value={String(data.cta_secondary_label_th ?? '')} onChange={e => upd('cta_secondary_label_th', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">CTA Secondary href</label>
                <input value={String(data.cta_secondary_href ?? '')} onChange={e => upd('cta_secondary_href', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Highlight Value</label>
                <input value={String(data.highlight_value ?? '')} onChange={e => upd('highlight_value', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Highlight Label (TH)</label>
                <input value={String(data.highlight_label_th ?? '')} onChange={e => upd('highlight_label_th', e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                <input type="checkbox" checked={!!data.is_published} onChange={e => upd('is_published', e.target.checked)} />
                Published
              </label>
            </div>
          </div>
        )}

        {subTab === 'stats' && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button type="button" onClick={addStat} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                <Plus size={12} /> Add Stat
              </button>
            </div>
            {(data.stats ?? []).map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input placeholder="Value" value={String(s.metric_value ?? '')} onChange={e => updStat(i, 'metric_value', e.target.value)} className={`${smallInput} w-24`} />
                <input placeholder="Label TH" value={String(s.label_th ?? '')} onChange={e => updStat(i, 'label_th', e.target.value)} className={smallInput} />
                <input placeholder="Label EN" value={String(s.label_en ?? '')} onChange={e => updStat(i, 'label_en', e.target.value)} className={smallInput} />
                <button type="button" onClick={() => removeStat(i)} className="text-gray-500 hover:text-red-400"><X size={14} /></button>
              </div>
            ))}
          </div>
        )}

        {subTab === 'chips' && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button type="button" onClick={addChip} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                <Plus size={12} /> Add Chip
              </button>
            </div>
            {(data.chips ?? []).map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input placeholder="Label TH" value={String(c.label_th ?? '')} onChange={e => updChip(i, 'label_th', e.target.value)} className={smallInput} />
                <input placeholder="Label EN" value={String(c.label_en ?? '')} onChange={e => updChip(i, 'label_en', e.target.value)} className={smallInput} />
                <button type="button" onClick={() => removeChip(i)} className="text-gray-500 hover:text-red-400"><X size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function HomepageClient({
  slides: initSlides,
  ticker: initTicker,
  steps: initSteps,
  testimonials: initTestimonials,
  whyItems: initWhy,
}: {
  slides: Record<string, unknown>[]
  ticker: Record<string, unknown>[]
  steps: Record<string, unknown>[]
  testimonials: Record<string, unknown>[]
  whyItems: Record<string, unknown>[]
}) {
  const [tab, setTab] = useState<Tab>('hero')
  const [slides, setSlides] = useState<Slide[]>(initSlides as Slide[])
  const [ticker, setTicker] = useState(initTicker)
  const [steps, setSteps] = useState(initSteps)
  const [testimonials, setTestimonials] = useState(initTestimonials)
  const [whyItems, setWhyItems] = useState(initWhy)
  const [, startTransition] = useTransition()
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null)
  const [editingType, setEditingType] = useState<'ticker' | 'step' | 'testimonial' | 'why' | null>(null)

  const addSlide = () => setSlides(s => [...s, { theme: 'sky', sort_order: s.length, is_published: true, stats: [], chips: [] }])
  const removeSlide = (i: number) => {
    const sl = slides[i]
    if (sl.id) startTransition(async () => { await deleteHeroSlide(Number(sl.id)) })
    setSlides(s => s.filter((_, j) => j !== i))
  }

  // Generic item editor modal
  const openEdit = (item: Record<string, unknown>, type: typeof editingType) => { setEditingItem({ ...item }); setEditingType(type) }
  const closeEdit = () => { setEditingItem(null); setEditingType(null) }

  const saveItem = () => {
    if (!editingItem || !editingType) return
    startTransition(async () => {
      const id = editingItem.id ? Number(editingItem.id) : null
      if (editingType === 'ticker') {
        await upsertTickerItem(id, { label_th: String(editingItem.label_th ?? ''), label_en: String(editingItem.label_en ?? ''), sort_order: Number(editingItem.sort_order ?? 0), is_published: !!editingItem.is_published })
        setTicker(t => id ? t.map(x => x.id === editingItem.id ? editingItem : x) : [...t, editingItem])
      } else if (editingType === 'step') {
        await upsertProcessStep(id, { icon_name: String(editingItem.icon_name ?? ''), title_th: String(editingItem.title_th ?? ''), title_en: String(editingItem.title_en ?? ''), description_th: String(editingItem.description_th ?? ''), description_en: String(editingItem.description_en ?? ''), sort_order: Number(editingItem.sort_order ?? 0), is_published: !!editingItem.is_published })
        setSteps(s => id ? s.map(x => x.id === editingItem.id ? editingItem : x) : [...s, editingItem])
      } else if (editingType === 'testimonial') {
        await upsertTestimonial(id, editingItem)
        setTestimonials(t => id ? t.map(x => x.id === editingItem.id ? editingItem : x) : [...t, editingItem])
      } else if (editingType === 'why') {
        await upsertWhyItem(id, editingItem)
        setWhyItems(w => id ? w.map(x => x.id === editingItem.id ? editingItem : x) : [...w, editingItem])
      }
      closeEdit()
    })
  }

  const deleteItem = (id: unknown, type: typeof editingType) => {
    if (!confirm('Delete this item?')) return
    startTransition(async () => {
      if (type === 'ticker') { await deleteTickerItem(Number(id)); setTicker(t => t.filter(x => x.id !== id)) }
      else if (type === 'step') { await deleteProcessStep(Number(id)); setSteps(s => s.filter(x => x.id !== id)) }
      else if (type === 'testimonial') { await deleteTestimonial(Number(id)); setTestimonials(t => t.filter(x => x.id !== id)) }
      else if (type === 'why') { await deleteWhyItem(Number(id)); setWhyItems(w => w.filter(x => x.id !== id)) }
    })
  }

  const upd = (k: string, v: unknown) => setEditingItem(e => e ? { ...e, [k]: v } : e)

  return (
    <div className="space-y-6">
      {/* Tab Bar */}
      <div className="flex gap-1 bg-gray-800 rounded-xl p-1 w-fit">
        {TABS.map(t => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Hero Slides ── */}
      {tab === 'hero' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={addSlide} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg">
              <Plus size={15} /> Add Slide
            </button>
          </div>
          {slides.length === 0 && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center"><p className="text-gray-500 text-sm">No slides yet.</p></div>
          )}
          {slides.map((sl, i) => (
            <HeroSlideEditor key={i} slide={sl} onSave={(updated) => setSlides(s => s.map((x, j) => j === i ? updated : x))} onDelete={() => removeSlide(i)} />
          ))}
        </div>
      )}

      {/* ── Ticker ── */}
      {tab === 'ticker' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => openEdit({ label_th: '', label_en: '', sort_order: ticker.length, is_published: true }, 'ticker')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg">
              <Plus size={15} /> Add Ticker Item
            </button>
          </div>
          <div className="rounded-xl border border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Label (TH)</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Label (EN)</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Order</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {ticker.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No ticker items.</td></tr>
                ) : ticker.map(item => (
                  <tr key={String(item.id)} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-gray-300">{String(item.label_th)}</td>
                    <td className="px-4 py-3 text-gray-400">{String(item.label_en ?? '')}</td>
                    <td className="px-4 py-3 text-gray-400">{String(item.sort_order ?? 0)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${item.is_published ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />{item.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(item, 'ticker')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"><Edit size={14} /></button>
                        <button onClick={() => deleteItem(item.id, 'ticker')} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Process Steps ── */}
      {tab === 'process' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => openEdit({ icon_name: '', title_th: '', title_en: '', description_th: '', description_en: '', sort_order: steps.length, is_published: true }, 'step')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg">
              <Plus size={15} /> Add Step
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {steps.length === 0 ? (
              <div className="col-span-2 bg-gray-800 border border-gray-700 rounded-xl p-12 text-center"><p className="text-gray-500 text-sm">No process steps.</p></div>
            ) : steps.map((step, i) => (
              <div key={String(step.id)} className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-900/40 flex items-center justify-center text-blue-400 text-sm font-bold shrink-0">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-200 font-medium text-sm">{String(step.title_th)}</p>
                  <p className="text-gray-500 text-xs mt-0.5 truncate">{String(step.title_en ?? '')}</p>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-2">{String(step.description_th ?? '')}</p>
                  <p className="text-gray-500 text-xs mt-0.5">Icon: {String(step.icon_name ?? '—')}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(step, 'step')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"><Edit size={14} /></button>
                  <button onClick={() => deleteItem(step.id, 'step')} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Testimonials ── */}
      {tab === 'testimonials' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => openEdit({ page_key: 'home', avatar_type: 'emoji', rating: 5, sort_order: testimonials.length, is_published: true }, 'testimonial')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg">
              <Plus size={15} /> Add Testimonial
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {testimonials.length === 0 ? (
              <div className="col-span-2 bg-gray-800 border border-gray-700 rounded-xl p-12 text-center"><p className="text-gray-500 text-sm">No testimonials.</p></div>
            ) : testimonials.map(t => (
              <div key={String(t.id)} className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg">
                      {t.avatar_type === 'emoji' ? String(t.avatar_emoji ?? '👤') : '👤'}
                    </div>
                    <div>
                      <p className="text-gray-200 font-medium text-sm">{String(t.person_name ?? '')}</p>
                      <p className="text-gray-500 text-xs">{String(t.role_th ?? '')} · {String(t.company_name_th ?? '')}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(t, 'testimonial')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"><Edit size={14} /></button>
                    <button onClick={() => deleteItem(t.id, 'testimonial')} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-3 line-clamp-3 italic">&ldquo;{String(t.quote_th ?? '')}&rdquo;</p>
                <div className="flex items-center gap-1 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-xs ${i < Number(t.rating ?? 5) ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Why Items ── */}
      {tab === 'why' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => openEdit({ page_key: 'home', section_key: 'main', sort_order: whyItems.length, is_published: true }, 'why')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg">
              <Plus size={15} /> Add Item
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {whyItems.length === 0 ? (
              <div className="col-span-3 bg-gray-800 border border-gray-700 rounded-xl p-12 text-center"><p className="text-gray-500 text-sm">No why items.</p></div>
            ) : whyItems.map(item => (
              <div key={String(item.id)} className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                {!!item.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={String(item.image_url)} alt="" className="w-full h-24 object-cover rounded-lg mb-3 bg-gray-700" />
                )}
                <p className="text-gray-200 font-medium text-sm">{String(item.title_th ?? '')}</p>
                <p className="text-gray-500 text-xs mt-0.5">{String(item.title_en ?? '')}</p>
                <p className="text-gray-400 text-xs mt-2 line-clamp-2">{String(item.description_th ?? '')}</p>
                <div className="flex justify-end gap-1 mt-3">
                  <button onClick={() => openEdit(item, 'why')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"><Edit size={14} /></button>
                  <button onClick={() => deleteItem(item.id, 'why')} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editingItem && editingType && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h3 className="text-white font-semibold capitalize">{editingType === 'step' ? 'Process Step' : editingType.charAt(0).toUpperCase() + editingType.slice(1)}</h3>
              <button onClick={closeEdit} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {editingType === 'ticker' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs text-gray-400 mb-1">Label (TH)</label><input value={String(editingItem.label_th ?? '')} onChange={e => upd('label_th', e.target.value)} className={inputClass} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Label (EN)</label><input value={String(editingItem.label_en ?? '')} onChange={e => upd('label_en', e.target.value)} className={inputClass} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs text-gray-400 mb-1">Sort Order</label><input type="number" value={String(editingItem.sort_order ?? 0)} onChange={e => upd('sort_order', e.target.value)} className={inputClass} /></div>
                    <div className="flex items-end pb-1"><label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"><input type="checkbox" checked={!!editingItem.is_published} onChange={e => upd('is_published', e.target.checked)} />Published</label></div>
                  </div>
                </>
              )}
              {editingType === 'step' && (
                <>
                  <div><label className="block text-xs text-gray-400 mb-1">Icon Name (Lucide)</label><input value={String(editingItem.icon_name ?? '')} onChange={e => upd('icon_name', e.target.value)} className={inputClass} placeholder="e.g. Zap" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs text-gray-400 mb-1">Title (TH)</label><input value={String(editingItem.title_th ?? '')} onChange={e => upd('title_th', e.target.value)} className={inputClass} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Title (EN)</label><input value={String(editingItem.title_en ?? '')} onChange={e => upd('title_en', e.target.value)} className={inputClass} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Description (TH)</label><textarea value={String(editingItem.description_th ?? '')} onChange={e => upd('description_th', e.target.value)} rows={3} className={`${inputClass} resize-none`} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Description (EN)</label><textarea value={String(editingItem.description_en ?? '')} onChange={e => upd('description_en', e.target.value)} rows={3} className={`${inputClass} resize-none`} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs text-gray-400 mb-1">Sort Order</label><input type="number" value={String(editingItem.sort_order ?? 0)} onChange={e => upd('sort_order', e.target.value)} className={inputClass} /></div>
                    <div className="flex items-end pb-1"><label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"><input type="checkbox" checked={!!editingItem.is_published} onChange={e => upd('is_published', e.target.checked)} />Published</label></div>
                  </div>
                </>
              )}
              {editingType === 'testimonial' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs text-gray-400 mb-1">Page Key</label><input value={String(editingItem.page_key ?? 'home')} onChange={e => upd('page_key', e.target.value)} className={inputClass} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Person Name</label><input value={String(editingItem.person_name ?? '')} onChange={e => upd('person_name', e.target.value)} className={inputClass} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Role (TH)</label><input value={String(editingItem.role_th ?? '')} onChange={e => upd('role_th', e.target.value)} className={inputClass} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Role (EN)</label><input value={String(editingItem.role_en ?? '')} onChange={e => upd('role_en', e.target.value)} className={inputClass} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Company (TH)</label><input value={String(editingItem.company_name_th ?? '')} onChange={e => upd('company_name_th', e.target.value)} className={inputClass} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Company (EN)</label><input value={String(editingItem.company_name_en ?? '')} onChange={e => upd('company_name_en', e.target.value)} className={inputClass} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Quote (TH)</label><textarea value={String(editingItem.quote_th ?? '')} onChange={e => upd('quote_th', e.target.value)} rows={3} className={`${inputClass} resize-none`} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Quote (EN)</label><textarea value={String(editingItem.quote_en ?? '')} onChange={e => upd('quote_en', e.target.value)} rows={3} className={`${inputClass} resize-none`} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Avatar Type</label>
                      <select value={String(editingItem.avatar_type ?? 'emoji')} onChange={e => upd('avatar_type', e.target.value)} className={inputClass}>
                        <option value="emoji">Emoji</option><option value="image">Image</option>
                      </select>
                    </div>
                    <div><label className="block text-xs text-gray-400 mb-1">{editingItem.avatar_type === 'image' ? 'Avatar URL' : 'Avatar Emoji'}</label>
                      <input value={String(editingItem.avatar_type === 'image' ? editingItem.avatar_url ?? '' : editingItem.avatar_emoji ?? '')} onChange={e => upd(editingItem.avatar_type === 'image' ? 'avatar_url' : 'avatar_emoji', e.target.value)} className={inputClass} />
                    </div>
                    <div><label className="block text-xs text-gray-400 mb-1">Rating (1-5)</label><input type="number" min={1} max={5} value={String(editingItem.rating ?? 5)} onChange={e => upd('rating', e.target.value)} className={inputClass} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Sort Order</label><input type="number" value={String(editingItem.sort_order ?? 0)} onChange={e => upd('sort_order', e.target.value)} className={inputClass} /></div>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"><input type="checkbox" checked={!!editingItem.is_featured} onChange={e => upd('is_featured', e.target.checked)} />Featured</label>
                    <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"><input type="checkbox" checked={!!editingItem.is_published} onChange={e => upd('is_published', e.target.checked)} />Published</label>
                  </div>
                </>
              )}
              {editingType === 'why' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs text-gray-400 mb-1">Page Key</label><input value={String(editingItem.page_key ?? 'home')} onChange={e => upd('page_key', e.target.value)} className={inputClass} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Section Key</label><input value={String(editingItem.section_key ?? 'main')} onChange={e => upd('section_key', e.target.value)} className={inputClass} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Icon Name</label><input value={String(editingItem.icon_name ?? '')} onChange={e => upd('icon_name', e.target.value)} className={inputClass} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Image URL</label><input value={String(editingItem.image_url ?? '')} onChange={e => upd('image_url', e.target.value)} className={inputClass} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Title (TH)</label><input value={String(editingItem.title_th ?? '')} onChange={e => upd('title_th', e.target.value)} className={inputClass} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Title (EN)</label><input value={String(editingItem.title_en ?? '')} onChange={e => upd('title_en', e.target.value)} className={inputClass} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Description (TH)</label><textarea value={String(editingItem.description_th ?? '')} onChange={e => upd('description_th', e.target.value)} rows={3} className={`${inputClass} resize-none`} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Description (EN)</label><textarea value={String(editingItem.description_en ?? '')} onChange={e => upd('description_en', e.target.value)} rows={3} className={`${inputClass} resize-none`} /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">Sort Order</label><input type="number" value={String(editingItem.sort_order ?? 0)} onChange={e => upd('sort_order', e.target.value)} className={inputClass} /></div>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"><input type="checkbox" checked={!!editingItem.is_published} onChange={e => upd('is_published', e.target.checked)} />Published</label>
                </>
              )}
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={closeEdit} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg">Cancel</button>
              <button onClick={saveItem} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg">
                <Check size={15} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
