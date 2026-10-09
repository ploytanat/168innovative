import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readJson } from '../app/lib/api/read-json.ts'

test('accepts JSON responses including charset and vendor JSON', async () => {
  for (const type of ['application/json; charset=UTF-8', 'application/vnd.api+json']) {
    assert.deepEqual(await readJson(new Response('[{"id":1}]', { headers: { 'content-type': type } }), []), [{ id: 1 }])
  }
})

test('HTML success pages never reach the JSON parser', async () => {
  const response = new Response('<!DOCTYPE html><html>Unavailable</html>', { headers: { 'content-type': 'text/html' } })
  response.json = () => { throw new Error('must not parse HTML') }
  assert.deepEqual(await readJson(response, []), [])
})

test('invalid JSON, wrong shapes and HTTP errors use the fallback', async () => {
  for (const [body, status] of [['<!DOCTYPE html>', 200], ['{broken', 200], ['{}', 200], ['null', 200], ['[]', 503]]) {
    assert.deepEqual(await readJson(new Response(body, { status, headers: { 'content-type': 'application/json' } }), []), [])
  }
})
