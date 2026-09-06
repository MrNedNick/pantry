import { Container } from '@/components/site/container'
import { Skeleton } from '@/components/skeleton/skeleton'
import { RecipeListSkeleton } from '@/components/pantry/recipe-list-skeleton'

/**
 * Shown while the route itself is being prepared. It mirrors the real page's
 * spacing so the header and the first block do not move when it is replaced.
 */
export default function Loading() {
  return (
    <main id="main">
      <Container className="py-10 sm:py-14">
        <Skeleton className="h-9 max-w-lg" />
        <div className="mt-4 max-w-prose">
          <Skeleton lines={2} />
        </div>
        <div className="mt-10">
          <Skeleton className="h-6 max-w-xs" />
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} lines={6} />
            ))}
          </div>
        </div>
        <div className="mt-12 @container">
          <RecipeListSkeleton cards={3} />
        </div>
      </Container>
    </main>
  )
}
