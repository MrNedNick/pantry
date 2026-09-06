'use client'

import { useSearchParams } from 'next/navigation'
import { Badge } from '@/components/badge/badge'
import { INGREDIENTS_BY_ID } from '@/data/ingredients'
import type { RecipeIngredient } from '@/lib/pantry/types'
import { formatAmount } from '@/lib/pantry/format'
import { HAVE_PARAM } from '@/lib/pantry/url-state'

/**
 * The recipe itself is the same for everybody, so the page around this is
 * statically generated. Only this list depends on the reader's pantry, and it
 * reads that from the URL in the browser — which keeps the page cacheable.
 */
export function PantryAwareIngredients({
  ingredients,
}: {
  ingredients: readonly RecipeIngredient[]
}) {
  const searchParams = useSearchParams()
  const have = new Set(
    (searchParams.get(HAVE_PARAM) ?? '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean),
  )

  const missingCount = ingredients.filter(
    (item) => !item.optional && !have.has(item.id),
  ).length

  return (
    <>
      <p className="mb-3 text-sm text-text-muted" aria-live="polite">
        {have.size === 0
          ? 'Tick ingredients on the home page to see what you are missing.'
          : missingCount === 0
            ? 'You have everything you need for this one.'
            : `${missingCount} to buy.`}
      </p>
      <ul className="space-y-2">
        {ingredients.map((item) => {
          const ingredient = INGREDIENTS_BY_ID.get(item.id)
          const inPantry = have.has(item.id)
          return (
            <li
              key={`${item.id}-${item.unit}`}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
            >
              <span className="w-20 shrink-0 text-text-muted tabular-nums">
                {formatAmount(item)}
              </span>
              <span className={inPantry ? 'text-text-muted line-through' : ''}>
                {ingredient?.name ?? item.id}
              </span>
              {item.optional ? <Badge tone="neutral">optional</Badge> : null}
              {inPantry ? <Badge tone="success">in your kitchen</Badge> : null}
            </li>
          )
        })}
      </ul>
    </>
  )
}
