'use client'

import { Button } from '@/components/button/button'
import { Container } from '@/components/site/container'

/**
 * Route-level error boundary. It says what failed and offers the one action
 * that can help — trying again — instead of an empty screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main id="main">
      <Container className="py-16">
        <h1 className="text-2xl font-semibold tracking-tight">
          The recipe list did not load
        </h1>
        <p className="mt-3 max-w-prose text-text-muted">
          Something went wrong while putting this page together. Your pantry is
          in the address bar, so nothing you ticked is lost — trying again is
          usually enough.
        </p>
        {error.digest ? (
          <p className="mt-2 text-xs text-text-muted">
            Reference: <code className="font-mono">{error.digest}</code>
          </p>
        ) : null}
        <div className="mt-6">
          <Button onClick={reset}>Try again</Button>
        </div>
      </Container>
    </main>
  )
}
