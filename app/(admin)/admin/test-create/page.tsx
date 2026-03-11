'use client'

export default function TestPostPage() {
  const handleClick = async () => {
    await fetch('/api/test-wp-post', {
      method: 'POST',
    })

    alert('Post created!')
  }

  return (
    <div className="p-10">
      <button
        onClick={handleClick}
        className="bg-black text-white px-4 py-2"
      >
        Create Test Post ทดสอบ
      </button>
    </div>
  )
}
