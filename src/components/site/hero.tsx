import { Container } from '@/components/site/container'
import { site } from '@/content/site'

/**
 * Server component — the page's only job above the fold is to say what this is
 * and drop you into the picker, so there is nothing here the browser has to run.
 */
export function Hero() {
  const { hero } = site

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* A gradient instead of a hero image: nothing to download, nothing to shift. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-accent)_14%,transparent),transparent)]"
      />
      <Container className="relative py-14 sm:py-20">
        <p className="inline-flex rounded-full border border-border bg-surface-raised px-3 py-1 text-xs font-medium text-text-muted">
          {hero.eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {hero.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-pretty text-text-muted">
          {hero.subtitle}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={hero.primaryCta.href}
            className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-6 text-base font-medium text-white shadow-sm transition-colors hover:bg-accent-hover"
          >
            {hero.primaryCta.label}
          </a>
          <a
            href={hero.secondaryCta.href}
            className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-surface px-6 text-base font-medium transition-colors hover:bg-surface-raised"
          >
            {hero.secondaryCta.label}
          </a>
        </div>
        <p className="mt-5 max-w-xl text-sm text-text-muted">{hero.note}</p>
      </Container>
    </section>
  )
}
