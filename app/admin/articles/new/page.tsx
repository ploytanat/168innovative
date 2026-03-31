import pool from '@/app/lib/db/connection'
import ArticleForm from '../_form'

async function getMetadata() {
  try {
    const [cats] = await pool.execute('SELECT * FROM article_categories ORDER BY sort_order ASC') as [Record<string, unknown>[], unknown]
    const [tags] = await pool.execute('SELECT * FROM article_tags ORDER BY name_th ASC') as [Record<string, unknown>[], unknown]
    return { cats, tags }
  } catch { return { cats: [], tags: [] } }
}

export default async function NewArticlePage() {
  const { cats, tags } = await getMetadata()
  return <ArticleForm allCategories={cats} allTags={tags} />
}
