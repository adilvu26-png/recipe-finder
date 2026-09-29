import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import RecipeGrid from '../components/RecipeGrid.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { getRecipesByCategory, getRecipesByArea } from '../services/recipeApi.js'

// Shared results page for both /category/:category and /area/:area.
// `mode` decides which API call and heading to use.
export default function CategoryResults({ mode = 'category' }) {
  const params = useParams()
  const value = mode === 'category' ? params.category : params.area

  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data =
        mode === 'category' ? await getRecipesByCategory(value) : await getRecipesByArea(value)
      setRecipes(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, mode])

  const backTo = mode === 'category' ? '/categories' : '/'
  const backLabel = mode === 'category' ? '← Back to categories' : '← Back to home'

  return (
    <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to={backTo} className="text-sm text-char-500 hover:text-char-800 inline-flex items-center gap-1 mb-4">
        {backLabel}
      </Link>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-char-900 mb-6">
        {value}
      </h1>

      {loading && <LoadingSpinner />}
      {!loading && error && <ErrorMessage message={error} onRetry={load} />}
      {!loading && !error && recipes.length === 0 && (
        <EmptyState title="No recipes found" message={`Nothing turned up for ${value}.`} />
      )}
      {!loading && !error && recipes.length > 0 && <RecipeGrid recipes={recipes} />}
    </div>
  )
}
