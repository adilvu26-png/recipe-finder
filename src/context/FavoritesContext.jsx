import { createContext, useContext, useState, useCallback } from 'react'
import * as storage from '../utils/localStorage'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  // Lazy initializer so we only read localStorage once, on first render.
  const [favorites, setFavorites] = useState(() => storage.getFavorites())

  const addFavorite = useCallback((recipe) => {
    setFavorites(storage.addFavorite(recipe))
  }, [])

  const removeFavorite = useCallback((id) => {
    setFavorites(storage.removeFavorite(id))
  }, [])

  const isFavorite = useCallback(
    (id) => favorites.some((f) => f.idMeal === id),
    [favorites]
  )

  const clearFavorites = useCallback(() => {
    favorites.forEach((f) => storage.removeFavorite(f.idMeal))
    setFavorites([])
  }, [favorites])

  const value = { favorites, addFavorite, removeFavorite, isFavorite, clearFavorites }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

/** Access favorites state/actions from any component. */
export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return ctx
}
