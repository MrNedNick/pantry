'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

/** Keeps the pantry and the selection when going back to the list. */
export function BackToResults() {
  const searchParams = useSearchParams()
  const query = searchParams.toString()

  return (
    <Link
      href={query ? `/?${query}` : '/'}
      className="rounded-sm text-sm text-text-muted hover:text-text"
    >
      ← Back to the list
    </Link>
  )
}
