import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createWordPressFetcher } from '../app/lib/api/fetch-wordpress.ts'

const json = (value) => new Response(JSON.stringify(value), { headers: { 'content-type': 'application/json' } })

test('limits active requests to one per origin', async (t) => {
  const read = createWordPressFetcher(0)
  let active = 0
  let peak = 0
  t.mock.method(globalThis, 'fetch', async () => {
    peak = Math.max(peak, ++active)
    await new Promise(resolve => setImmediate(resolve))
    active--
    return json([])
  })
  await Promise.all(Array.from({ length: 10 }, (_, i) => read(`https://serial.test/${i}`)))
  assert.equal(peak, 1)
})

test('honors HTTP-date Retry-After and does not retain authenticated data', async (t) => {
  const read = createWordPressFetcher(0)
  let now = Date.parse('2026-10-19T00:00:00Z')
  t.mock.method(Date, 'now', () => now)
  t.mock.method(console, 'warn', () => {})
  let response = json(['private'])
  const fetch = t.mock.method(globalThis, 'fetch', async () => response)
  const options = { headers: { authorization: 'Bearer test' } }
  await read('https://private.test/a', options)
  response = new Response('', { status: 503, headers: { 'retry-after': 'Mon, 19 Oct 2026 00:02:00 GMT' } })
  assert.equal(await read('https://private.test/a', options), null)
  now += 90000
  assert.equal(await read('https://private.test/a', options), null)
  assert.equal(fetch.mock.callCount(), 2)
})

test('deduplicates concurrent callers and gives each a readable body', async (t) => {
  const read = createWordPressFetcher(0)
  const fetch = t.mock.method(globalThis, 'fetch', async () => json([1]))
  const responses = await Promise.all(Array.from({ length: 10 }, () => read('https://dedup.test/items')))
  assert.equal(fetch.mock.callCount(), 1)
  assert.deepEqual(await Promise.all(responses.map(r => r.json())), Array(10).fill([1]))
})

test('serializes different requests and stops queued traffic on 429, respecting Retry-After', async (t) => {
  const read = createWordPressFetcher(0)
  let now = 1000000
  t.mock.method(Date, 'now', () => now)
  t.mock.method(console, 'warn', () => {})
  const fetch = t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 429, headers: { 'retry-after': '120' } }))
  assert.deepEqual(await Promise.all([read('https://limit.test/a'), read('https://limit.test/b')]), [null, null])
  assert.equal(fetch.mock.callCount(), 1)
  now += 61000
  await read('https://limit.test/c')
  assert.equal(fetch.mock.callCount(), 1)
  now += 60000
  await read('https://limit.test/c')
  assert.equal(fetch.mock.callCount(), 2)
})

test('keeps last valid JSON during outages, pauses after three failures, and expires stale data', async (t) => {
  const read = createWordPressFetcher(0)
  let now = 1000000
  let healthy = true
  t.mock.method(Date, 'now', () => now)
  t.mock.method(console, 'warn', () => {})
  const fetch = t.mock.method(globalThis, 'fetch', async () => {
    if (healthy) return json([42])
    throw new Error('offline')
  })
  await read('https://stale.test/a')
  healthy = false
  for (let i = 0; i < 4; i++) assert.deepEqual(await (await read('https://stale.test/a')).json(), [42])
  assert.equal(fetch.mock.callCount(), 4)
  now += 16 * 60000
  assert.equal(await read('https://stale.test/a'), null)
})

test('403 pauses the whole origin and invalid HTML never replaces valid JSON', async (t) => {
  const read = createWordPressFetcher(0)
  t.mock.method(console, 'warn', () => {})
  let response = json([1])
  const fetch = t.mock.method(globalThis, 'fetch', async () => response)
  await read('https://blocked.test/a')
  response = new Response('<html>challenge</html>', { headers: { 'content-type': 'text/html' } })
  assert.deepEqual(await (await read('https://blocked.test/a')).json(), [1])
  response = new Response('', { status: 403 })
  assert.deepEqual(await (await read('https://blocked.test/a')).json(), [1])
  assert.equal(await read('https://blocked.test/b'), null)
  assert.equal(fetch.mock.callCount(), 3)
})

test('preserves response and Next cache options while bounding the request', async (t) => {
  const fetchWordPress = createWordPressFetcher(0)
  const response = new Response('[]', { headers: { 'content-type': 'application/json' } })
  const next = { revalidate: 60, tags: ['company'] }
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://example.com/wp-json/wp/v2/company')
    assert.deepEqual(options.next, next)
    assert.ok(options.signal instanceof AbortSignal)
    return response
  })
  assert.equal(await (await fetchWordPress('https://example.com/wp-json/wp/v2/company', { next })).text(), '[]')
})

test('connection failures return null and report their underlying cause', async (t) => {
  const fetchWordPress = createWordPressFetcher(0)
  t.mock.method(globalThis, 'fetch', async () => {
    throw new TypeError('fetch failed', { cause: { code: 'UND_ERR_CONNECT_TIMEOUT' } })
  })
  const warning = t.mock.method(console, 'warn', () => {})
  assert.equal(await fetchWordPress('https://example.com/wp-json/wp/v2/company'), null)
  assert.match(warning.mock.calls[0].arguments[0], /UND_ERR_CONNECT_TIMEOUT/)
})

test('preserves caller cancellation', async (t) => {
  const fetchWordPress = createWordPressFetcher(0)
  const controller = new AbortController()
  controller.abort()
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    assert.equal(options.signal.aborted, true)
    throw options.signal.reason
  })
  t.mock.method(console, 'warn', () => {})
  assert.equal(await fetchWordPress('https://example.com/api', { signal: controller.signal }), null)
})

test('base URL removes whitespace and trailing slashes', async () => {
  const previous = process.env.WP_API_URL
  try {
    process.env.WP_API_URL = ' https://example.com/// '
    const { WP_API_URL } = await import('../app/lib/config.ts')
    assert.equal(WP_API_URL, 'https://example.com')
  } finally {
    if (previous === undefined) delete process.env.WP_API_URL
    else process.env.WP_API_URL = previous
  }
})
