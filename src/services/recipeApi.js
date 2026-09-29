// Centralized API access for the Spoonacular Food API (free plan).
// Every network call in the app goes through one of these functions so the
// base URL, API key and error handling only live in one place.
//
// The rest of the app was built around TheMealDB's data shape (idMeal,
// strMeal, strMealThumb, ...). To avoid touching any component or page,
// the functions below convert Spoonacular's responses into that same shape.

const BASE_URL = 'https://api.spoonacular.com'
const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY
const PAGE_SIZE = 24

// The free plan has a small daily quota, so identical requests are cached
// (in memory, for the life of the page). This also stops React StrictMode's
// double-run of effects in dev from spending quota twice.
const cache = new Map()

async function fetchJson(url) {
  let response
  try {
    response = await fetch(url)
  } catch (err) {
    // Network failure (offline, DNS, CORS, etc.)
    throw new Error('Network error. Check your connection and try again.')
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('The API key is invalid. Check VITE_SPOONACULAR_API_KEY in your .env file.')
    }
    if (response.status === 402) {
      throw new Error('The daily free API limit has been reached. Please come back tomorrow to search more recipes.')
    }
    if (response.status === 404) {
      throw new Error('This recipe could not be found.')
    }
    if (response.status === 429) {
      throw new Error('Too many requests. Please wait a moment and try again.')
    }
    throw new Error('The recipe service returned an error. Please try again.')
  }

  try {
    return await response.json()
  } catch (err) {
    throw new Error('Received an invalid response from the recipe service.')
  }
}

function request(path, params = {}) {
  if (!API_KEY) {
    return Promise.reject(
      new Error('Missing API key. Add VITE_SPOONACULAR_API_KEY to your .env file and restart the dev server.')
    )
  }

  const url = new URL(`${BASE_URL}${path}`)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') url.searchParams.set(key, value)
  })
  url.searchParams.set('apiKey', API_KEY)

  const cacheKey = url.toString()
  if (!cache.has(cacheKey)) {
    // Failed requests are removed so "Try again" really retries.
    const promise = fetchJson(url).catch((err) => {
      cache.delete(cacheKey)
      throw err
    })
    cache.set(cacheKey, promise)
  }
  return cache.get(cacheKey)
}

// ---------- Response converters (Spoonacular -> app's existing shape) ----------

// Spoonacular image URLs end in a size like "-312x231.jpg"; ask for a larger one.
function largerImage(url) {
  return url ? url.replace(/-\d+x\d+\./, '-636x393.') : ''
}

function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : ''
}

function stripHtml(html) {
  return html
    .replace(/<\/(li|p)>|<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim()
}

function buildInstructions(recipe) {
  const steps = (recipe.analyzedInstructions || [])
    .flatMap((group) => group.steps || [])
    .map((s) => s.step)
    .filter(Boolean)
  if (steps.length > 0) return steps.join('\n')
  return recipe.instructions ? stripHtml(recipe.instructions) : ''
}

/** Lightweight recipe (search / category results): id, title, image. */
function toSummary(recipe) {
  return {
    idMeal: String(recipe.id),
    strMeal: recipe.title,
    strMealThumb: largerImage(recipe.image),
    strCategory: '',
    strArea: '',
  }
}

/** Full recipe (details page), including strIngredient1..N / strMeasure1..N. */
function toMeal(recipe) {
  const meal = {
    ...toSummary(recipe),
    strCategory: capitalize((recipe.dishTypes || [])[0]),
    strArea: (recipe.cuisines || [])[0] || '',
    strTags: (recipe.diets || []).join(','),
    strInstructions: buildInstructions(recipe),
    strYoutube: '',
  }

  ;(recipe.extendedIngredients || []).forEach((ing, i) => {
    const amount = ing.amount ? Math.round(ing.amount * 100) / 100 : ''
    meal[`strIngredient${i + 1}`] = ing.nameClean || ing.name || ing.original || ''
    meal[`strMeasure${i + 1}`] = `${amount} ${ing.unit || ''}`.trim()
  })

  return meal
}

// ---------- Public API (same function names and return shapes as before) ----------

/** Search recipes by name. Returns an array of meals (or []). */
export async function searchRecipes(query) {
  const data = await request('/recipes/complexSearch', { query, number: PAGE_SIZE })
  return (data.results || []).map(toSummary)
}

/** Fetch one recipe's full details by its id. Returns a meal object or null. */
export async function getRecipeById(id) {
  const data = await request(`/recipes/${encodeURIComponent(id)}/information`, {
    includeNutrition: 'false',
  })
  return data && data.id ? toMeal(data) : null
}

// Spoonacular has no "list categories" endpoint, so the categories page uses
// this fixed list (no API call, no quota used). Each maps to a search filter.
const THUMB = 'https://www.themealdb.com/images/category'
const CATEGORIES = [
  { name: 'Beef', thumb: 'beef', filter: { query: 'beef' } },
  { name: 'Chicken', thumb: 'chicken', filter: { query: 'chicken' } },
  { name: 'Dessert', thumb: 'dessert', filter: { type: 'dessert' } },
  { name: 'Lamb', thumb: 'lamb', filter: { query: 'lamb' } },
  { name: 'Pasta', thumb: 'pasta', filter: { query: 'pasta' } },
  { name: 'Pork', thumb: 'pork', filter: { query: 'pork' } },
  { name: 'Seafood', thumb: 'seafood', filter: { query: 'seafood' } },
  { name: 'Side', thumb: 'side', filter: { type: 'side dish' } },
  { name: 'Starter', thumb: 'starter', filter: { type: 'appetizer' } },
  { name: 'Vegan', thumb: 'vegan', filter: { diet: 'vegan' } },
  { name: 'Vegetarian', thumb: 'vegetarian', filter: { diet: 'vegetarian' } },
  { name: 'Breakfast', thumb: 'breakfast', filter: { type: 'breakfast' } },
]

/**
 * List all recipe categories. Returns an array of
 * {idCategory, strCategory, strCategoryThumb, strCategoryDescription}.
 */
export async function getCategories() {
  return CATEGORIES.map((c, i) => ({
    idCategory: String(i + 1),
    strCategory: c.name,
    strCategoryThumb: `${THUMB}/${c.thumb}.png`,
    strCategoryDescription: '',
  }))
}

const AREAS = [
  'African', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 'Eastern European',
  'European', 'French', 'German', 'Greek', 'Indian', 'Irish', 'Italian', 'Japanese',
  'Jewish', 'Korean', 'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern',
  'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese',
]

/** List all cuisines/areas. Returns an array of {strArea}. */
export async function getAreas() {
  return AREAS.map((strArea) => ({ strArea }))
}

/** Get recipes belonging to a category (lightweight meal objects). */
export async function getRecipesByCategory(category) {
  const match = CATEGORIES.find((c) => c.name.toLowerCase() === String(category).toLowerCase())
  const filter = match ? match.filter : { query: category }
  const data = await request('/recipes/complexSearch', { ...filter, number: PAGE_SIZE })
  return (data.results || []).map(toSummary)
}

/** Get recipes belonging to a cuisine/area (lightweight meal objects). */
export async function getRecipesByArea(area) {
  const data = await request('/recipes/complexSearch', { cuisine: area, number: PAGE_SIZE })
  return (data.results || []).map(toSummary)
}
