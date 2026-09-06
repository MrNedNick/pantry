'use client'

import { useMemo, useOptimistic, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/button/button'
import { Checkbox } from '@/components/checkbox/checkbox'
import { Input } from '@/components/input/input'
import { INGREDIENTS_BY_CATEGORY } from '@/data/ingredients'
import { HAVE_PARAM, toggle } from '@/lib/pantry/url-state'

/**
 * Writes the pantry into the URL and lets the server do the rest. Nothing is
 * filtered here — this component's whole job is to keep the querystring
 * honest, which is also what makes the selection shareable.
 *
 * The ticked set is held optimistically because the real value only comes back
 * with the server's answer: without it, ticking four boxes faster than the
 * round-trip would compute each toggle from a stale list and keep only the
 * last one.
 */
export function IngredientPicker({ have }: { have: readonly string[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const [query, setQuery] = useState('')
  const [optimisticHave, setOptimisticHave] = useOptimistic<readonly string[]>(have)

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return INGREDIENTS_BY_CATEGORY
    return INGREDIENTS_BY_CATEGORY.map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.name.toLowerCase().includes(needle),
      ),
    })).filter((group) => group.items.length > 0)
  }, [query])

  function commit(next: readonly string[]) {
    const params = new URLSearchParams(searchParams.toString())
    if (next.length > 0) params.set(HAVE_PARAM, [...next].sort().join(','))
    else params.set(HAVE_PARAM, '')
    const queryString = params.toString()
    startTransition(() => {
      setOptimisticHave(next)
      router.replace(queryString ? `/?${queryString}` : '/', { scroll: false })
    })
  }

  return (
    <section aria-labelledby="pantry-heading" className="@container">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h2 id="pantry-heading" className="text-lg font-semibold tracking-tight">
          What is in your kitchen?
        </h2>
        <p aria-live="polite" className="text-sm text-text-muted">
          {optimisticHave.length === 0
            ? 'Nothing ticked yet'
            : `${optimisticHave.length} ticked`}
          {pending ? ' · updating…' : ''}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find an ingredient…"
          aria-label="Find an ingredient"
          className="max-w-xs"
        />
        <Button
          variant="outline"
          size="md"
          onClick={() => commit([])}
          disabled={optimisticHave.length === 0}
        >
          Clear pantry
        </Button>
      </div>

      <div className="mt-6 grid gap-6 @md:grid-cols-2 @3xl:grid-cols-3">
        {groups.map((group) => (
          <fieldset key={group.category} className="min-w-0">
            <legend className="mb-2 text-xs font-semibold tracking-wide text-text-muted uppercase">
              {group.label}
            </legend>
            <ul className="space-y-1.5">
              {group.items.map((item) => (
                <li key={item.id} className="min-w-0">
                  <Checkbox
                    id={`have-${item.id}`}
                    name={HAVE_PARAM}
                    value={item.id}
                    checked={optimisticHave.includes(item.id)}
                    onChange={() => commit(toggle(optimisticHave, item.id))}
                    label={<span className="truncate">{item.name}</span>}
                    className="max-w-full"
                  />
                </li>
              ))}
            </ul>
          </fieldset>
        ))}
      </div>

      {groups.length === 0 ? (
        <p className="mt-6 text-sm text-text-muted">
          Nothing in the catalogue matches “{query}”.
        </p>
      ) : null}
    </section>
  )
}
