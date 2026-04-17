export interface WordPressRenderedField {
  rendered: string
}

export interface WordPressEntity {
  id: number
  slug?: string
  link?: string
  title: WordPressRenderedField
  excerpt: WordPressRenderedField
  content: WordPressRenderedField
  featured_media: number
}

export interface WordPressMedia {
  id: number
  alt_text?: string
  source_url?: string
  media_details?: {
    width?: number
    height?: number
  }
  title?: WordPressRenderedField
}

export type WordPressProduct = WordPressEntity
export type WordPressReview = WordPressEntity
export type WordPressPost = WordPressEntity
