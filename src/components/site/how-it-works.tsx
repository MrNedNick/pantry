import { Container } from '@/components/site/container'
import { site } from '@/content/site'

export function HowItWorks() {
  const { howItWorks } = site

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="scroll-mt-20 border-t border-border py-14 sm:py-20"
    >
      <Container>
        <h2
          id="how-it-works-heading"
          className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
        >
          {howItWorks.title}
        </h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-3">
          {howItWorks.steps.map((step, index) => (
            <li key={step.title} className="min-w-0">
              <span
                aria-hidden="true"
                className="flex size-9 items-center justify-center rounded-full bg-surface-raised text-sm font-semibold text-accent"
              >
                {index + 1}
              </span>
              <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-pretty text-text-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
