import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import ApiLimitNotice from './components/ApiLimitNotice.jsx'
import Home from './pages/Home.jsx'
import RecipeDetails from './pages/RecipeDetails.jsx'
import Favorites from './pages/Favorites.jsx'
import Categories from './pages/Categories.jsx'
import CategoryResults from './pages/CategoryResults.jsx'

export default function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <ApiLimitNotice />
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:category" element={<CategoryResults mode="category" />} />
            <Route path="/area/:area" element={<CategoryResults mode="area" />} />
            <Route
              path="*"
              element={
                <div className="max-w-xl mx-auto px-4 py-24 text-center">
                  <h1 className="font-display text-2xl font-semibold text-char-900 mb-2">Page not found</h1>
                  <p className="text-char-500">The page you're looking for doesn't exist.</p>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  )
}
