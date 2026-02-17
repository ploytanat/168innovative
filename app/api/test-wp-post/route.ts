import { NextResponse } from 'next/server'

export async function POST() {
  const res = await fetch(
    `${process.env.WP_API_URL}/wp-json/wp/v2/posts`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Basic ' +
          Buffer.from(
            `${process.env.WP_USERNAME}:${process.env.WP_APP_PASSWORD}`
          ).toString('base64'),
      },
      body: JSON.stringify({
        title: 'Test Post from Next.js',
        content: 'This is a test post created via REST API.',
        status: 'draft',
      }),
    }
  )

  const data = await res.json()
  return NextResponse.json(data)
}
