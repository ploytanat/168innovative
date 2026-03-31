import pool from '@/app/lib/db/connection'
import { notFound } from 'next/navigation'
import ArticleForm from '../_form'

async function getData(id: number) {
  try {
    const [[article]] = await pool.execute('SELECT * FROM articles WHERE id = ?', [id]) as [Record<string, unknown>[], unknown]
    if (!article) return null
    const [blocks] = await pool.execute('SELECT * FROM article_blocks WHERE article_id = ? ORDER BY sort_order ASC', [id]) as [Record<string, unknown>[], unknown]
    const [articleTags] = await pool.execute('SELECT t.* FROM article_tags t JOIN article_article_tags aat ON aat.tag_id = t.id WHERE aat.article_id = ?', [id]) as [Record<string, unknown>[], unknown]
    const [articleCats] = await pool.execute('SELECT c.* FROM article_categories c JOIN article_article_categories aac ON aac.category_id = c.id WHERE aac.article_id = ?', [id]) as [Record<string, unknown>[], unknown]
    const [allCats] = await pool.execute('SELECT * FROM article_categories ORDER BY sort_order ASC') as [Record<string, unknown>[], unknown]
    const [allTags] = await pool.execute('SELECT * FROM article_tags ORDER BY name_th ASC') as [Record<string, unknown>[], unknown]
    return { article: { ...article, blocks, tags: articleTags, categories: articleCats }, allCategories: allCats, allTags }
  } catch { return null }
}

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getData(Number(id))
  if (!data) notFound()
  return <ArticleForm article={data.article} allCategories={data.allCategories} allTags={data.allTags} />
}
