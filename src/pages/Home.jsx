import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar.jsx'
import RecipeGrid from '../components/RecipeGrid.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { searchRecipes } from '../services/recipeApi.js'

const POPULAR_TERMS = ['Chicken', 'Pasta', 'Pizza', 'Beef', 'Rice', 'Seafood']

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const resultsRef = useRef(null)

  const scrollToResults = useCallback(() => {
    // Runs after the DOM has the results section in place — a rAF tick
    // is enough to avoid racing the initial render on first search.
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  const runSearch = useCallback(async (term) => {
    setLoading(true)
    setError(null)
    setHasSearched(true)
    try {
      const results = await searchRecipes(term)
      setRecipes(results)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Run a search whenever the query changes via the URL (?q=...),
  // e.g. from the header's quick search or a popular-term click.
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery)
      runSearch(initialQuery)
      scrollToResults()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  function handleSearch(term) {
    setQuery(term)
    setSearchParams({ q: term })
    runSearch(term)
    scrollToResults()
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-char-900">
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=60')",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-char-900 via-char-900/80 to-char-900/40" aria-hidden="true" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 md:py-28 text-center flex flex-col items-center gap-5 sm:gap-6">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight">
            Find your perfect recipe
          </h1>
          <p className="text-char-200 max-w-xl text-sm sm:text-base">
            Discover delicious recipes from around the world and cook something amazing today.
          </p>
          <div className="w-full max-w-xl">
            <SearchBar initialValue={query} onSearch={handleSearch} size="lg" />
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {POPULAR_TERMS.map((term) => (
              <button
                key={term}
                onClick={() => handleSearch(term)}
                className="px-3 py-1.5 rounded-full text-sm bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section ref={resultsRef} className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-20">
        {loading && <LoadingSpinner />}

        {!loading && error && (
          <ErrorMessage message={error} onRetry={() => runSearch(query)} />
        )}

        {!loading && !error && hasSearched && recipes.length === 0 && (
          <EmptyState
            title="No recipes found"
            message={`We couldn't find anything for "${query}". Try a different search term.`}
          />
        )}

        {!loading && !error && recipes.length > 0 && (
          <>
            <p className="text-sm text-char-500 mb-4">
              {recipes.length} recipe{recipes.length === 1 ? '' : 's'} found for "{query}"
            </p>
            <RecipeGrid recipes={recipes} />
          </>
        )}

        {!loading && !error && !hasSearched && (
          <EmptyState
            icon="🍲"
            title="Start by searching for a recipe"
            message="Try one of the popular searches above, or type your own — like chicken, pasta, or rice."
          />
        )}
      </section>
    </div>
  )
}
