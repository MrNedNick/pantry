import { Suspense } from 'react'
import { Container } from '@/components/site/container'
import { PantryPersistence } from '@/components/pantry/pantry-persistence'
import { getRecipes } from '@/lib/pantry/source'
import { matchRecipes } from '@/lib/pantry/match'
import { parseHave, type RawSearchParams } from '@/lib/pantry/url-state'
import { INGREDIENTS_BY_ID } from '@/data/ingredients'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>
}) {
  const params = await searchParams
  const have = parseHave(params)

  // Filtering happens here, on the server. The browser is sent the result,
  // never the recipe set.
  const recipes = await getRecipes()
  const matched = matchRecipes(recipes, new Set(have))

  return (
    <main id="main">
      <Suspense fallback={null}>
        <PantryPersistence />
      </Suspense>

      <Container className="py-12 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Cook from what you already have
        </h1>
        <p className="mt-4 max-w-prose text-text-muted">
          Tick off what is in your kitchen. The list comes back sorted by how
          little is missing, so the thing you can cook tonight is at the top.
        </p>

        <p className="mt-8 text-sm text-text-muted">
          {recipes.length} recipes loaded ·{' '}
          {have.length === 0
            ? 'nothing in the pantry yet'
            : `${have.length} in the pantry: ${have
                .map((id) => INGREDIENTS_BY_ID.get(id)?.name ?? id)
                .join(', ')}`}
        </p>

        <ul className="mt-6 space-y-2">
          {matched.slice(0, 10).map(({ recipe, missing }) => (
            <li key={recipe.id} className="text-sm">
              <span className="font-medium">{recipe.title}</span>{' '}
              <span className="text-text-muted">
                — {missing.length} missing · {recipe.minutes} min · {recipe.source}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  )
}
