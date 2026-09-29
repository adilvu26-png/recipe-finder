import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext.jsx'

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-saffron-600' : 'text-char-600 hover:text-char-900'
  }`

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { favorites } = useFavorites()
  const navigate = useNavigate()

  function closeMenu() {
    setMenuOpen(false)
  }

  function handleQuickSearch(e) {
    e.preventDefault()
    const value = e.target.elements.headerSearch.value.trim()
    if (!value) return
    navigate(`/?q=${encodeURIComponent(value)}`)
    e.target.reset()
    closeMenu()
  }

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-char-100">
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 font-display font-semibold text-base sm:text-lg text-char-900 shrink-0">
          <span aria-hidden="true">🍳</span>
          <span className="whitespace-nowrap">Recipe Finder</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/categories" className={navLinkClass}>Categories</NavLink>
          <NavLink to="/favorites" className={navLinkClass}>
            Favorites{favorites.length > 0 ? ` (${favorites.length})` : ''}
          </NavLink>
        </nav>

        <form onSubmit={handleQuickSearch} className="hidden md:flex items-center" role="search">
          <label htmlFor="headerSearch" className="sr-only">Search recipes</label>
          <input
            id="headerSearch"
            name="headerSearch"
            type="text"
            placeholder="Quick search…"
            className="w-44 lg:w-56 text-sm bg-char-50 border border-char-100 rounded-full px-4 py-2 outline-none focus:border-saffron-400"
          />
        </form>

        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-char-50"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-char-100 bg-white px-4 py-4 flex flex-col gap-4">
          <form onSubmit={handleQuickSearch} role="search">
            <label htmlFor="headerSearchMobile" className="sr-only">Search recipes</label>
            <input
              id="headerSearchMobile"
              name="headerSearch"
              type="text"
              placeholder="Search recipes…"
              className="w-full text-sm bg-char-50 border border-char-100 rounded-full px-4 py-2.5 outline-none focus:border-saffron-400"
            />
          </form>
          <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>Home</NavLink>
          <NavLink to="/categories" className={navLinkClass} onClick={closeMenu}>Categories</NavLink>
          <NavLink to="/favorites" className={navLinkClass} onClick={closeMenu}>
            Favorites{favorites.length > 0 ? ` (${favorites.length})` : ''}
          </NavLink>
        </div>
      )}
    </header>
  )
}
