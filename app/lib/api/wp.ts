import { fetchWithDevCache } from "./dev-cache"

type SearchParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean | null | undefined>

type NextFetchInit = RequestInit & {
  next?: {
    revalidate?: number
    tags?: string[]
  }
}

const DEFAULT_REVALIDATE_SECONDS = 300

function normalizeBooleanFlag(value?: string) {
  if (typeof value !== "string") {
    return undefined
  }

  const normalized = value.trim().toLowerCase()

  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false
  }

  return undefined
}

export function shouldUseMockData() {
  const explicitSetting = normalizeBooleanFlag(process.env.NEXT_PUBLIC_USE_MOCK)

  if (explicitSetting !== undefined) {
    return explicitSetting
  }

  if (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") {
    return false
  }

  return true
}

export function getWordPressBaseUrl() {
  const value = process.env.WP_API_URL?.trim()

  if (!value) {
    return null
  }

  return value.replace(/\/+$/, "")
}

export function shouldUseWordPressData() {
  return !shouldUseMockData() && Boolean(getWordPressBaseUrl())
}

function buildWordPressUrl(
  path: string,
  searchParams?: Record<string, SearchParamValue>
) {
  const baseUrl = getWordPressBaseUrl()

  if (!baseUrl) {
    throw new Error("WP_API_URL is not configured")
  }

  const normalizedPath = path.startsWith("/wp-json/")
    ? path
    : `/wp-json/${path.replace(/^\/+/, "")}`
  const url = new URL(normalizedPath, `${baseUrl}/`)

  if (searchParams) {
    for (const [key, rawValue] of Object.entries(searchParams)) {
      const values = Array.isArray(rawValue) ? rawValue : [rawValue]

      for (const value of values) {
        if (value === undefined || value === null || value === "") {
          continue
        }

        url.searchParams.append(key, String(value))
      }
    }
  }

  return url.toString()
}

async function executeWordPressFetch(url: string, init: NextFetchInit) {
  if (process.env.NODE_ENV === "production") {
    return fetch(url, init)
  }

  return fetchWithDevCache(url, init)
}

export async function fetchWordPressJson<T>(
  path: string,
  options?: {
    init?: NextFetchInit
    revalidate?: number
    searchParams?: Record<string, SearchParamValue>
    tags?: string[]
  }
): Promise<T> {
  const url = buildWordPressUrl(path, options?.searchParams)
  const response = await executeWordPressFetch(url, {
    ...options?.init,
    next: {
      revalidate: options?.revalidate ?? DEFAULT_REVALIDATE_SECONDS,
      tags: options?.tags,
      ...options?.init?.next,
    },
  })

  if (!response.ok) {
    throw new Error(
      `WordPress request failed (${response.status} ${response.statusText}) for ${url}`
    )
  }

  return (await response.json()) as T
}

export async function fetchWordPressCollection<T>(
  path: string,
  options?: {
    init?: NextFetchInit
    perPage?: number
    revalidate?: number
    searchParams?: Record<string, SearchParamValue>
    tags?: string[]
  }
): Promise<T[]> {
  const results: T[] = []
  const perPage = Math.min(Math.max(options?.perPage ?? 100, 1), 100)
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const url = buildWordPressUrl(path, {
      ...options?.searchParams,
      page,
      per_page: perPage,
    })
    const response = await executeWordPressFetch(url, {
      ...options?.init,
      next: {
        revalidate: options?.revalidate ?? DEFAULT_REVALIDATE_SECONDS,
        tags: options?.tags,
        ...options?.init?.next,
      },
    })

    if (!response.ok) {
      throw new Error(
        `WordPress collection request failed (${response.status} ${response.statusText}) for ${url}`
      )
    }

    const pageItems = (await response.json()) as T[]
    results.push(...pageItems)

    const headerValue = Number.parseInt(
      response.headers.get("X-WP-TotalPages") ?? "1",
      10
    )
    totalPages = Number.isFinite(headerValue) && headerValue > 0 ? headerValue : 1
    page += 1
  }

  return results
}

export async function loadWithWordPressFallback<T>(
  label: string,
  loader: () => Promise<T>,
  fallback: () => Promise<T> | T
) {
  if (!shouldUseWordPressData()) {
    return await fallback()
  }

  try {
    return await loader()
  } catch (error) {
    console.error(`Failed to load ${label} from WordPress. Falling back to mock data.`, error)
    return await fallback()
  }
}
