import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

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
        title: body.title,
        content: body.content,
        status: 'draft',
      }),
    }
  )

  const data = await res.json()

  return NextResponse.json(data)
}
