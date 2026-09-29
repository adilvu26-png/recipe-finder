import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-char-100 bg-white mt-16">
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="font-display font-semibold text-char-900">🍳 Recipe Finder</p>
          <p className="text-sm text-char-500 mt-1 max-w-xs">
            Discover delicious recipes from around the world.
          </p>
        </div>
        <nav className="flex gap-6 text-sm text-char-600" aria-label="Footer navigation">
          <Link to="/" className="hover:text-char-900">Home</Link>
          <Link to="/categories" className="hover:text-char-900">Categories</Link>
          <Link to="/favorites" className="hover:text-char-900">Favorites</Link>
        </nav>
        <p className="text-xs text-char-400 max-w-xs">
          Free API with a daily request limit — if recipes stop loading, try again tomorrow.
          <br />
          Powered by{' '}
          <a href="https://spoonacular.com/food-api" target="_blank" rel="noopener noreferrer" className="hover:text-char-600">
            Spoonacular
          </a>
        </p>
      </div>
    </footer>
  )
}
