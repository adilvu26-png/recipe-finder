import RecipeGrid from '../components/RecipeGrid.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useFavorites } from '../context/FavoritesContext.jsx'

export default function Favorites() {
  const { favorites } = useFavorites()

  return (
    <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-char-900 mb-6">
        Your favorite recipes
      </h1>

      {favorites.length === 0 ? (
        <EmptyState
          icon="🤍"
          title="No favorite recipes yet"
          message="Recipes you favorite will show up here so you can find them again."
          actionLabel="Explore recipes"
          actionTo="/"
        />
      ) : (
        <RecipeGrid recipes={favorites} />
      )}
    </div>
  )
}
