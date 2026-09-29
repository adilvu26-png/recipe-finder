// Skeleton loading cards — used anywhere the recipe grid is waiting
// on an API response. Mirrors the shape of a real RecipeCard so the
// layout doesn't jump when real data arrives.
export default function LoadingSpinner({ count = 10 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-white shadow-sm overflow-hidden animate-pulse"
          aria-hidden="true"
        >
          <div className="h-44 bg-char-100" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-char-100 rounded w-3/4" />
            <div className="h-3 bg-char-100 rounded w-1/2" />
            <div className="h-8 bg-char-100 rounded w-full mt-2" />
          </div>
        </div>
      ))}
      <span className="sr-only" role="status">Loading recipes…</span>
    </div>
  )
}
