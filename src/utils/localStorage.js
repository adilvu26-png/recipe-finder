// Small, safe wrapper around localStorage for persisting favorite recipes.
// Every function guards against missing/corrupted data so a bad value
// in storage can never crash the app.

const STORAGE_KEY = 'favoriteRecipes'

/** Read all favorites from localStorage. Always returns an array. */
export function getFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    // Corrupted or inaccessible storage — fail safe with an empty list.
    return []
  }
}

function saveFavorites(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  } catch (err) {
    // Storage may be full or unavailable (private browsing, etc.).
    // Silently ignore — the app still works, it just won't persist.
  }
}

/** Add a recipe to favorites (no-op if already saved). */
export function addFavorite(recipe) {
  const favorites = getFavorites()
  if (favorites.some((f) => f.idMeal === recipe.idMeal)) return favorites
  const updated = [...favorites, recipe]
  saveFavorites(updated)
  return updated
}

/** Remove a recipe from favorites by id. */
export function removeFavorite(id) {
  const updated = getFavorites().filter((f) => f.idMeal !== id)
  saveFavorites(updated)
  return updated
}

/** Check whether a recipe id is currently favorited. */
export function isFavorite(id) {
  return getFavorites().some((f) => f.idMeal === id)
}
