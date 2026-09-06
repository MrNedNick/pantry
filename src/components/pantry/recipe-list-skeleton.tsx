import { Skeleton } from '@/components/skeleton/skeleton'

/**
 * Placeholder for the streamed recipe list. The card outline, padding and grid
 * are the same as the real thing, so nothing shifts when the list arrives.
 */
export function RecipeListSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading recipes…</span>
      <Skeleton className="h-4 max-w-xs" />
      <ul className="mt-4 grid gap-4 @md:grid-cols-2 @4xl:grid-cols-3">
        {Array.from({ length: cards }, (_, index) => (
          <li key={index} className="min-w-0">
            <div className="flex h-full flex-col rounded-lg border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="mt-2">
                <Skeleton lines={2} />
              </div>
              <div className="mt-3">
                <Skeleton lines={2} />
              </div>
              <div className="mt-auto pt-3">
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
