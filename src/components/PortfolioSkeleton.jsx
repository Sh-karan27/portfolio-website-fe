// Placeholder layout shown while the portfolio content is being fetched,
// so the page never flashes blank. Mirrors the real Hero + Section grid.
function SkeletonSection() {
  return (
    <div className="mx-auto grid max-w-[960px] gap-8 border-t border-line px-5 py-[60px] sm:px-8 md:grid-cols-[120px_1fr]">
      <div className="skeleton-block h-4 w-16" />
      <div className="flex flex-col gap-3">
        <div className="skeleton-block h-7 w-2/5" />
        <div className="skeleton-block h-4 w-full" />
        <div className="skeleton-block h-4 w-4/5" />
        <div className="skeleton-block h-4 w-3/5" />
      </div>
    </div>
  )
}

function PortfolioSkeleton() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bg text-ink">
      <div className="mx-auto max-w-[960px] px-5 pb-[70px] pt-[100px] sm:px-8">
        <div className="skeleton-block h-4 w-40" />
        <div className="skeleton-block mt-5 h-14 w-4/5" />
        <div className="skeleton-block mt-3 h-14 w-3/5" />
        <div className="mt-[26px] flex flex-col gap-2.5">
          <div className="skeleton-block h-4 w-full max-w-[58ch]" />
          <div className="skeleton-block h-4 w-full max-w-[54ch]" />
          <div className="skeleton-block h-4 w-2/3 max-w-[40ch]" />
        </div>
        <div className="mt-[34px] flex gap-3.5">
          <div className="skeleton-block h-[46px] w-36" />
          <div className="skeleton-block h-[46px] w-52" />
        </div>
      </div>

      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonSection key={index} />
      ))}
    </div>
  )
}

export default PortfolioSkeleton
