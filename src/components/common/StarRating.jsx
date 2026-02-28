import { FiStar } from 'react-icons/fi'

export default function StarRating({ rating = 0, max = 5, size = 14, interactive = false, onChange }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(max)].map((_, i) => (
        <FiStar
          key={i}
          size={size}
          className={`transition-colors ${i < rating ? 'text-brand-400 fill-brand-400' : 'text-ink-500'}
                      ${interactive ? 'cursor-pointer hover:text-brand-300' : ''}`}
          onClick={() => interactive && onChange?.(i + 1)}
        />
      ))}
    </div>
  )
}
