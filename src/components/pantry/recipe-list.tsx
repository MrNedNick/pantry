import Link from 'next/link'
import { EmptyState } from '@/components/empty-state/empty-state'
import { SectionFailure } from '@/components/site/section-boundary'
import { RecipeCard } from '@/components/pantry/recipe-card'
import { getRecipeData } from '@/lib/pantry/source'
import { matchRecipes } from '@/lib/pantry/match'
import { buildQuery } from '@/lib/pantry/url-state'

/**
 * A server component that awaits the recipe sources. It is rendered inside a
 * Suspense boundary, so the page around it does not wait for this.
 */
export async function RecipeList({
  have,
  picked,
  showAll,
}: {
  have: readonly string[]
  picked: readonly string[]
  showAll: boolean
}) {
  // Caught here rather than left to a boundary: React answers a server
  // component that throws mid-stream by re-rendering it in the browser, and
  // there is no browser version of this, so the skeleton would stay up for
  // good. Returning the failure as content is the only thing that paints.
  let data
  try {
    data = await getRecipeData()
  } catch {
    return <SectionFailure label="The recipe list" />
  }
  const { recipes, remoteOk } = data
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

  const nothingReady = have.length > 0 && ready.length === 0
  // Enough to browse without turning the page into a wall of cards, unless
  // the URL already asked for the rest.
  const visible = showAll ? matched : matched.slice(0, 24)

  return (
    <>
      {!remoteOk ? (
        <p
          role="status"
          className="mb-4 rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-text"
        >
          The open recipe database did not answer, so this is the set that
          ships with the app. Everything below still works.
        </p>
      ) : null}
      <p className="text-sm text-text-muted">
        {have.length === 0
          ? `${matched.length} recipes, sorted by how few ingredients they need.`
          : `${ready.length} of ${matched.length} recipes need nothing else.`}
        {matched.length > visible.length
          ? ` Showing the closest ${visible.length}.`
          : ''}
      </p>
      {nothingReady ? (
        <div className="mt-4">
          <EmptyState
            title="Nothing is fully covered yet"
            description={`The closest recipe needs ${matched[0].missing.length} more ${
              matched[0].missing.length === 1 ? 'ingredient' : 'ingredients'
            }. Tick a few staples — salt, oil, onion, garlic — and most of this list opens up.`}
          />
        </div>
      ) : null}

      <ul className="mt-4 grid gap-4 @md:grid-cols-2 @4xl:grid-cols-3">
        {visible.map((match) => (
          <li key={match.recipe.id} className="min-w-0">
            <RecipeCard match={match} have={have} picked={picked} />
          </li>
        ))}
      </ul>

      {matched.length > visible.length ? (
        <div className="mt-6 flex justify-center">
          <Link
            href={`/${buildQuery(have, picked, true)}#results-heading`}
            className="rounded-sm text-sm font-medium text-text underline underline-offset-2"
          >
            Show all {matched.length} recipes
          </Link>
        </div>
      ) : null}
    </>
  )
}
