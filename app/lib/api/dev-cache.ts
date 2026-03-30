type CachedResponseEntry = {
  body: string
  expiresAt: number
  headers: Array<[string, string]>
  status: number
  statusText: string
}

declare global {
  var __WP_DEV_FETCH_CACHE__:
    | Map<string, CachedResponseEntry>
    | undefined
}

const DEFAULT_TTL_SECONDS = Number.parseInt(
  process.env.WP_DEV_CACHE_TTL_SECONDS ?? "900",
  10
)

function getDevFetchCache() {
  if (!globalThis.__WP_DEV_FETCH_CACHE__) {
    globalThis.__WP_DEV_FETCH_CACHE__ = new Map()
  }

  return globalThis.__WP_DEV_FETCH_CACHE__
}

function isDevCacheEnabled() {
  return process.env.NODE_ENV !== "production"
}

function normalizeHeaders(headers?: HeadersInit) {
  const normalized = new Headers(headers)

  return Array.from(normalized.entries())
    .filter(([key]) => {
      const lowerKey = key.toLowerCase()
      return lowerKey !== "authorization" && lowerKey !== "cookie"
    })
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
}

function buildCacheKey(url: string, init?: RequestInit) {
  const method = init?.method?.toUpperCase() ?? "GET"

  return JSON.stringify({
    headers: normalizeHeaders(init?.headers),
    method,
    url,
  })
}

function createResponse(entry: CachedResponseEntry) {
  return new Response(entry.body, {
    headers: new Headers(entry.headers),
    status: entry.status,
    statusText: entry.statusText,
  })
}

export async function fetchWithDevCache(
  url: string,
  init?: RequestInit,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
) {
  const method = init?.method?.toUpperCase() ?? "GET"
  const safeTtlSeconds = Number.isFinite(ttlSeconds)
    ? Math.max(0, ttlSeconds)
    : DEFAULT_TTL_SECONDS

  if (!isDevCacheEnabled() || method !== "GET" || safeTtlSeconds === 0) {
    return fetch(url, init)
  }

  const cache = getDevFetchCache()
  const cacheKey = buildCacheKey(url, init)
  const now = Date.now()
  const cached = cache.get(cacheKey)

  if (cached && cached.expiresAt > now) {
    return createResponse(cached)
  }

  if (cached) {
    cache.delete(cacheKey)
  }

  const response = await fetch(url, init)

  if (!response.ok) {
    return response
  }

  const body = await response.text()
  const entry: CachedResponseEntry = {
    body,
    expiresAt: now + safeTtlSeconds * 1000,
    headers: Array.from(response.headers.entries()),
    status: response.status,
    statusText: response.statusText,
  }

  cache.set(cacheKey, entry)

  return createResponse(entry)
}
