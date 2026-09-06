'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { HAVE_PARAM } from '@/lib/pantry/url-state'

const STORAGE_KEY = 'pantry:have'

function read(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function write(value: string) {
  try {
    if (value) window.localStorage.setItem(STORAGE_KEY, value)
    else window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* storage blocked — the URL still holds the pantry, it just won't be remembered */
  }
}

/**
 * The URL is the source of truth for the pantry: that is what makes a
 * selection shareable and what lets the server do the filtering. This keeps a
 * copy in local storage so coming back to a bare link restores the last
 * pantry instead of an empty one.
 *
 * A link that already carries `have` always wins — opening someone else's
 * selection must show their pantry, not yours.
 */
export function PantryPersistence() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromUrl = searchParams.get(HAVE_PARAM) ?? ''

  useEffect(() => {
    if (fromUrl) {
      write(fromUrl)
      return
    }

    // Nothing in the URL. Restore the remembered pantry, once.
    if (searchParams.has(HAVE_PARAM)) {
      // `?have=` explicitly empty means "I cleared it" — respect that.
      write('')
      return
    }

    const stored = read()
    if (!stored) return

    const next = new URLSearchParams(searchParams.toString())
    next.set(HAVE_PARAM, stored)
    router.replace(`/?${next.toString()}`, { scroll: false })
  }, [fromUrl, router, searchParams])

  return null
}
