type Options = RequestInit & { next?: { revalidate?: number | false; tags?: string[] } }
type Snapshot = { body: string; headers: [string, string][]; status: number; saved: number }
type OriginState = { tail: Promise<void>; pending: number; nextStart: number; failures: number; pausedUntil: number }

/** One scheduler per server process. No retries; Next retains control of fresh-data caching. */
export function createWordPressFetcher(intervalMs = 250) {
  const origins = new Map<string, OriginState>()
  const inFlight = new Map<string, Promise<Response | null>>()
  const stale = new Map<string, Snapshot>()

  return async function fetchWordPress(url: string, options: Options = {}): Promise<Response | null> {
    if (options.method && options.method.toUpperCase() !== "GET") {
      throw new Error("fetchWordPress only supports public GET requests")
    }
    const parsed = new URL(url)
    const headers = new Headers(options.headers)
    const shareable = !headers.has("authorization") && !headers.has("cookie") &&
      options.credentials !== "include" && options.cache !== "no-store" && options.next?.revalidate !== 0
    const key = JSON.stringify([url, [...headers.entries()].sort(), options.next, options.cache])
    const fallback = () => {
      const saved = shareable ? stale.get(key) : undefined
      if (!saved) return null
      if (Date.now() - saved.saved > 15 * 60_000) {
        stale.delete(key)
        return null
      }
      return new Response(saved.body, { status: saved.status, headers: saved.headers })
    }
    if (options.signal?.aborted) return null
    const existing = shareable && !options.signal ? inFlight.get(key) : undefined
    if (existing) return (await existing)?.clone() ?? null
    let state = origins.get(parsed.origin)
    if (!state) {
      state = { tail: Promise.resolve(), pending: 0, nextStart: 0, failures: 0, pausedUntil: 0 }
      origins.set(parsed.origin, state)
    }
    const host = state
    if (Date.now() < host.pausedUntil || host.pending >= 100) return fallback()
    host.pending++
    const pause = (milliseconds: number, reason: string) => {
      host.pausedUntil = Math.max(host.pausedUntil, Date.now() + milliseconds)
      console.warn(`WordPress requests paused for ${parsed.origin}: ${reason}`)
    }
    const failure = (reason: string) => {
      if (++host.failures >= 3) pause(60_000, reason)
      else console.warn(`WordPress unavailable: ${parsed.origin}${parsed.pathname} (${reason})`)
    }
    const job = host.tail.then(async (): Promise<Response | null> => {
      if (Date.now() < host.pausedUntil || options.signal?.aborted) return fallback()
      const wait = host.nextStart - Date.now()
      if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait))
      if (options.signal?.aborted) return null
      host.nextStart = Date.now() + intervalMs
      try {
        const response = await fetch(url, {
          ...options,
          signal: options.signal
            ? AbortSignal.any([options.signal, AbortSignal.timeout(8000)])
            : AbortSignal.timeout(8000),
        })
        if (response.status === 403 || response.status === 429 || response.status >= 500) {
          const retry = response.headers.get("retry-after")
          const seconds = retry && /^\d+$/.test(retry.trim()) ? Number(retry) * 1000 : NaN
          const delay = Number.isFinite(seconds) ? seconds : retry ? Date.parse(retry) - Date.now() : 0
          if (response.status === 403 || response.status === 429 || delay > 0) {
            pause(Math.max(60_000, Number.isFinite(delay) ? delay : 0), `HTTP ${response.status}`)
          } else failure(`HTTP ${response.status}`)
          await response.body?.cancel()
          return fallback()
        }
        if (!response.ok) return response
        const mime = (response.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase()
        if (mime !== "application/json" && !mime.endsWith("+json")) {
          failure("Expected JSON; received " + mime)
          await response.body?.cancel()
          return fallback()
        }
        // Consume the body while holding the slot, so slow downloads cannot pile up.
        const body = await response.text()
        JSON.parse(body)
        host.failures = 0
        const snapshot = { body, status: response.status, headers: [...response.headers.entries()], saved: Date.now() }
        if (shareable && body.length <= 1_000_000) {
          stale.delete(key)
          stale.set(key, snapshot)
          if (stale.size > 64) stale.delete(stale.keys().next().value!)
        }
        return new Response(body, { status: response.status, headers: response.headers })
      } catch (error) {
        if (!options.signal?.aborted) {
          const cause = error instanceof Error ? error.cause : undefined
          failure(cause && typeof cause === "object" && "code" in cause
            ? String(cause.code) : error instanceof Error ? error.message : "Network error")
        }
        return fallback()
      }
    }).finally(() => { host.pending-- })
    host.tail = job.then(() => {}, () => {})
    if (shareable && !options.signal) inFlight.set(key, job)
    try { return (await job)?.clone() ?? null }
    finally { if (inFlight.get(key) === job) inFlight.delete(key) }
  }
}

// Survives development module reloads; shared across all callers in this process.
const runtime = globalThis as typeof globalThis & { wordpressFetcher?: ReturnType<typeof createWordPressFetcher> }
export const fetchWordPress = runtime.wordpressFetcher ??= createWordPressFetcher()
