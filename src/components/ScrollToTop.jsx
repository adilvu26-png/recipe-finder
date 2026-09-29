import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Mounted once near the top of the app, inside the router. Any time the
// URL path changes — including clicking a RecipeCard's "View recipe"
// link from partway down a scrolled results grid — this resets the
// window scroll position, so the new page always opens at the top
// instead of staying wherever the previous page happened to be scrolled.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
