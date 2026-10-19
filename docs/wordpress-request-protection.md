# WordPress request protection

Public read APIs use `app/lib/api/fetch-wordpress.ts`. Writes use their existing authenticated path and are never retried by this helper.

- One active request per origin, at least 250 ms between starts, at most 100 queued requests.
- Identical concurrent public requests share one fetch and receive independent response bodies. Requests with caller cancellation signals are not merged.
- Next.js cache settings and revalidation tags remain intact. The helper does not add a fresh cache that could bypass tag invalidation.
- HTTP 403/429 pauses requests to the origin for at least 60 seconds. A longer `Retry-After` value (seconds or HTTP date) is respected, including on 5xx responses.
- Three consecutive network, 5xx, invalid JSON, or HTML-response failures pause the origin for 60 seconds. There are no automatic retries. The next caller after the pause probes the upstream; queued calls check the pause before sending.
- During failure/pause/queue overflow, the last valid JSON response can be used for up to 15 minutes. This in-memory fallback holds at most 64 responses, each at most one million UTF-16 code units. Authenticated, cookie-bearing, `no-store`, and `revalidate: 0` requests are excluded. Without a saved response callers use their existing empty states.
- An upstream request and its body read have an 8-second timeout. Queue waiting is additional.

The scheduler and fallback cache are process-local and survive development module reloads, but not process restarts. Multiple workers, serverless instances, or deployments have separate limits. Fleet-wide control requires a shared store/queue or an upstream proxy. These controls reduce bursts; they do not guarantee acceptance under HostAtom's firewall rules. Confirm actual blocks using the hosting logs.

Validation: `node --test tests/fetch-wordpress.test.mjs tests/read-json.test.mjs`.
