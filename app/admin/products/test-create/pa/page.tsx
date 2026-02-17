'use client'
import { useState } from 'react'

export default function TestCreatePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = async () => {
    await fetch('/api/wp/create-post', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
    })

    alert('Created!')
  }

  return (
    <div className="p-10">
      <input
        className="border p-2 block mb-4"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 block mb-4"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2"
      >
        Create Post
      </button>
    </div>
  )
}
