import 'server-only'
import { cache } from 'react'
import { RECIPES } from '@/data/recipes'
import { fetchRemoteRecipes } from '@/lib/pantry/remote'
import type { Recipe } from '@/lib/pantry/types'

/**
 * The single place the rest of the app asks for recipes. Components never
 * touch a data file or `fetch` themselves.
 *
 * `cache` de-duplicates the call inside one render, so the page and the
 * streamed list below it share one result instead of asking twice.
 */
export interface RecipeData {
  recipes: Recipe[]
  /** False when the remote source could not be reached or returned nothing. */
  remoteOk: boolean
}

export const getRecipeData = cache(async (): Promise<RecipeData> => {
  const remote = await fetchRemoteRecipes().catch(() => null)
  const bySlug = new Map<string, Recipe>()
  for (const recipe of [...RECIPES, ...(remote ?? [])]) {
    if (!bySlug.has(recipe.slug)) bySlug.set(recipe.slug, recipe)
  }
  return { recipes: [...bySlug.values()], remoteOk: remote !== null }
})

export const getRecipes = cache(async (): Promise<Recipe[]> => {
  const { recipes } = await getRecipeData()
  return recipes
})

export const getRecipeBySlug = cache(
  async (slug: string): Promise<Recipe | undefined> => {
    const recipes = await getRecipes()
    return recipes.find((recipe) => recipe.slug === slug)
  },
)

/** Only the recipes that ship with the app get pre-rendered at build time. */
export function getKitchenSlugs(): string[] {
  return RECIPES.map((recipe) => recipe.slug)
}
