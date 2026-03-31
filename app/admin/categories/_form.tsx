'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'
import BilingualField from '@/app/admin/_components/BilingualField'
import ImageField from '@/app/admin/_components/ImageField'
import StatusToggle from '@/app/admin/_components/StatusToggle'
import FormSection from '@/app/admin/_components/FormSection'
import { createCategory, updateCategory, upsertCategoryFaq, deleteCategoryFaq } from '@/app/admin/actions/categories'

type Tab = 'basic' | 'seo' | 'faqs'

interface Faq {
  id?: unknown; question_th?: unknown; question_en?: unknown
  answer_th?: unknown; answer_en?: unknown; sort_order?: unknown; is_published?: unknown
}

export default function CategoryForm({ category }: { category?: Record<string, unknown> }) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('basic')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [slug, setSlug] = useState(String(category?.slug ?? ''))
  const [faqs, setFaqs] = useState<Faq[]>((category?.faqs as Faq[]) ?? [])

  const isEdit = !!category?.id
  const inputClass = 'w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500'

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(''); setSuccess('')
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      let result
      if (isEdit) {
        result = await updateCategory(Number(category.id), fd)
      } else {
        result = await createCategory(fd)
        if (result.success && result.id) { router.push(`/admin/categories/${result.id}`); return }
      }
      if (result.success) { setSuccess('Saved!'); setTimeout(() => setSuccess(''), 3000) }
      else setError(result.error ?? 'Error')
    })
  }

  const slugify = (t: string) => t.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')

  // FAQ helpers
  const addFaq = () => setFaqs(f => [...f, { question_th: '', question_en: '', answer_th: '', answer_en: '', sort_order: f.length, is_published: true }])
  const removeFaq = (i: number) => {
    const fq = faqs[i]
    if (fq.id) startTransition(async () => { await deleteCategoryFaq(Number(fq.id)) })
    setFaqs(f => f.filter((_, j) => j !== i))
  }
  const updateFaq = (i: number, field: keyof Faq, val: unknown) => setFaqs(f => f.map((fq, j) => j === i ? { ...fq, [field]: val } : fq))
  const saveFaq = (i: number) => {
    const fq = faqs[i]; const ownerId = category ? Number(category.id) : 0
    if (!ownerId) return
    startTransition(async () => {
      const res = await upsertCategoryFaq(fq.id ? Number(fq.id) : null, ownerId, {
        question_th: String(fq.question_th ?? ''), question_en: String(fq.question_en ?? ''),
        answer_th: String(fq.answer_th ?? ''), answer_en: String(fq.answer_en ?? ''),
        sort_order: Number(fq.sort_order ?? i), is_published: !!fq.is_published,
      })
      if (!res.success) setError(res.error ?? 'Error')
    })
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'seo', label: 'SEO' },
    { key: 'faqs', label: 'FAQs' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/categories" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{isEdit ? String(category.name_th) : 'New Category'}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{isEdit ? `ID: ${category.id}` : 'Create a new category'}</p>
          </div>
        </div>
        <button form="cat-form" type="submit" disabled={isPending}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
          <Save size={16} />{isPending ? 'Saving...' : 'Save Category'}
        </button>
      </div>

      {error && <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">{error}</div>}
      {success && <div className="bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 rounded-lg text-sm">{success}</div>}

      <div className="flex gap-1 bg-gray-800 rounded-xl p-1 w-fit">
        {TABS.map(t => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <form id="cat-form" onSubmit={handleSubmit}>
        {tab === 'basic' && (
          <div className="space-y-5">
            <FormSection title="Identity">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Name (TH)</label>
                  <input type="text" name="name_th" defaultValue={String(category?.name_th ?? '')}
                    onBlur={e => { if (!slug) setSlug(slugify(e.target.value)) }}
                    className={inputClass} required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Name (EN)</label>
                  <input type="text" name="name_en" defaultValue={String(category?.name_en ?? '')} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Slug</label>
                <input type="text" name="slug" value={slug} onChange={e => setSlug(e.target.value)} className={inputClass} required />
              </div>
            </FormSection>

            <FormSection title="Description">
              <BilingualField name="description" type="textarea"
                valueTh={String(category?.description_th ?? '')} valueEn={String(category?.description_en ?? '')} />
            </FormSection>

            <FormSection title="Intro HTML" description="Full intro HTML shown at top of category page.">
              <BilingualField name="intro_html" type="richtext"
                valueTh={String(category?.intro_html_th ?? '')} valueEn={String(category?.intro_html_en ?? '')} />
            </FormSection>

            <FormSection title="Image">
              <ImageField name="image_url" value={String(category?.image_url ?? '')}
                altNameTh="image_alt_th" altNameEn="image_alt_en"
                altValueTh={String(category?.image_alt_th ?? '')} altValueEn={String(category?.image_alt_en ?? '')} />
            </FormSection>

            <FormSection title="Publishing">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Sort Order</label>
                  <input type="number" name="sort_order" defaultValue={String(category?.sort_order ?? 0)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Published</label>
                  <StatusToggle defaultChecked={!!category?.is_published} />
                </div>
              </div>
            </FormSection>
          </div>
        )}

        {tab === 'seo' && (
          <FormSection title="SEO Meta">
            <div>
              <label className="block text-xs text-gray-400 mb-1">SEO Title (TH)</label>
              <input type="text" name="seo_title_th" defaultValue={String(category?.seo_title_th ?? '')} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">SEO Title (EN)</label>
              <input type="text" name="seo_title_en" defaultValue={String(category?.seo_title_en ?? '')} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">SEO Description (TH)</label>
              <textarea name="seo_description_th" defaultValue={String(category?.seo_description_th ?? '')} rows={3} className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">SEO Description (EN)</label>
              <textarea name="seo_description_en" defaultValue={String(category?.seo_description_en ?? '')} rows={3} className={`${inputClass} resize-none`} />
            </div>
          </FormSection>
        )}
      </form>

      {tab === 'faqs' && (
        <div className="space-y-4">
          {!isEdit && <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-lg text-sm">Save the category first before adding FAQs.</div>}
          <div className="flex justify-end">
            <button onClick={addFaq} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg">
              <Plus size={15} /> Add FAQ
            </button>
          </div>
          {faqs.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
              <p className="text-gray-500 text-sm">No FAQs yet.</p>
            </div>
          ) : faqs.map((fq, i) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-5 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Question (TH)</label>
                  <input value={String(fq.question_th ?? '')} onChange={e => updateFaq(i, 'question_th', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Question (EN)</label>
                  <input value={String(fq.question_en ?? '')} onChange={e => updateFaq(i, 'question_en', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Answer (TH)</label>
                  <textarea value={String(fq.answer_th ?? '')} onChange={e => updateFaq(i, 'answer_th', e.target.value)} rows={3} className={`${inputClass} resize-none`} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Answer (EN)</label>
                  <textarea value={String(fq.answer_en ?? '')} onChange={e => updateFaq(i, 'answer_en', e.target.value)} rows={3} className={`${inputClass} resize-none`} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                  <input type="checkbox" checked={!!fq.is_published} onChange={e => updateFaq(i, 'is_published', e.target.checked)} />
                  Published
                </label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => saveFaq(i)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg">Save</button>
                  <button type="button" onClick={() => removeFaq(i)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
