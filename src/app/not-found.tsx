import Link from 'next/link'
import { Container } from '@/components/site/container'

export default function NotFound() {
  return (
    <main id="main">
      <Container className="py-16">
        <h1 className="text-2xl font-semibold tracking-tight">
          No such recipe
        </h1>
        <p className="mt-3 max-w-prose text-text-muted">
          That address does not match anything in the recipe set. It may have
          been a remote recipe that is no longer published.
        </p>
        <p className="mt-6">
          <Link
            href="/"
            className="rounded-sm font-medium text-accent hover:underline"
          >
            Back to the recipe list
          </Link>
        </p>
      </Container>
    </main>
  )
}
