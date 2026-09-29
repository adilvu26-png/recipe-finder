import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { toFavoriteRecord } from '../utils/recipeHelpers'

// Displays a single recipe as a card: image, name, category/area,
// a favorite toggle, and a link to the full detail page.
export default function RecipeCard({ recipe }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const favorited = isFavorite(recipe.idMeal)

  function toggleFavorite() {
    if (favorited) {
      removeFavorite(recipe.idMeal)
    } else {
      addFavorite(toFavoriteRecord(recipe))
    }
  }

  return (
    <div className="group rounded-2xl bg-white shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-char-100">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src =
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23e7e6e3"/></svg>'
          }}
        />
        <button
          onClick={toggleFavorite}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={favorited}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
        >
          <span className={favorited ? 'text-tomato-500' : 'text-char-400'} aria-hidden="true">
            {favorited ? '❤️' : '♡'}
          </span>
        </button>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-display font-semibold text-char-900 leading-snug line-clamp-2">
          {recipe.strMeal}
        </h3>
        {(recipe.strArea || recipe.strCategory) && (
          <p className="text-sm text-char-500">
            {[recipe.strArea, recipe.strCategory].filter(Boolean).join(' • ')}
          </p>
        )}
        <div className="mt-auto pt-2">
          <Link
            to={`/recipe/${recipe.idMeal}`}
            className="inline-block w-full text-center px-4 py-2 rounded-full bg-char-900 text-white text-sm font-medium hover:bg-saffron-600 transition-colors"
          >
            View recipe
          </Link>
        </div>
      </div>
    </div>
  )
}
