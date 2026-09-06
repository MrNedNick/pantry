import Link from 'next/link'
import { site } from '@/content/site'
import { Container } from '@/components/site/container'
import { ThemeToggle } from '@/components/site/theme-toggle'

/**
 * Server component — the only thing here that needs the browser is the theme
 * button, and that ships as its own small client island.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-baseline gap-2 rounded-sm text-base font-semibold tracking-tight text-text"
        >
          {site.name}
          <span className="hidden text-sm font-normal text-text-muted sm:inline">
            {site.tagline}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href={site.repo}
            className="rounded-md px-2 py-1 text-sm text-text-muted transition-colors hover:bg-surface-raised hover:text-text"
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  )
}
