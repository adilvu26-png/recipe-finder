// Helpers for reshaping TheMealDB's slightly awkward flat response
// shape into things components can render directly.

/**
 * TheMealDB returns ingredients/measurements as 20 numbered fields
 * (strIngredient1..20, strMeasure1..20). This converts them into a
 * clean array of { ingredient, measure }, skipping empty slots.
 */
export function extractIngredients(meal) {
  if (!meal) return []
  const ingredients = []
  for (let i = 1; i <= 100; i++) {
    const ingredient = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : '',
      })
    }
  }
  return ingredients
}

/**
 * Splits the long instructions string into readable steps. TheMealDB
 * instructions are inconsistently formatted (numbered lines, blank
 * lines, or one big paragraph), so this handles the common cases.
 */
export function extractSteps(instructions) {
  if (!instructions) return []

  const normalized = instructions.replace(/\r\n/g, '\n').trim()

  // Try splitting on blank lines or numbered prefixes like "1." / "1)".
  let steps = normalized
    .split(/\n+/)
    .map((line) => line.replace(/^\s*\d+[.)]\s*/, '').trim())
    .filter(Boolean)

  // If that only produced one giant step, fall back to sentence splitting.
  if (steps.length <= 1 && normalized.length > 200) {
    steps = normalized
      .split(/(?<=[.!?])\s+(?=[A-Z])/)
      .map((s) => s.trim())
      .filter(Boolean)
  }

  return steps.length > 0 ? steps : [normalized]
}

/** Reduces a full meal object to the fields needed to render a RecipeCard. */
export function toFavoriteRecord(meal) {
  return {
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb,
    strCategory: meal.strCategory || '',
    strArea: meal.strArea || '',
  }
}
