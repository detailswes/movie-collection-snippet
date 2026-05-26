/**
 * A shimmer placeholder card that matches the exact layout of a real movie card.
 * Shown while the movies list is loading instead of a generic spinner.
 */
const SkeletonCard = () => (
  <div className="bg-card p-2 rounded-xl animate-pulse">
    {/* Poster placeholder */}
    <div className="w-full min-h-[300px] xl:min-h-[400px] rounded-xl bg-input" />
    {/* Title + year placeholder */}
    <div className="mt-4 mb-2 px-2 space-y-2">
      <div className="h-4 bg-input rounded w-3/4" />
      <div className="h-3 bg-input rounded w-1/3" />
    </div>
  </div>
);

/**
 * Renders a responsive grid of SkeletonCards.
 * @param {number} count  How many cards to show (default 8 — matches default pageSize)
 */
const SkeletonGrid = ({ count = 8 }) => (
  <div className="py-32">
    {/* Header placeholder */}
    <div className="flex items-center mb-32 animate-pulse">
      <div className="h-8 bg-input rounded w-36" />
      <div className="h-8 w-8 bg-input rounded-full ml-3" />
    </div>
    <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

export default SkeletonGrid;
