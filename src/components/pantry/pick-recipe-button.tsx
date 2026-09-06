'use client'

import { useOptimistic, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/button/button'
import { PICKED_PARAM, toggle } from '@/lib/pantry/url-state'

function pickedFrom(value: string | null): string[] {
  return (value ?? '')
    .split(',')
    .map((slug) => slug.trim())
    .filter(Boolean)
}

/** Adds or removes this recipe from the shopping selection held in the URL. */
export function PickRecipeButton({ slug }: { slug: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const picked = pickedFrom(searchParams.get(PICKED_PARAM))
  const [optimisticPicked, setOptimisticPicked] =
    useOptimistic<readonly string[]>(picked)

  const isPicked = optimisticPicked.includes(slug)

  function commit() {
    const next = toggle(optimisticPicked, slug)
    const params = new URLSearchParams(searchParams.toString())
    if (next.length > 0) params.set(PICKED_PARAM, next.join(','))
    else params.delete(PICKED_PARAM)
    const query = params.toString()

    startTransition(() => {
      setOptimisticPicked(next)
      router.replace(query ? `?${query}` : '?', { scroll: false })
    })
  }

  return (
    <Button
      variant={isPicked ? 'outline' : 'primary'}
      onClick={commit}
      loading={pending}
    >
      {isPicked ? 'Remove from shopping list' : 'Add to shopping list'}
    </Button>
  )
}
