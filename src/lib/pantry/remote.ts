import type { Recipe, RecipeIngredient, Unit } from '@/lib/pantry/types'
import { resolveIngredientId } from '@/lib/pantry/ingredient-names'

const BASE = 'https://www.themealdb.com/api/json/v1/1'

/** Letters to pull. Two is plenty for a demo and keeps the request small. */
const LETTERS = ['c', 's'] as const

/** A remote recipe is only useful if most of it lands in our catalogue. */
const MIN_MAPPED_RATIO = 0.7
const MAX_REMOTE_RECIPES = 16

interface RawMeal {
  idMeal: string
  strMeal: string
  strCategory: string | null
  strArea: string | null
  strInstructions: string | null
  [key: string]: string | null
}

/** "2 tbsp", "400g", "1 clove", "" — turned into something we can add up. */
function parseMeasure(measure: string): { amount: number; unit: Unit } {
  const text = measure.trim().toLowerCase()
  const amountMatch = text.match(/(\d+(?:[.,]\d+)?)(?:\s*\/\s*(\d+))?/)
  let amount = 1
  if (amountMatch) {
    const whole = Number(amountMatch[1].replace(',', '.'))
    amount = amountMatch[2] ? whole / Number(amountMatch[2]) : whole
  }
  if (!Number.isFinite(amount) || amount <= 0) amount = 1

  const unit: Unit = /\bml\b|\blitre|\bcup|\bpint/.test(text)
    ? 'ml'
    : /\bg\b|gram|\bkg\b|\boz\b|\blb\b/.test(text)
      ? 'g'
      : /tbsp|tablespoon/.test(text)
        ? 'tbsp'
        : /tsp|teaspoon/.test(text)
          ? 'tsp'
          : /clove/.test(text)
            ? 'clove'
            : /pinch|dash/.test(text)
              ? 'pinch'
              : 'piece'

  return { amount: Math.round(amount * 100) / 100, unit }
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

function toRecipe(meal: RawMeal): Recipe | null {
  const ingredients: RecipeIngredient[] = []
  let named = 0

  for (let i = 1; i <= 20; i += 1) {
    const name = (meal[`strIngredient${i}`] ?? '').trim()
    if (!name) continue
    named += 1
    const id = resolveIngredientId(name)
    if (!id) continue
    if (ingredients.some((existing) => existing.id === id)) continue
    const { amount, unit } = parseMeasure(meal[`strMeasure${i}`] ?? '')
    ingredients.push({ id, amount, unit })
  }

  if (named === 0 || ingredients.length / named < MIN_MAPPED_RATIO) return null
  if (ingredients.length < 3) return null

  const steps = (meal.strInstructions ?? '')
    .split(/\r?\n+/)
    .map((line) => line.replace(/^\s*(step\s*)?\d+[.)]?\s*/i, '').trim())
    .filter((line) => line.length > 12)
    .slice(0, 8)

  if (steps.length === 0) return null

  const area = meal.strArea?.trim()
  const category = meal.strCategory?.trim()

  return {
    id: `themealdb-${meal.idMeal}`,
    slug: slugify(meal.strMeal),
    title: meal.strMeal.trim(),
    summary: [area, category].filter(Boolean).join(' · ') || 'From the open recipe database.',
    // The source carries no timing, so this is an estimate from the step count
    // rather than a number pretending to be exact.
    minutes: Math.min(90, 15 + steps.length * 8),
    servings: 4,
    tags: [category, area].filter((t): t is string => Boolean(t)).map((t) => t.toLowerCase()),
    ingredients,
    steps,
    source: 'themealdb',
  }
}

/**
 * Second source of recipes. Cached by the framework for an hour; a failure is
 * not fatal — the kitchen set alone is a working app.
 */
export async function fetchRemoteRecipes(): Promise<Recipe[]> {
  const results = await Promise.allSettled(
    LETTERS.map((letter) =>
      fetch(`${BASE}/search.php?f=${letter}`, {
        next: { revalidate: 3600, tags: ['recipes'] },
      }).then((response) => {
        if (!response.ok) throw new Error(`themealdb responded ${response.status}`)
        return response.json() as Promise<{ meals: RawMeal[] | null }>
      }),
    ),
  )

  const recipes: Recipe[] = []
  const seenSlugs = new Set<string>()

  for (const result of results) {
    if (result.status !== 'fulfilled') continue
    for (const meal of result.value.meals ?? []) {
      const recipe = toRecipe(meal)
      if (!recipe || seenSlugs.has(recipe.slug)) continue
      seenSlugs.add(recipe.slug)
      recipes.push(recipe)
      if (recipes.length >= MAX_REMOTE_RECIPES) return recipes
    }
  }

  return recipes
}
