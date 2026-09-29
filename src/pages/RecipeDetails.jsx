import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import { getRecipeById } from '../services/recipeApi.js'
import { extractIngredients, extractSteps, toFavoriteRecord } from '../utils/recipeHelpers.js'
import { useFavorites } from '../context/FavoritesContext.jsx'

export default function RecipeDetails() {
  const { id } = useParams()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()

  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getRecipeById(id)
        if (!cancelled) {
          if (!data) {
            setError('This recipe could not be found.')
          } else {
            setRecipe(data)
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    // Scroll reset is handled globally by <ScrollToTop /> in App.jsx
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <div className="max-w-5xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LoadingSpinner count={1} />
      </div>
    )
  }

  if (error || !recipe) {
    return <ErrorMessage message={error || 'Recipe not found.'} />
  }

  const ingredients = extractIngredients(recipe)
  const steps = extractSteps(recipe.strInstructions)
  const favorited = isFavorite(recipe.idMeal)

  function toggleFavorite() {
    if (favorited) {
      removeFavorite(recipe.idMeal)
    } else {
      addFavorite(toFavoriteRecord(recipe))
    }
  }

  return (
    <div className="max-w-5xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="text-sm text-char-500 hover:text-char-800 inline-flex items-center gap-1 mb-6">
        ← Back to recipes
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="rounded-2xl overflow-hidden bg-char-100 aspect-[4/3]">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-char-900">{recipe.strMeal}</h1>

          <div className="flex flex-wrap gap-2">
            {recipe.strCategory && (
              <span className="px-3 py-1 rounded-full bg-saffron-50 text-saffron-700 text-sm">
                {recipe.strCategory}
              </span>
            )}
            {recipe.strArea && (
              <span className="px-3 py-1 rounded-full bg-char-100 text-char-700 text-sm">
                {recipe.strArea}
              </span>
            )}
            {recipe.strTags &&
              recipe.strTags.split(',').filter(Boolean).map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-tomato-500/10 text-tomato-600 text-sm">
                  {tag.trim()}
                </span>
              ))}
          </div>

          <button
            onClick={toggleFavorite}
            aria-pressed={favorited}
            className={`self-start px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
              favorited
                ? 'bg-tomato-500 text-white hover:bg-tomato-600'
                : 'bg-char-900 text-white hover:bg-saffron-600'
            }`}
          >
            {favorited ? '❤️ Remove from favorites' : '♡ Add to favorites'}
          </button>

          {recipe.strYoutube && (
            <a
              href={recipe.strYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start px-5 py-2.5 rounded-full text-sm font-medium border border-char-200 text-char-700 hover:border-saffron-400 hover:text-saffron-600 transition-colors"
            >
              ▶ Watch recipe video
            </a>
          )}

          <div>
            <h2 className="font-display font-semibold text-char-900 mb-2">Ingredients</h2>
            <ul className="space-y-1.5">
              {ingredients.map((item, i) => (
                <li key={i} className="flex justify-between text-sm border-b border-char-100 py-1.5">
                  <span className="text-char-700">{item.ingredient}</span>
                  <span className="text-char-400">{item.measure}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold text-char-900 mb-4">Instructions</h2>
        <ol className="space-y-4">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-saffron-50 text-saffron-700 font-medium flex items-center justify-center text-sm">
                {i + 1}
              </span>
              <p className="text-char-700 pt-1">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
