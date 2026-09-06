import { Suspense } from 'react'
import { Container } from '@/components/site/container'
import { IngredientPicker } from '@/components/pantry/ingredient-picker'
import { PantryPersistence } from '@/components/pantry/pantry-persistence'
import { RecipeList } from '@/components/pantry/recipe-list'
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

        <section aria-labelledby="results-heading" className="mt-12 @container">
          <h2
            id="results-heading"
            className="mb-4 text-lg font-semibold tracking-tight"
          >
            What you can cook
          </h2>
          <RecipeList have={have} picked={picked} />
        </section>
      </Container>
    </main>
  )
}
