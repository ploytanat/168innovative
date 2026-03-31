'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'
import FormSection from '@/app/admin/_components/FormSection'
import StatusToggle from '@/app/admin/_components/StatusToggle'
import BilingualField from '@/app/admin/_components/BilingualField'
import ImageField from '@/app/admin/_components/ImageField'
import { createArticle, updateArticle, upsertBlock, deleteBlock, setArticleTags, setArticleCategories } from '@/app/admin/actions/articles'

type Tab = 'basic' | 'content' | 'seo' | 'blocks' | 'taxonomy'

interface Block { id?: unknown; block_type?: unknown; sort_order?: unknown; content_th?: unknown; content_en?: unknown; heading_th?: unknown; heading_en?: unknown; level?: unknown; style?: unknown; items_th?: unknown; items_en?: unknown; label_th?: unknown; label_en?: unknown; href?: unknown }

const BLOCK_TYPES = ['rich_text', 'checklist', 'callout', 'comparison_table', 'cta']
const TABS: { key: Tab; label: string }[] = [
  { key: 'basic', label: 'Basic Info' },
  { key: 'content', label: 'Content' },
  { key: 'seo', label: 'SEO' },
  { key: 'blocks', label: 'Blocks' },
  { key: 'taxonomy', label: 'Tags & Categories' },
]

export default function ArticleForm({
  article,
  allCategories,
  allTags,
}: {
  article?: Record<string, unknown>
  allCategories: Record<string, unknown>[]
  allTags: Record<string, unknown>[]
}) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('basic')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [slug, setSlug] = useState(String(article?.slug ?? ''))
  const [blocks, setBlocks] = useState<Block[]>((article?.blocks as Block[]) ?? [])
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    ((article?.tags as Record<string, unknown>[]) ?? []).map(t => Number(t.id))
  )
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>(
    ((article?.categories as Record<string, unknown>[]) ?? []).map(c => Number(c.id))
  )

  const isEdit = !!article?.id
  const inputClass = 'w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500'

  const slugify = (t: string) => t.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(''); setSuccess('')
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      let result
      if (isEdit) { result = await updateArticle(Number(article.id), fd) }
      else {
        result = await createArticle(fd)
        if (result.success && result.id) { router.push(`/admin/articles/${result.id}`); return }
      }
      if (result.success) { setSuccess('Saved!'); setTimeout(() => setSuccess(''), 3000) }
      else setError(result.error ?? 'Error')
    })
  }

  // Block helpers
  const addBlock = () => setBlocks(b => [...b, { block_type: 'rich_text', sort_order: b.length }])
  const removeBlockItem = (i: number) => {
    const bl = blocks[i]
    if (bl.id) startTransition(async () => { await deleteBlock(Number(bl.id)) })
    setBlocks(b => b.filter((_, j) => j !== i))
  }
  const updateBlock = (i: number, field: keyof Block, val: unknown) => setBlocks(b => b.map((bl, j) => j === i ? { ...bl, [field]: val } : bl))
  const saveBlock = (i: number) => {
    const bl = blocks[i]; const articleId = article ? Number(article.id) : 0
    if (!articleId) return
    startTransition(async () => {
      const res = await upsertBlock(bl.id ? Number(bl.id) : null, articleId, bl as Record<string, unknown>)
      if (!res.success) setError(res.error ?? 'Error')
    })
  }

  const saveTaxonomy = () => {
    const articleId = article ? Number(article.id) : 0
    if (!articleId) return
    startTransition(async () => {
      await setArticleTags(articleId, selectedTagIds)
      await setArticleCategories(articleId, selectedCatIds)
      setSuccess('Taxonomy saved!'); setTimeout(() => setSuccess(''), 3000)
    })
  }

  const toggleId = (ids: number[], setIds: (v: number[]) => void, id: number) => {
    setIds(ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/articles" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{isEdit ? String(article.title_th) : 'New Article'}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{isEdit ? `ID: ${article.id}` : 'Create a new article'}</p>
          </div>
        </div>
        <button form="article-form" type="submit" disabled={isPending}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
          <Save size={16} />{isPending ? 'Saving...' : 'Save Article'}
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

      <form id="article-form" onSubmit={handleSubmit}>
        {tab === 'basic' && (
          <div className="space-y-5">
            <FormSection title="Titles">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Title (TH)</label>
                <input type="text" name="title_th" defaultValue={String(article?.title_th ?? '')}
                  onBlur={e => { if (!slug) setSlug(slugify(e.target.value)) }}
                  className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Title (EN)</label>
                <input type="text" name="title_en" defaultValue={String(article?.title_en ?? '')} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Slug</label>
                <input type="text" name="slug" value={slug} onChange={e => setSlug(e.target.value)} className={inputClass} required />
              </div>
            </FormSection>

            <FormSection title="Excerpt">
              <BilingualField name="excerpt" type="textarea"
                valueTh={String(article?.excerpt_th ?? '')} valueEn={String(article?.excerpt_en ?? '')} />
            </FormSection>

            <FormSection title="Cover Image">
              <ImageField name="cover_image_url" value={String(article?.cover_image_url ?? '')}
                altNameTh="cover_image_alt_th" altNameEn="cover_image_alt_en"
                altValueTh={String(article?.cover_image_alt_th ?? '')} altValueEn={String(article?.cover_image_alt_en ?? '')} />
            </FormSection>

            <FormSection title="Meta">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Author Name</label>
                  <input type="text" name="author_name" defaultValue={String(article?.author_name ?? '')} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Reading Time (min)</label>
                  <input type="number" name="reading_time_minutes" defaultValue={String(article?.reading_time_minutes ?? '')} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Published At</label>
                  <input type="datetime-local" name="published_at" defaultValue={article?.published_at ? String(article.published_at).slice(0, 16) : ''} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Focus Keyword (TH)</label>
                  <input type="text" name="focus_keyword_th" defaultValue={String(article?.focus_keyword_th ?? '')} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Focus Keyword (EN)</label>
                  <input type="text" name="focus_keyword_en" defaultValue={String(article?.focus_keyword_en ?? '')} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Published</label>
                <StatusToggle defaultChecked={!!article?.is_published} />
              </div>
            </FormSection>
          </div>
        )}

        {tab === 'content' && (
          <div className="space-y-5">
            <FormSection title="Main Content (HTML)">
              <BilingualField name="content" type="richtext"
                valueTh={String(article?.content_th ?? '')} valueEn={String(article?.content_en ?? '')} />
            </FormSection>
          </div>
        )}

        {tab === 'seo' && (
          <FormSection title="SEO Meta">
            <div>
              <label className="block text-xs text-gray-400 mb-1">SEO Title (TH)</label>
              <input type="text" name="seo_title_th" defaultValue={String(article?.seo_title_th ?? '')} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">SEO Title (EN)</label>
              <input type="text" name="seo_title_en" defaultValue={String(article?.seo_title_en ?? '')} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">SEO Description (TH)</label>
              <textarea name="seo_description_th" defaultValue={String(article?.seo_description_th ?? '')} rows={3} className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">SEO Description (EN)</label>
              <textarea name="seo_description_en" defaultValue={String(article?.seo_description_en ?? '')} rows={3} className={`${inputClass} resize-none`} />
            </div>
          </FormSection>
        )}
      </form>

      {tab === 'blocks' && (
        <div className="space-y-4">
          {!isEdit && <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-lg text-sm">Save the article first before adding blocks.</div>}
          <div className="flex justify-end">
            <button onClick={addBlock} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg">
              <Plus size={15} /> Add Block
            </button>
          </div>
          {blocks.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center"><p className="text-gray-500 text-sm">No blocks yet.</p></div>
          ) : blocks.map((bl, i) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <select value={String(bl.block_type ?? 'rich_text')} onChange={e => updateBlock(i, 'block_type', e.target.value)} className={`${inputClass} w-48`}>
                  {BLOCK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input type="number" placeholder="Sort" value={String(bl.sort_order ?? i)} onChange={e => updateBlock(i, 'sort_order', e.target.value)} className={`${inputClass} w-20`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Content (TH)</label>
                  <textarea value={String(bl.content_th ?? '')} onChange={e => updateBlock(i, 'content_th', e.target.value)} rows={5} className={`${inputClass} resize-y font-mono text-xs`} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Content (EN)</label>
                  <textarea value={String(bl.content_en ?? '')} onChange={e => updateBlock(i, 'content_en', e.target.value)} rows={5} className={`${inputClass} resize-y font-mono text-xs`} />
                </div>
                {(bl.block_type === 'callout' || bl.block_type === 'cta') && (
                  <>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Heading (TH)</label>
                      <input value={String(bl.heading_th ?? '')} onChange={e => updateBlock(i, 'heading_th', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Heading (EN)</label>
                      <input value={String(bl.heading_en ?? '')} onChange={e => updateBlock(i, 'heading_en', e.target.value)} className={inputClass} />
                    </div>
                  </>
                )}
                {bl.block_type === 'cta' && (
                  <>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">CTA Label (TH)</label>
                      <input value={String(bl.label_th ?? '')} onChange={e => updateBlock(i, 'label_th', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">CTA Label (EN)</label>
                      <input value={String(bl.label_en ?? '')} onChange={e => updateBlock(i, 'label_en', e.target.value)} className={inputClass} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-400 mb-1">CTA href</label>
                      <input value={String(bl.href ?? '')} onChange={e => updateBlock(i, 'href', e.target.value)} className={inputClass} />
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => saveBlock(i)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg">Save Block</button>
                <button type="button" onClick={() => removeBlockItem(i)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'taxonomy' && (
        <div className="space-y-5">
          {!isEdit && <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-lg text-sm">Save the article first.</div>}
          <div className="grid grid-cols-2 gap-5">
            <FormSection title="Categories">
              <div className="space-y-2">
                {allCategories.map(c => (
                  <label key={String(c.id)} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" checked={selectedCatIds.includes(Number(c.id))}
                      onChange={() => toggleId(selectedCatIds, setSelectedCatIds, Number(c.id))}
                      className="rounded" />
                    {String(c.name_th)}
                  </label>
                ))}
                {allCategories.length === 0 && <p className="text-gray-500 text-sm">No categories yet.</p>}
              </div>
            </FormSection>
            <FormSection title="Tags">
              <div className="space-y-2">
                {allTags.map(t => (
                  <label key={String(t.id)} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" checked={selectedTagIds.includes(Number(t.id))}
                      onChange={() => toggleId(selectedTagIds, setSelectedTagIds, Number(t.id))}
                      className="rounded" />
                    {String(t.name_th)}
                  </label>
                ))}
                {allTags.length === 0 && <p className="text-gray-500 text-sm">No tags yet.</p>}
              </div>
            </FormSection>
          </div>
          {isEdit && (
            <div className="flex justify-end">
              <button type="button" onClick={saveTaxonomy} disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg">
                <Save size={15} /> Save Taxonomy
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
