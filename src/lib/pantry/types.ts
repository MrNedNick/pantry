/** Units are deliberately few — enough to add up a shopping list, no more. */
export type Unit = 'g' | 'ml' | 'tbsp' | 'tsp' | 'piece' | 'clove' | 'pinch'

export type IngredientCategory =
  | 'staples'
  | 'vegetables'
  | 'dairy-and-eggs'
  | 'protein'
  | 'herbs-and-spices'
  | 'extras'

export interface Ingredient {
  id: string
  name: string
  category: IngredientCategory
}

export interface RecipeIngredient {
  id: string
  amount: number
  unit: Unit
  /** Nice to have — never counts against a recipe when it is missing. */
  optional?: boolean
}

export interface Recipe {
  id: string
  slug: string
  title: string
  summary: string
  minutes: number
  servings: number
  tags: string[]
  ingredients: RecipeIngredient[]
  steps: string[]
  /** Where the record came from, so the UI can be honest about it. */
  source: 'kitchen' | 'themealdb'
}

/** A recipe scored against one particular pantry. */
export interface MatchedRecipe {
  recipe: Recipe
  /** Required ingredients the pantry does not have. */
  missing: RecipeIngredient[]
  /** Required ingredients the pantry does have. */
  have: RecipeIngredient[]
  /** Optional extras that are missing — shown, but never held against it. */
  missingOptional: RecipeIngredient[]
}

export interface ShoppingLine {
  ingredient: Ingredient
  amount: number
  unit: Unit
  /** Titles of the picked recipes that need this line. */
  recipes: string[]
}
