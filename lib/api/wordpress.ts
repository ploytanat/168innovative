import type { WordPressEntity, WordPressMedia } from "@/types/wordpress"

const DEFAULT_REVALIDATE_SECONDS = 300

function getWordPressBaseUrl() {
  const value = process.env.WP_API_URL?.trim()

  if (!value) {
    return null
  }

  return value.replace(/\/+$/, "")
}

function buildWordPressUrl(
  path: string,
  searchParams?: Record<string, string | number | undefined>
) {
  const baseUrl = getWordPressBaseUrl()

  if (!baseUrl) {
    return null
  }

  const normalizedPath = path.startsWith("/wp-json/")
    ? path
    : `/wp-json/${path.replace(/^\/+/, "")}`
  const url = new URL(normalizedPath, `${baseUrl}/`)

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined || value === null || value === "") {
        continue
      }

      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
}

async function fetchWordPressJson<T>(
  path: string,
  searchParams?: Record<string, string | number | undefined>
) {
  const url = buildWordPressUrl(path, searchParams)

  if (!url) {
    return null
  }

  const response = await fetch(url, {
    next: { revalidate: DEFAULT_REVALIDATE_SECONDS },
  })

  if (!response.ok) {
    throw new Error(`WordPress request failed for ${url}`)
  }

  return (await response.json()) as T
}

export async function fetchWordPressCollection<T extends WordPressEntity>(
  endpoint: string,
  perPage: number
) {
  const data = await fetchWordPressJson<T[]>(endpoint, { per_page: perPage })
  return data ?? []
}

export async function fetchWordPressMediaMap(mediaIds: number[]) {
  const uniqueIds = Array.from(new Set(mediaIds.filter((id) => id > 0)))

  if (uniqueIds.length === 0) {
    return new Map<number, WordPressMedia>()
  }

  const mediaItems = await Promise.all(
    uniqueIds.map(async (id) => {
      try {
        return await fetchWordPressJson<WordPressMedia>(`/wp/v2/media/${id}`)
      } catch {
        return null
      }
    })
  )

  return new Map(
    mediaItems
      .filter((item): item is WordPressMedia => Boolean(item))
      .map((item) => [item.id, item])
  )
}
