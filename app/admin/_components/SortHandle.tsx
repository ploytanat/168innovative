import { GripVertical } from 'lucide-react'

export default function SortHandle() {
  return (
    <div
      className="cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-400 transition-colors"
      title="Drag to reorder"
    >
      <GripVertical size={16} />
    </div>
  )
}
