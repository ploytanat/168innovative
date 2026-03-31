'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Trash2, Save, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import BilingualField from '@/app/admin/_components/BilingualField'
import ImageField from '@/app/admin/_components/ImageField'
import StatusToggle from '@/app/admin/_components/StatusToggle'
import FormSection from '@/app/admin/_components/FormSection'
import {
  createProduct, updateProduct,
  upsertVariant, deleteVariant,
  upsertSpec, deleteSpec,
  upsertMedia, deleteMedia,
  upsertProductFaq, deleteFaq,
  upsertVariantOption, deleteVariantOption,
} from '@/app/admin/actions/products'

type Tab = 'basic' | 'content' | 'seo' | 'variants' | 'specs' | 'media' | 'faqs'

interface Category { id: unknown; name_th: unknown }
interface Variant { id?: unknown; slug?: unknown; sku?: unknown; label_th?: unknown; label_en?: unknown; description_th?: unknown; description_en?: unknown; image_url?: unknown; availability_status?: unknown; moq?: unknown; lead_time?: unknown; is_default?: unknown; sort_order?: unknown; is_published?: unknown; options?: VariantOption[]; specs?: Spec[] }
interface Spec { id?: unknown; spec_key?: unknown; label_th?: unknown; label_en?: unknown; value_th?: unknown; value_en?: unknown; sort_order?: unknown }
interface MediaItem { id?: unknown; url?: unknown; alt_th?: unknown; alt_en?: unknown; sort_order?: unknown; is_primary?: unknown }
interface Faq { id?: unknown; question_th?: unknown; question_en?: unknown; answer_th?: unknown; answer_en?: unknown; sort_order?: unknown; is_published?: unknown }
interface VariantOption { id?: unknown; group_key?: unknown; group_label_th?: unknown; group_label_en?: unknown; value_key?: unknown; value_th?: unknown; value_en?: unknown; sort_order?: unknown }

interface ProductFormProps {
  product?: Record<string, unknown>
  categories: Record<string, unknown>[]
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'basic', label: 'Basic Info' },
  { key: 'content', label: 'Content' },
  { key: 'seo', label: 'SEO' },
  { key: 'variants', label: 'Variants' },
  { key: 'specs', label: 'Specs' },
  { key: 'media', label: 'Media' },
  { key: 'faqs', label: 'FAQs' },
]

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('basic')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const isEdit = !!product?.id

  // Local state for complex sub-data
  const [variants, setVariants] = useState<Variant[]>((product?.variants as Variant[]) ?? [])
  const [specs, setSpecs] = useState<Spec[]>((product?.specs as Spec[]) ?? [])
  const [mediaItems, setMediaItems] = useState<MediaItem[]>((product?.media as MediaItem[]) ?? [])
  const [faqs, setFaqs] = useState<Faq[]>((product?.faqs as Faq[]) ?? [])
  const [expandedVariant, setExpandedVariant] = useState<number | null>(null)

  // Slug auto-gen
  const [slug, setSlug] = useState(String(product?.slug ?? ''))

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      let result
      if (isEdit) {
        result = await updateProduct(Number(product.id), formData)
      } else {
        result = await createProduct(formData)
        if (result.success && result.id) {
          router.push(`/admin/products/${result.id}`)
          return
        }
      }
      if (result.success) {
        setSuccess('Saved successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.error ?? 'Something went wrong')
      }
    })
  }

  // ── Specs helpers ──
  const addSpec = () => setSpecs((s) => [...s, { spec_key: '', label_th: '', label_en: '', value_th: '', value_en: '', sort_order: s.length }])
  const removeSpec = (idx: number) => {
    const spec = specs[idx]
    if (spec.id) {
      startTransition(async () => { await deleteSpec(Number(spec.id)) })
    }
    setSpecs((s) => s.filter((_, i) => i !== idx))
  }
  const updateSpec = (idx: number, field: keyof Spec, val: string) => {
    setSpecs((s) => s.map((sp, i) => i === idx ? { ...sp, [field]: val } : sp))
  }
  const saveSpec = (idx: number) => {
    const sp = specs[idx]
    const productId = product ? Number(product.id) : undefined
    startTransition(async () => {
      const res = await upsertSpec(sp.id ? Number(sp.id) : null, {
        product_id: productId,
        spec_key: String(sp.spec_key ?? ''),
        label_th: String(sp.label_th ?? ''),
        label_en: String(sp.label_en ?? ''),
        value_th: String(sp.value_th ?? ''),
        value_en: String(sp.value_en ?? ''),
        sort_order: Number(sp.sort_order ?? idx),
      })
      if (!res.success) setError(res.error ?? 'Error saving spec')
    })
  }

  // ── Media helpers ──
  const addMedia = () => setMediaItems((m) => [...m, { url: '', alt_th: '', alt_en: '', sort_order: m.length, is_primary: false }])
  const removeMedia = (idx: number) => {
    const item = mediaItems[idx]
    if (item.id) {
      startTransition(async () => { await deleteMedia(Number(item.id)) })
    }
    setMediaItems((m) => m.filter((_, i) => i !== idx))
  }
  const updateMedia = (idx: number, field: keyof MediaItem, val: unknown) => {
    setMediaItems((m) => m.map((item, i) => i === idx ? { ...item, [field]: val } : item))
  }
  const saveMedia = (idx: number) => {
    const item = mediaItems[idx]
    const productId = product ? Number(product.id) : undefined
    startTransition(async () => {
      const res = await upsertMedia(item.id ? Number(item.id) : null, {
        product_id: productId,
        url: String(item.url ?? ''),
        alt_th: String(item.alt_th ?? ''),
        alt_en: String(item.alt_en ?? ''),
        sort_order: Number(item.sort_order ?? idx),
        is_primary: !!item.is_primary,
      })
      if (!res.success) setError(res.error ?? 'Error saving media')
    })
  }

  // ── FAQ helpers ──
  const addFaq = () => setFaqs((f) => [...f, { question_th: '', question_en: '', answer_th: '', answer_en: '', sort_order: f.length, is_published: true }])
  const removeFaq = (idx: number) => {
    const faq = faqs[idx]
    if (faq.id) {
      startTransition(async () => { await deleteFaq(Number(faq.id)) })
    }
    setFaqs((f) => f.filter((_, i) => i !== idx))
  }
  const updateFaq = (idx: number, field: keyof Faq, val: unknown) => {
    setFaqs((f) => f.map((fq, i) => i === idx ? { ...fq, [field]: val } : fq))
  }
  const saveFaq = (idx: number) => {
    const faq = faqs[idx]
    const ownerId = product ? Number(product.id) : 0
    if (!ownerId) return
    startTransition(async () => {
      const res = await upsertProductFaq(faq.id ? Number(faq.id) : null, ownerId, {
        question_th: String(faq.question_th ?? ''),
        question_en: String(faq.question_en ?? ''),
        answer_th: String(faq.answer_th ?? ''),
        answer_en: String(faq.answer_en ?? ''),
        sort_order: Number(faq.sort_order ?? idx),
        is_published: !!faq.is_published,
      })
      if (!res.success) setError(res.error ?? 'Error saving FAQ')
    })
  }

  // ── Variant helpers ──
  const addVariant = () => setVariants((v) => [...v, { label_th: '', label_en: '', slug: '', sku: '', is_published: true, sort_order: v.length, options: [], specs: [] }])
  const removeVariantItem = (idx: number) => {
    const v = variants[idx]
    if (v.id) {
      startTransition(async () => { await deleteVariant(Number(v.id)) })
    }
    setVariants((prev) => prev.filter((_, i) => i !== idx))
  }
  const updateVariantField = (idx: number, field: keyof Variant, val: unknown) => {
    setVariants((prev) => prev.map((v, i) => i === idx ? { ...v, [field]: val } : v))
  }
  const saveVariant = (idx: number) => {
    const v = variants[idx]
    const productId = product ? Number(product.id) : 0
    if (!productId) { setError('Save the product first before adding variants.'); return }
    const fd = new FormData()
    const fields: Array<keyof Variant> = ['slug','sku','label_th','label_en','description_th','description_en','image_url','availability_status','moq','lead_time','is_default','sort_order','is_published']
    fields.forEach(f => fd.set(String(f), String(v[f] ?? '')))
    startTransition(async () => {
      const res = await upsertVariant(productId, v.id ? Number(v.id) : null, fd)
      if (!res.success) setError(res.error ?? 'Error saving variant')
    })
  }

  // ── Variant Option helpers ──
  const addOption = (variantIdx: number) => {
    setVariants((prev) => prev.map((v, i) => i === variantIdx
      ? { ...v, options: [...(v.options ?? []), { group_key: '', group_label_th: '', group_label_en: '', value_key: '', value_th: '', value_en: '', sort_order: (v.options?.length ?? 0) }] }
      : v
    ))
  }
  const removeOption = (variantIdx: number, optIdx: number) => {
    const opt = variants[variantIdx]?.options?.[optIdx]
    if (opt?.id) {
      startTransition(async () => { await deleteVariantOption(Number(opt.id)) })
    }
    setVariants((prev) => prev.map((v, i) => i === variantIdx
      ? { ...v, options: v.options?.filter((_, j) => j !== optIdx) }
      : v
    ))
  }
  const updateOption = (variantIdx: number, optIdx: number, field: keyof VariantOption, val: string) => {
    setVariants((prev) => prev.map((v, i) => {
      if (i !== variantIdx) return v
      const opts = [...(v.options ?? [])]
      opts[optIdx] = { ...opts[optIdx], [field]: val }
      return { ...v, options: opts }
    }))
  }
  const saveOption = (variantIdx: number, optIdx: number) => {
    const v = variants[variantIdx]
    const opt = v.options?.[optIdx]
    if (!opt || !v.id) { setError('Save the variant first.'); return }
    startTransition(async () => {
      const res = await upsertVariantOption(opt.id ? Number(opt.id) : null, Number(v.id), {
        group_key: String(opt.group_key ?? ''),
        group_label_th: String(opt.group_label_th ?? ''),
        group_label_en: String(opt.group_label_en ?? ''),
        value_key: String(opt.value_key ?? ''),
        value_th: String(opt.value_th ?? ''),
        value_en: String(opt.value_en ?? ''),
        sort_order: Number(opt.sort_order ?? optIdx),
      })
      if (!res.success) setError(res.error ?? 'Error saving option')
    })
  }

  const inputClass = 'w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
  const smallInput = `${inputClass} text-xs`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{isEdit ? String(product.name_th) : 'New Product'}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{isEdit ? `ID: ${product.id}` : 'Create a new product'}</p>
          </div>
        </div>
        <button
          form="product-form"
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Save size={16} />
          {isPending ? 'Saving...' : 'Save Product'}
        </button>
      </div>

      {/* Alerts */}
      {error && <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">{error}</div>}
      {success && <div className="bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 rounded-lg text-sm">{success}</div>}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800 rounded-xl p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form id="product-form" ref={formRef} onSubmit={handleSubmit}>
        {/* ── Tab: Basic Info ── */}
        {tab === 'basic' && (
          <div className="space-y-5">
            <FormSection title="Category & Identification">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Category</label>
                  <select name="category_id" defaultValue={String(product?.category_id ?? '')} className={inputClass}>
                    <option value="">— No Category —</option>
                    {(categories as unknown as Category[]).map((c) => (
                      <option key={String(c.id)} value={String(c.id)}>{String(c.name_th)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">SKU</label>
                  <input type="text" name="sku" defaultValue={String(product?.sku ?? '')} className={inputClass} placeholder="PROD-001" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Slug</label>
                <input type="text" name="slug" value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className={inputClass} placeholder="product-slug" />
              </div>
            </FormSection>

            <FormSection title="Product Name">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Name (TH) / ชื่อสินค้า</label>
                <input type="text" name="name_th" defaultValue={String(product?.name_th ?? '')}
                  onBlur={(e) => { if (!slug) setSlug(slugify(e.target.value)) }}
                  className={inputClass} placeholder="ชื่อสินค้าภาษาไทย" required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Name (EN)</label>
                <input type="text" name="name_en" defaultValue={String(product?.name_en ?? '')} className={inputClass} placeholder="Product Name" />
              </div>
            </FormSection>

            <FormSection title="Family Name" description="Products with the same family name are grouped together on the frontend.">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Family Name (TH)</label>
                  <input type="text" name="family_name_th" defaultValue={String(product?.family_name_th ?? '')} className={inputClass} placeholder="ชื่อกลุ่มสินค้า" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Family Name (EN)</label>
                  <input type="text" name="family_name_en" defaultValue={String(product?.family_name_en ?? '')} className={inputClass} placeholder="Product Family Name" />
                </div>
              </div>
            </FormSection>

            <FormSection title="Description">
              <BilingualField name="description" type="textarea"
                labelTh="คำอธิบาย (TH)" labelEn="Description (EN)"
                valueTh={String(product?.description_th ?? '')} valueEn={String(product?.description_en ?? '')} />
            </FormSection>

            <FormSection title="Main Image">
              <ImageField name="image_url" value={String(product?.image_url ?? '')}
                altNameTh="image_alt_th" altNameEn="image_alt_en"
                altValueTh={String(product?.image_alt_th ?? '')} altValueEn={String(product?.image_alt_en ?? '')} />
            </FormSection>

            <FormSection title="Availability">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Status</label>
                  <select name="availability_status" defaultValue={String(product?.availability_status ?? 'in_stock')} className={inputClass}>
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="made_to_order">Made to Order</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">MOQ</label>
                  <input type="number" name="moq" defaultValue={String(product?.moq ?? 1)} className={inputClass} min="1" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Lead Time</label>
                  <input type="text" name="lead_time" defaultValue={String(product?.lead_time ?? '')} className={inputClass} placeholder="e.g. 2-3 weeks" />
                </div>
              </div>
            </FormSection>

            <FormSection title="Publishing">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Sort Order</label>
                  <input type="number" name="sort_order" defaultValue={String(product?.sort_order ?? 0)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Published</label>
                  <StatusToggle defaultChecked={!!product?.is_published} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Default Variant Slug</label>
                <input type="text" name="default_variant_slug" defaultValue={String(product?.default_variant_slug ?? '')} className={inputClass} placeholder="default-variant" />
              </div>
            </FormSection>
          </div>
        )}

        {/* ── Tab: Content ── */}
        {tab === 'content' && (
          <div className="space-y-5">
            <FormSection title="Main Content" description="Full HTML content for the product page.">
              <BilingualField name="content" type="richtext"
                labelTh="เนื้อหา (TH)" labelEn="Content (EN)"
                valueTh={String(product?.content_th ?? '')} valueEn={String(product?.content_en ?? '')} />
            </FormSection>
            <FormSection title="Application" description="How this product is used / application areas.">
              <BilingualField name="application" type="richtext"
                labelTh="การประยุกต์ใช้ (TH)" labelEn="Application (EN)"
                valueTh={String(product?.application_th ?? '')} valueEn={String(product?.application_en ?? '')} />
            </FormSection>
          </div>
        )}

        {/* ── Tab: SEO ── */}
        {tab === 'seo' && (
          <div className="space-y-5">
            <FormSection title="SEO Meta">
              <div>
                <label className="block text-xs text-gray-400 mb-1">SEO Title (TH)</label>
                <input type="text" name="seo_title_th" defaultValue={String(product?.seo_title_th ?? '')} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">SEO Title (EN)</label>
                <input type="text" name="seo_title_en" defaultValue={String(product?.seo_title_en ?? '')} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">SEO Description (TH)</label>
                <textarea name="seo_description_th" defaultValue={String(product?.seo_description_th ?? '')} rows={3} className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">SEO Description (EN)</label>
                <textarea name="seo_description_en" defaultValue={String(product?.seo_description_en ?? '')} rows={3} className={`${inputClass} resize-none`} />
              </div>
            </FormSection>
          </div>
        )}
      </form>

      {/* ── Tab: Variants (outside form — separate saves) ── */}
      {tab === 'variants' && (
        <div className="space-y-4">
          {!isEdit && (
            <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-lg text-sm">
              Save the product first (Basic Info tab) before adding variants.
            </div>
          )}
          <div className="flex justify-end">
            <button onClick={addVariant} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
              <Plus size={15} /> Add Variant
            </button>
          </div>
          {variants.map((v, idx) => (
            <div key={idx} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700">
                <button type="button" onClick={() => setExpandedVariant(expandedVariant === idx ? null : idx)}
                  className="flex items-center gap-2 text-gray-200 font-medium text-sm hover:text-white transition-colors">
                  {expandedVariant === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  {String(v.label_th || `Variant ${idx + 1}`)}
                  {v.is_default ? <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full">Default</span> : null}
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => saveVariant(idx)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors">
                    Save
                  </button>
                  <button onClick={() => removeVariantItem(idx)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {expandedVariant === idx && (
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Label (TH)</label>
                      <input type="text" value={String(v.label_th ?? '')} onChange={e => updateVariantField(idx, 'label_th', e.target.value)} className={smallInput} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Label (EN)</label>
                      <input type="text" value={String(v.label_en ?? '')} onChange={e => updateVariantField(idx, 'label_en', e.target.value)} className={smallInput} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Slug</label>
                      <input type="text" value={String(v.slug ?? '')} onChange={e => updateVariantField(idx, 'slug', e.target.value)} className={smallInput} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">SKU</label>
                      <input type="text" value={String(v.sku ?? '')} onChange={e => updateVariantField(idx, 'sku', e.target.value)} className={smallInput} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Availability</label>
                      <select value={String(v.availability_status ?? 'in_stock')} onChange={e => updateVariantField(idx, 'availability_status', e.target.value)} className={smallInput}>
                        <option value="in_stock">In Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="made_to_order">Made to Order</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">MOQ</label>
                      <input type="number" value={String(v.moq ?? 1)} onChange={e => updateVariantField(idx, 'moq', e.target.value)} className={smallInput} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Lead Time</label>
                      <input type="text" value={String(v.lead_time ?? '')} onChange={e => updateVariantField(idx, 'lead_time', e.target.value)} className={smallInput} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Sort Order</label>
                      <input type="number" value={String(v.sort_order ?? 0)} onChange={e => updateVariantField(idx, 'sort_order', e.target.value)} className={smallInput} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Description (TH)</label>
                      <textarea value={String(v.description_th ?? '')} onChange={e => updateVariantField(idx, 'description_th', e.target.value)} rows={3} className={`${smallInput} resize-none`} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Description (EN)</label>
                      <textarea value={String(v.description_en ?? '')} onChange={e => updateVariantField(idx, 'description_en', e.target.value)} rows={3} className={`${smallInput} resize-none`} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Image URL</label>
                    <input type="text" value={String(v.image_url ?? '')} onChange={e => updateVariantField(idx, 'image_url', e.target.value)} className={smallInput} placeholder="https://..." />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                      <input type="checkbox" checked={!!v.is_default} onChange={e => updateVariantField(idx, 'is_default', e.target.checked)} className="rounded" />
                      Default variant
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                      <input type="checkbox" checked={!!v.is_published} onChange={e => updateVariantField(idx, 'is_published', e.target.checked)} className="rounded" />
                      Published
                    </label>
                  </div>

                  {/* Variant Options */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Options</h4>
                      <button type="button" onClick={() => addOption(idx)} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        <Plus size={12} /> Add Option
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(v.options ?? []).map((opt, oi) => (
                        <div key={oi} className="grid grid-cols-7 gap-2 items-center">
                          <input placeholder="group_key" value={String(opt.group_key ?? '')} onChange={e => updateOption(idx, oi, 'group_key', e.target.value)} className={`${smallInput} col-span-1`} />
                          <input placeholder="Group TH" value={String(opt.group_label_th ?? '')} onChange={e => updateOption(idx, oi, 'group_label_th', e.target.value)} className={`${smallInput} col-span-1`} />
                          <input placeholder="Group EN" value={String(opt.group_label_en ?? '')} onChange={e => updateOption(idx, oi, 'group_label_en', e.target.value)} className={`${smallInput} col-span-1`} />
                          <input placeholder="value_key" value={String(opt.value_key ?? '')} onChange={e => updateOption(idx, oi, 'value_key', e.target.value)} className={`${smallInput} col-span-1`} />
                          <input placeholder="Value TH" value={String(opt.value_th ?? '')} onChange={e => updateOption(idx, oi, 'value_th', e.target.value)} className={`${smallInput} col-span-1`} />
                          <input placeholder="Value EN" value={String(opt.value_en ?? '')} onChange={e => updateOption(idx, oi, 'value_en', e.target.value)} className={`${smallInput} col-span-1`} />
                          <div className="flex gap-1">
                            <button type="button" onClick={() => saveOption(idx, oi)} className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded transition-colors">✓</button>
                            <button type="button" onClick={() => removeOption(idx, oi)} className="px-2 py-1 bg-red-900/40 hover:bg-red-900/60 text-red-400 text-xs rounded transition-colors">✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {variants.length === 0 && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
              <p className="text-gray-500 text-sm">No variants yet. Click &ldquo;Add Variant&rdquo; to create one.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Specs ── */}
      {tab === 'specs' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={addSpec} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
              <Plus size={15} /> Add Spec
            </button>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-900/50 border-b border-gray-700">
                <tr>
                  <th className="text-left px-4 py-2 text-gray-500 font-medium">Key</th>
                  <th className="text-left px-4 py-2 text-gray-500 font-medium">Label TH</th>
                  <th className="text-left px-4 py-2 text-gray-500 font-medium">Label EN</th>
                  <th className="text-left px-4 py-2 text-gray-500 font-medium">Value TH</th>
                  <th className="text-left px-4 py-2 text-gray-500 font-medium">Value EN</th>
                  <th className="text-left px-4 py-2 text-gray-500 font-medium">Order</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {specs.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No specs added.</td></tr>
                ) : specs.map((sp, i) => (
                  <tr key={i}>
                    {(['spec_key','label_th','label_en','value_th','value_en'] as Array<keyof Spec>).map(f => (
                      <td key={String(f)} className="px-2 py-2">
                        <input value={String(sp[f] ?? '')} onChange={e => updateSpec(i, f, e.target.value)} className={smallInput} />
                      </td>
                    ))}
                    <td className="px-2 py-2">
                      <input type="number" value={String(sp.sort_order ?? 0)} onChange={e => updateSpec(i, 'sort_order', e.target.value)} className={`${smallInput} w-16`} />
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex gap-1">
                        <button type="button" onClick={() => saveSpec(i)} className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded">✓</button>
                        <button type="button" onClick={() => removeSpec(i)} className="px-2 py-1 bg-red-900/40 hover:bg-red-900/60 text-red-400 text-xs rounded">✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab: Media ── */}
      {tab === 'media' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={addMedia} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
              <Plus size={15} /> Add Image
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {mediaItems.length === 0 ? (
              <div className="col-span-3 bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
                <p className="text-gray-500 text-sm">No media added yet.</p>
              </div>
            ) : mediaItems.map((item, i) => (
              <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
                {item.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={String(item.url)} alt="" className="w-full h-32 object-cover rounded-lg bg-gray-700" />
                ) : (
                  <div className="w-full h-32 rounded-lg bg-gray-700 flex items-center justify-center text-gray-500 text-xs">No image</div>
                )}
                <input placeholder="Image URL" value={String(item.url ?? '')} onChange={e => updateMedia(i, 'url', e.target.value)} className={smallInput} />
                <input placeholder="Alt TH" value={String(item.alt_th ?? '')} onChange={e => updateMedia(i, 'alt_th', e.target.value)} className={smallInput} />
                <input placeholder="Alt EN" value={String(item.alt_en ?? '')} onChange={e => updateMedia(i, 'alt_en', e.target.value)} className={smallInput} />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                    <input type="checkbox" checked={!!item.is_primary} onChange={e => updateMedia(i, 'is_primary', e.target.checked)} />
                    Primary
                  </label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => saveMedia(i)} className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded transition-colors">Save</button>
                    <button type="button" onClick={() => removeMedia(i)} className="px-3 py-1 bg-red-900/40 hover:bg-red-900/60 text-red-400 text-xs rounded transition-colors">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: FAQs ── */}
      {tab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={addFaq} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
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
                  <button type="button" onClick={() => saveFaq(i)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors">Save FAQ</button>
                  <button type="button" onClick={() => removeFaq(i)} className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs font-medium rounded-lg transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
