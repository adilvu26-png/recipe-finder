import { useState } from 'react'

// Controlled search input. Owns only its own text + submit behavior;
// the parent page decides what happens with the submitted query.
export default function SearchBar({ initialValue = '', onSearch, size = 'md' }) {
  const [value, setValue] = useState(initialValue)

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSearch(trimmed)
  }

  function handleClear() {
    setValue('')
  }

  const isLarge = size === 'lg'

  return (
    <form onSubmit={handleSubmit} role="search" className="w-full">
      <div
        className={`flex items-center gap-2 bg-white rounded-full shadow-sm border border-char-100 focus-within:border-saffron-400 transition-colors ${
          isLarge ? 'p-2' : 'p-1.5'
        }`}
      >
        <span className="pl-3 text-char-400" aria-hidden="true">⌕</span>
        <label htmlFor="recipe-search" className="sr-only">
          Search recipes
        </label>
        <input
          id="recipe-search"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search for chicken, pasta, pizza…"
          className={`flex-1 bg-transparent outline-none text-char-800 placeholder:text-char-400 ${
            isLarge ? 'text-base py-2' : 'text-sm py-1.5'
          }`}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="text-char-400 hover:text-char-600 px-1"
          >
            ✕
          </button>
        )}
        <button
          type="submit"
          className={`rounded-full bg-saffron-500 text-white font-medium hover:bg-saffron-600 transition-colors ${
            isLarge ? 'px-6 py-2.5' : 'px-4 py-1.5 text-sm'
          }`}
        >
          Search
        </button>
      </div>
    </form>
  )
}
