import { useState } from 'react'

// Slim notice shown on every page so visitors know this site runs on a
// free API with a daily request limit. Can be dismissed for the current
// visit; it comes back on the next page load.
export default function ApiLimitNotice() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  return (
    <div role="note" className="bg-saffron-50 border-b border-saffron-200">
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-start sm:items-center gap-3">
        <span className="text-saffron-700" aria-hidden="true">ⓘ</span>
        <p className="flex-1 text-xs sm:text-sm text-saffron-900">
          <span className="font-semibold">Daily limit:</span> this site runs on a free recipe API with a
          limited number of searches per day. If recipes stop loading, the limit has been reached — please
          try again tomorrow.
        </p>
        <button
          onClick={() => setVisible(false)}
          aria-label="Dismiss notice"
          className="text-saffron-700 hover:text-saffron-900 px-1"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
