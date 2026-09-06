import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Container } from '@/components/site/container'
import { Badge } from '@/components/badge/badge'
import { BackToResults } from '@/components/pantry/back-to-results'
import { PantryAwareIngredients } from '@/components/pantry/pantry-aware-ingredients'
import { PickRecipeButton } from '@/components/pantry/pick-recipe-button'
import { site } from '@/content/site'
import { getKitchenSlugs, getRecipeBySlug } from '@/lib/pantry/source'

/**
 * Rebuild an hour after a request finds the page stale. The recipe text barely
 * changes, so serving a cached copy and refreshing it in the background beats
 * rendering it per visit.
 */
export const revalidate = 3600

/** A slug that was not pre-rendered — a remote recipe — is rendered on demand. */
export const dynamicParams = true

/*
 * There is deliberately no `loading.tsx` for this route. A loading boundary
 * flushes the shell before the page has looked the recipe up, and once the
 * shell is out the status is fixed at 200 — an unknown slug would answer OK
 * and only then paint "no such recipe". The lookup here is a local array or a
 * cached fetch, so the boundary bought little and cost the status code.
 */

/**
 * Only the recipes that ship with the app are known at build time. The remote
 * ones are not pre-rendered on purpose: the build should not depend on someone
 * else's API being up.
 */
export function generateStaticParams() {
  return getKitchenSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const recipe = await getRecipeBySlug(slug)
  if (!recipe) return { title: 'Recipe not found' }
  return {
    title: recipe.title,
    description: recipe.summary,
    // Only once there is an origin to resolve it against — a canonical
    // pointing at localhost is worse than none.
    alternates: site.demo ? { canonical: `/recipes/${recipe.slug}` } : undefined,
  }
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const recipe = await getRecipeBySlug(slug)
  if (!recipe) notFound()

  return (
    <main id="main">
      <Container className="py-10 sm:py-14">
        <Suspense
          fallback={<span className="text-sm text-text-muted">← Back to the list</span>}
        >
          <BackToResults />
        </Suspense>

        <header className="mt-4">
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {recipe.title}
          </h1>
          <p className="mt-3 max-w-prose text-text-muted">{recipe.summary}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge tone="accent">{recipe.minutes} min</Badge>
            <Badge>serves {recipe.servings}</Badge>
            {recipe.tags.slice(0, 3).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          <section aria-labelledby="ingredients-heading">
            <h2
              id="ingredients-heading"
              className="mb-3 text-lg font-semibold tracking-tight"
            >
              Ingredients
            </h2>
            <Suspense
              fallback={
                <p className="text-sm text-text-muted">Loading your pantry…</p>
              }
            >
              <PantryAwareIngredients ingredients={recipe.ingredients} />
            </Suspense>
            <div className="mt-6">
              <Suspense fallback={null}>
                <PickRecipeButton slug={recipe.slug} />
              </Suspense>
            </div>
          </section>

          <section aria-labelledby="method-heading">
            <h2
              id="method-heading"
              className="mb-3 text-lg font-semibold tracking-tight"
            >
              Method
            </h2>
            <ol className="space-y-4">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-raised text-xs font-medium text-text-muted"
                  >
                    {index + 1}
                  </span>
                  <p className="max-w-prose">{step}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-xs text-text-muted">
              {recipe.source === 'kitchen'
                ? 'From the recipe set that ships with this app.'
                : 'Recipe text from TheMealDB, an open recipe database.'}
            </p>
          </section>
        </div>
      </Container>
    </main>
  )
}
