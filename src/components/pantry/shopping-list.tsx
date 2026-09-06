import { Skeleton } from '@/components/skeleton/skeleton'
import { CATEGORY_LABELS } from '@/data/ingredients'
import { buildShoppingList } from '@/lib/pantry/match'
import { formatAmount } from '@/lib/pantry/format'
import { ShareLink } from '@/components/pantry/share-link'
import { getRecipes } from '@/lib/pantry/source'
import { SectionFailure } from '@/components/site/section-boundary'

/**
 * What is left to buy for the picked recipes: the pantry is subtracted first,
 * then the same ingredient in the same unit is collapsed onto one line with
 * the amounts added up. Different units stay apart rather than being
 * converted with a guess.
 */
export async function ShoppingList({
  pickedSlugs,
  have,
}: {
  pickedSlugs: readonly string[]
  have: readonly string[]
}) {
  // Fetched here rather than in the page, so the shell is not held up waiting
  // for it — this component sits behind its own loading boundary.
  let recipes
  try {
    recipes = await getRecipes()
  } catch {
    return <SectionFailure label="The shopping list" />
  }
  const picked = recipes.filter((recipe) => pickedSlugs.includes(recipe.slug))
  if (picked.length === 0) return null

  const lines = buildShoppingList(picked, new Set(have))

  return (
    <section
      aria-labelledby="shopping-heading"
      className="rounded-lg border border-border bg-surface-raised p-5"
    >
      <h2 id="shopping-heading" className="text-lg font-semibold tracking-tight">
        Shopping list
      </h2>
      <p className="mt-1 text-sm text-text-muted">
        For {picked.length} {picked.length === 1 ? 'recipe' : 'recipes'}:{' '}
        {picked.map((recipe) => recipe.title).join(', ')}.
      </p>

      {lines.length === 0 ? (
        <p className="mt-4 text-sm">
          Nothing to buy — your kitchen already covers{' '}
          {picked.length === 1 ? 'it' : 'all of them'}.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {lines.map((line) => (
            <li
              key={`${line.ingredient.id}-${line.unit}`}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-sm"
            >
              <span className="w-20 shrink-0 text-text-muted tabular-nums">
                {formatAmount({ amount: line.amount, unit: line.unit })}
              </span>
              <span className="font-medium">{line.ingredient.name}</span>
              <span className="text-xs text-text-muted">
                {CATEGORY_LABELS[line.ingredient.category]}
                {line.recipes.length > 1
                  ? ` · for ${line.recipes.length} recipes`
                  : ''}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 border-t border-border pt-4">
        <ShareLink />
      </div>
    </section>
  )
}

/** Same box, same padding — so the list arriving does not move the page. */
export function ShoppingListSkeleton() {
  return (
    <section
      aria-busy="true"
      className="rounded-lg border border-border bg-surface-raised p-5"
    >
      <span className="sr-only">Building your shopping list…</span>
      <Skeleton className="h-6 w-40" />
      <div className="mt-2">
        <Skeleton className="h-4 max-w-sm" />
      </div>
      <div className="mt-4">
        <Skeleton lines={4} />
      </div>
      <div className="mt-5 border-t border-border pt-4">
        <Skeleton className="h-10 w-52" />
      </div>
    </section>
  )
}
