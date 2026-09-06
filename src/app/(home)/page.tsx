import { Suspense } from 'react'
import { Container } from '@/components/site/container'
import { SectionBoundary } from '@/components/site/section-boundary'
import { IngredientPicker } from '@/components/pantry/ingredient-picker'
import { PantryPersistence } from '@/components/pantry/pantry-persistence'
import { RecipeList } from '@/components/pantry/recipe-list'
import { RecipeListSkeleton } from '@/components/pantry/recipe-list-skeleton'
import {
  ShoppingList,
  ShoppingListSkeleton,
} from '@/components/pantry/shopping-list'
import {
  parseHave,
  parsePicked,
  type RawSearchParams,
} from '@/lib/pantry/url-state'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>
}) {
  const params = await searchParams
  const have = parseHave(params)
  const picked = parsePicked(params)

  return (
    <main id="main">
      <Suspense fallback={null}>
        <PantryPersistence />
      </Suspense>

      <Container className="py-10 sm:py-14">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Cook from what you already have
        </h1>
        <p className="mt-4 max-w-prose text-text-muted">
          Tick off what is in your kitchen. The list comes back sorted by how
          little is missing, so the thing you can cook tonight is at the top.
        </p>

        <div className="mt-10">
          <Suspense fallback={null}>
            <IngredientPicker have={have} />
          </Suspense>
        </div>

        {picked.length > 0 ? (
          <div className="mt-12">
            <SectionBoundary
              key={`list-${picked.join(',')}-${have.join(',')}`}
              label="The shopping list"
              skeleton={<ShoppingListSkeleton />}
            >
              <ShoppingList pickedSlugs={picked} have={have} />
            </SectionBoundary>
          </div>
        ) : null}

        <section aria-labelledby="results-heading" className="mt-12 @container">
          <h2
            id="results-heading"
            className="mb-4 text-lg font-semibold tracking-tight"
          >
            What you can cook
          </h2>

          {have.length === 0 ? (
            <p className="mb-4 rounded-md border border-dashed border-border px-4 py-3 text-sm text-text-muted">
              Nothing ticked yet, so this is every recipe with the shortest
              ones first. Tick what is in your kitchen above and the list
              reorders around what you can actually cook tonight.
            </p>
          ) : null}
          {/*
            Everything above this point is rendered and sent straight away; the
            list waits on two recipe sources, so it streams in behind a
            skeleton of the same shape instead of holding up the page.
            `key` restarts the boundary when the pantry changes, so a new
            search shows the skeleton again rather than stale results.
          */}
          <SectionBoundary
            key={have.join(',')}
            label="The recipe list"
            skeleton={<RecipeListSkeleton />}
          >
            <RecipeList have={have} picked={picked} />
          </SectionBoundary>
        </section>
      </Container>
    </main>
  )
}
