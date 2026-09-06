import { Container } from '@/components/site/container'

export default function HomePage() {
  return (
    <main id="main">
      <Container className="py-12 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Cook from what you already have
        </h1>
        <p className="mt-4 max-w-prose text-text-muted">
          Tick off what is in your kitchen. The list comes back sorted by how
          little is missing, so the thing you can cook tonight is at the top.
        </p>
      </Container>
    </main>
  )
}
