import { Container } from '@/components/site/container'
import { site } from '@/content/site'

/**
 * The one section aimed at someone reading the project rather than cooking
 * from it: where the work happens and why the page behaves the way it does.
 */
export function UnderTheHood() {
  const { underTheHood } = site

  return (
    <section
      id="under-the-hood"
      aria-labelledby="under-the-hood-heading"
      className="scroll-mt-20 border-t border-border bg-surface-raised py-14 sm:py-20"
    >
      <Container>
        <h2
          id="under-the-hood-heading"
          className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
        >
          {underTheHood.title}
        </h2>
        <p className="mt-3 max-w-2xl text-pretty text-text-muted">
          {underTheHood.intro}
        </p>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {underTheHood.items.map((item) => (
            <li
              key={item.title}
              className="min-w-0 rounded-lg border border-border bg-surface p-5"
            >
              <h3 className="text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-pretty text-text-muted">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
