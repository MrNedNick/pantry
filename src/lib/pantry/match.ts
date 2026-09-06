import { INGREDIENTS_BY_ID } from '@/data/ingredients'
import type {
  MatchedRecipe,
  Recipe,
  RecipeIngredient,
  ShoppingLine,
} from '@/lib/pantry/types'

/**
 * Scores a recipe against a pantry. Optional ingredients are reported but
 * never counted as missing — a recipe is not out of reach because you have no
 * parsley.
 */
export function matchRecipe(recipe: Recipe, have: ReadonlySet<string>): MatchedRecipe {
  const missing: RecipeIngredient[] = []
  const found: RecipeIngredient[] = []
  const missingOptional: RecipeIngredient[] = []

  for (const ingredient of recipe.ingredients) {
    if (have.has(ingredient.id)) {
      found.push(ingredient)
    } else if (ingredient.optional) {
      missingOptional.push(ingredient)
    } else {
      missing.push(ingredient)
    }
  }

  return { recipe, missing, have: found, missingOptional }
}

/**
 * Fewest missing first, then quickest, then alphabetical so the order is
 * stable between requests.
 */
export function matchRecipes(
  recipes: readonly Recipe[],
  have: ReadonlySet<string>,
): MatchedRecipe[] {
  return recipes
    .map((recipe) => matchRecipe(recipe, have))
    .sort(
      (a, b) =>
        a.missing.length - b.missing.length ||
        a.recipe.minutes - b.recipe.minutes ||
        a.recipe.title.localeCompare(b.recipe.title),
    )
}

/**
 * What to buy for the picked recipes. Same ingredient in the same unit is one
 * line with the amounts added up; different units stay on separate lines
 * rather than being converted with a guess.
 */
export function buildShoppingList(
  picked: readonly Recipe[],
  have: ReadonlySet<string>,
): ShoppingLine[] {
  const lines = new Map<string, ShoppingLine>()

  for (const recipe of picked) {
    for (const item of recipe.ingredients) {
      if (item.optional || have.has(item.id)) continue
      const ingredient = INGREDIENTS_BY_ID.get(item.id)
      if (!ingredient) continue

      const key = `${item.id}:${item.unit}`
      const existing = lines.get(key)
      if (existing) {
        existing.amount = Math.round((existing.amount + item.amount) * 100) / 100
        if (!existing.recipes.includes(recipe.title)) {
          existing.recipes.push(recipe.title)
        }
      } else {
        lines.set(key, {
          ingredient,
          amount: item.amount,
          unit: item.unit,
          recipes: [recipe.title],
        })
      }
    }
  }

  return [...lines.values()].sort((a, b) =>
    a.ingredient.category === b.ingredient.category
      ? a.ingredient.name.localeCompare(b.ingredient.name)
      : a.ingredient.category.localeCompare(b.ingredient.category),
  )
}
