import { Link } from 'react-router-dom'

export default function EmptyState({ icon = '🍽️', title, message, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-16 px-4">
      <div className="text-5xl" aria-hidden="true">{icon}</div>
      <h3 className="text-lg font-semibold text-char-800 font-display">{title}</h3>
      {message && <p className="text-char-500 max-w-sm">{message}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-2 px-5 py-2 rounded-full bg-saffron-500 text-white text-sm font-medium hover:bg-saffron-600 transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
