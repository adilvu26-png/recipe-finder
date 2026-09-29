import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage.jsx'
import { getCategories } from '../services/recipeApi.js'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-char-900 mb-2">
        Browse by category
      </h1>
      <p className="text-char-500 mb-8">Pick a category to see recipes that belong to it.</p>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white shadow-sm overflow-hidden animate-pulse" aria-hidden="true">
              <div className="aspect-square bg-char-100" />
              <div className="p-3"><div className="h-4 bg-char-100 rounded w-2/3" /></div>
            </div>
          ))}
          <span className="sr-only" role="status">Loading categories…</span>
        </div>
      )}
      {!loading && error && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.idCategory}
              to={`/category/${encodeURIComponent(cat.strCategory)}`}
              className="group rounded-2xl bg-white shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
            >
              <div className="aspect-square overflow-hidden bg-char-100">
                <img
                  src={cat.strCategoryThumb}
                  alt={cat.strCategory}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <p className="font-display font-semibold text-char-900">{cat.strCategory}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
