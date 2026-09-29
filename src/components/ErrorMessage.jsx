export default function ErrorMessage({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 text-center py-16 px-4"
    >
      <div className="w-12 h-12 rounded-full bg-tomato-500/10 flex items-center justify-center text-tomato-600 text-2xl">
        !
      </div>
      <p className="text-char-700 max-w-sm">
        {message || 'Unable to load recipes. Please try again.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 px-5 py-2 rounded-full bg-char-900 text-white text-sm font-medium hover:bg-char-800 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  )
}
