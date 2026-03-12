type Props = {
  html: string
  className?: string
}

export default function ArticleBody({ html, className = "" }: Props) {
  return (
    <article className={`article-body ${className}`.trim()}>
      <div className="article-body__content rich-content" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  )
}
