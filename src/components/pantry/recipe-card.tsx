import { Suspense } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/badge/badge'
import { PickRecipeButton } from '@/components/pantry/pick-recipe-button'
import { INGREDIENTS_BY_ID } from '@/data/ingredients'
import type { MatchedRecipe } from '@/lib/pantry/types'
import { buildQuery } from '@/lib/pantry/url-state'

function names(ids: readonly { id: string }[]): string {
  return ids
    .map(({ id }) => INGREDIENTS_BY_ID.get(id)?.name ?? id)
    .join(', ')
}

export function RecipeCard({
  match,
  have,
  picked,
}: {
  match: MatchedRecipe
  have: readonly string[]
  picked: readonly string[]
}) {
  const { recipe, missing, have: found, missingOptional } = match
  const ready = missing.length === 0

  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight">
          <Link
            href={`/recipes/${recipe.slug}${buildQuery(have, picked)}`}
            className="rounded-sm hover:text-accent"
          >
            {recipe.title}
          </Link>
        </h3>
        <Badge
          tone={ready ? 'success' : missing.length <= 2 ? 'warning' : 'neutral'}
          className="shrink-0 whitespace-nowrap"
        >
          {ready ? 'Ready to cook' : `${missing.length} missing`}
        </Badge>
      </div>

      <p className="mt-2 text-sm text-text-muted">{recipe.summary}</p>

      <dl className="mt-3 space-y-1 text-sm">
        {missing.length > 0 ? (
          <div className="flex gap-2">
            <dt className="shrink-0 text-text-muted">Need:</dt>
            <dd className="min-w-0">{names(missing)}</dd>
          </div>
        ) : null}
        {found.length > 0 ? (
          <div className="flex gap-2">
            <dt className="shrink-0 text-text-muted">Have:</dt>
            <dd className="min-w-0 text-text-muted">{names(found)}</dd>
          </div>
        ) : null}
        {missingOptional.length > 0 ? (
          <div className="flex gap-2">
            <dt className="shrink-0 text-text-muted">Optional:</dt>
            <dd className="min-w-0 text-text-muted">{names(missingOptional)}</dd>
          </div>
        ) : null}
      </dl>

      <p className="mt-auto pt-3 text-xs text-text-muted">
        {recipe.minutes} min · serves {recipe.servings} ·{' '}
        {recipe.source === 'kitchen' ? 'kitchen set' : 'TheMealDB'}
      </p>

      <div className="pt-3">
        <Suspense fallback={null}>
          <PickRecipeButton slug={recipe.slug} size="sm" />
        </Suspense>
      </div>
    </article>
  )
}
