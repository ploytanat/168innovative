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
  // Encode body as UTF-8 bytes via TextEncoder to avoid ByteString restrictions
  // in Next.js 16.2+ / undici when the body contains non-ASCII (Thai) characters.
  const bodyBytes = new TextEncoder().encode(entry.body)

  // Build headers, carrying the original Content-Type so callers still parse JSON correctly.
  const headers = new Headers(entry.headers)

  // Ensure charset is declared so callers decode correctly.
  if (!headers.has("content-type")) {
    headers.set("content-type", "application/json; charset=utf-8")
  }

  return new Response(bodyBytes, {
    headers,
    status: entry.status,
    // statusText must be a valid ByteString (ASCII); fall back to empty string
    // if the stored value somehow contains non-ASCII characters.
    statusText: entry.statusText.split("").every((c) => c.charCodeAt(0) < 256)
      ? entry.statusText
      : "",
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
