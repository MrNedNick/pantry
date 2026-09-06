'use client'

import { Component, Suspense, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/button/button'

/**
 * Second line of defence, for errors thrown while rendering on the client.
 *
 * It cannot help with a *server* component that throws mid-stream: React
 * responds to that by trying to re-render the boundary's children in the
 * browser, and a server component has no client version to fall back to, so
 * the skeleton would simply stay up forever. That case is handled where it
 * happens — each streamed section catches its own failure and returns
 * `SectionFailure` as ordinary content (see `recipe-list.tsx`).
 */
class SectionErrorBoundary extends Component<
  { children: ReactNode; fallback: (retry: () => void) => ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return this.props.fallback(() => this.setState({ failed: false }))
  }
}

/**
 * The visible failure state for one section: says what broke, keeps the rest
 * of the page usable, and offers the one action that helps.
 */
export function SectionFailure({
  label,
  retry,
}: {
  label: string
  retry?: () => void
}) {
  const router = useRouter()

  return (
    <div
      role="alert"
      className="rounded-lg border border-danger/40 bg-danger/5 p-5"
    >
      <p className="font-medium">{label} could not be loaded.</p>
      <p className="mt-1 text-sm text-text-muted">
        The rest of the page is fine, and your pantry is still in the address
        bar. This is usually a hiccup at the recipe source.
      </p>
      <div className="mt-4">
        <Button
          variant="outline"
          onClick={() => {
            retry?.()
            router.refresh()
          }}
        >
          Try again
        </Button>
      </div>
    </div>
  )
}

/**
 * One streamed section: a skeleton while it loads, an inline error with a
 * retry if it fails.
 */
export function SectionBoundary({
  label,
  skeleton,
  children,
}: {
  label: string
  skeleton: ReactNode
  children: ReactNode
}) {
  return (
    <SectionErrorBoundary
      fallback={(retry) => <SectionFailure label={label} retry={retry} />}
    >
      <Suspense fallback={skeleton}>{children}</Suspense>
    </SectionErrorBoundary>
  )
}
