import { site } from '@/content/site'
import { Container } from '@/components/site/container'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border py-8 text-sm text-text-muted">
      <Container className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          {site.name} — {site.tagline.toLowerCase()}.
        </p>
        <nav aria-label="Project links" className="flex flex-wrap gap-4">
          <a className="rounded-sm hover:text-text" href={site.repo}>
            GitHub
          </a>
          <a className="rounded-sm hover:text-text" href={site.readme}>
            README
          </a>
          {site.demo ? (
            <a className="rounded-sm hover:text-text" href={site.demo}>
              Live demo
            </a>
          ) : null}
        </nav>
      </Container>
    </footer>
  )
}
