import { EmptyState } from '@/components/empty-state/empty-state'
import { RecipeCard } from '@/components/pantry/recipe-card'
import { getRecipes } from '@/lib/pantry/source'
import { matchRecipes } from '@/lib/pantry/match'

/**
 * A server component that awaits the recipe sources. It is rendered inside a
 * Suspense boundary, so the page around it does not wait for this.
 */
export async function RecipeList({
  have,
  picked,
}: {
  have: readonly string[]
  picked: readonly string[]
}) {
  const recipes = await getRecipes()
  const matched = matchRecipes(recipes, new Set(have))
  const ready = matched.filter((match) => match.missing.length === 0)

  if (matched.length === 0) {
    return (
      <EmptyState
        title="No recipes available"
        description="Both recipe sources came back empty. Reload the page to try again."
      />
    )
  }

  return (
    <>
      <p className="text-sm text-text-muted">
        {have.length === 0
          ? `${matched.length} recipes, sorted by how few ingredients they need.`
          : `${ready.length} of ${matched.length} recipes need nothing else.`}
      </p>
      <ul className="mt-4 grid gap-4 @md:grid-cols-2 @4xl:grid-cols-3">
        {matched.slice(0, 24).map((match) => (
          <li key={match.recipe.id} className="min-w-0">
            <RecipeCard match={match} have={have} picked={picked} />
          </li>
        ))}
      </ul>
    </>
  )
}
