import { test } from 'node:test'
import assert from 'node:assert/strict'
import { facebookUrl, mapFacebookUpdates } from '../app/lib/facebook-updates.ts'

const origin = 'https://cms.example.com'
const post = (id, overrides = {}) => ({ id, title: { rendered: 'New &amp; useful' }, excerpt: { rendered: '<p>A short update.</p>' }, content: { rendered: `<p><a href="https://www.facebook.com/168innovative/posts/${id}">Read</a></p>` }, _embedded: { 'wp:featuredmedia': [{ source_url: `${origin}/image.jpg`, alt_text: 'Packaging', media_details: { sizes: { medium_large: { source_url: `${origin}/image-768.jpg` } } } }] }, ...overrides })

test('Facebook links reject spoofed hosts, scripts, credentials and redirect endpoints', () => {
  for (const input of ['javascript:alert(1)', 'https://facebook.com.evil.test/a', 'https://evilfacebook.com/a', 'http://facebook.com/a', 'https://u:p@facebook.com/a', 'https://facebook.com:444/a', 'https://facebook.com/l.php?u=https://evil.test', 'https://www.facebook.com/login.php', null]) assert.equal(facebookUrl(input), null)
  assert.equal(facebookUrl('https://www.facebook.com/story.php?story_fbid=1&amp;id=2'), 'https://www.facebook.com/story.php?story_fbid=1&id=2')
  assert.equal(facebookUrl('https://www.facebook.com/story.php?story_fbid=1&#038;id=2'), 'https://www.facebook.com/story.php?story_fbid=1&id=2')
  assert.equal(facebookUrl('https://www.facebook.com/plugins/post.php?href=anything'), null)
  assert.equal(facebookUrl('https://fb.watch/abc/'), 'https://fb.watch/abc/')
})

test('maps real CMS content, decodes text, and prefers a smaller CMS image', () => {
  const [result] = mapFacebookUpdates([post(1)], origin)
  assert.equal(result.title, 'New & useful')
  assert.equal(result.excerpt, 'A short update.')
  assert.equal(result.image, `${origin}/image-768.jpg`)
  assert.equal(result.url, 'https://www.facebook.com/168innovative/posts/1')
})

test('omits incomplete entries, duplicate sources, and foreign or unsafe images', () => {
  const bad = [null, 1, {}, post(1, { _embedded: {} }), post(2, { content: { rendered: 'No link' } }), post(3, { _embedded: { 'wp:featuredmedia': [{ source_url: 'https://evil.test/a.jpg' }] } })]
  assert.deepEqual(mapFacebookUpdates(bad, origin), [])
  assert.equal(mapFacebookUpdates([post(1), post(1), post(2), post(3), post(4)], origin).length, 3)
  assert.deepEqual(mapFacebookUpdates({ error: true }, origin), [])
})
