'use client'

import { useState } from 'react'
import { Button } from '@/components/button/button'

/**
 * The whole selection already lives in the querystring, so sharing is just
 * handing over the current URL — there is nothing to save on a server.
 */
export function ShareLink() {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setState('copied')
    } catch {
      setState('failed')
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" onClick={copy}>
        Copy link to this list
      </Button>
      <p aria-live="polite" className="text-sm text-text-muted">
        {state === 'copied'
          ? 'Copied. Anyone opening it sees the same pantry and the same recipes.'
          : state === 'failed'
            ? 'Could not reach the clipboard — copy the address bar instead.'
            : ''}
      </p>
    </div>
  )
}
