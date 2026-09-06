import { describe, expect, it } from 'vitest'
import { buildShoppingList, matchRecipe, matchRecipes } from './match'
import type { Recipe } from './types'

function recipe(over: Partial<Recipe> & Pick<Recipe, 'slug'>): Recipe {
  return {
    id: over.slug,
    title: over.slug,
    summary: 'A recipe.',
    minutes: 20,
    servings: 2,
    tags: [],
    ingredients: [],
    steps: ['Cook it.'],
    source: 'kitchen',
    ...over,
  }
}

const carbonara = recipe({
  slug: 'carbonara',
  title: 'Carbonara',
  minutes: 20,
  ingredients: [
    { id: 'pasta', amount: 200, unit: 'g' },
    { id: 'egg', amount: 2, unit: 'piece' },
    { id: 'parmesan', amount: 40, unit: 'g' },
    { id: 'parsley', amount: 1, unit: 'pinch', optional: true },
  ],
})

const omelette = recipe({
  slug: 'omelette',
  title: 'Omelette',
  minutes: 10,
  ingredients: [
    { id: 'egg', amount: 3, unit: 'piece' },
    { id: 'butter', amount: 10, unit: 'g' },
  ],
})

describe('matchRecipe', () => {
  it('splits a recipe into what you have and what you are missing', () => {
    const match = matchRecipe(carbonara, new Set(['pasta', 'egg']))

    expect(match.have.map((i) => i.id)).toEqual(['pasta', 'egg'])
    expect(match.missing.map((i) => i.id)).toEqual(['parmesan'])
  })

  it('never counts an optional ingredient as missing', () => {
    const match = matchRecipe(carbonara, new Set(['pasta', 'egg', 'parmesan']))

    expect(match.missing).toEqual([])
    expect(match.missingOptional.map((i) => i.id)).toEqual(['parsley'])
  })
})

describe('matchRecipes', () => {
  it('puts the smallest shopping trip first', () => {
    const sorted = matchRecipes([carbonara, omelette], new Set(['egg', 'butter']))

    expect(sorted.map((m) => m.recipe.slug)).toEqual(['omelette', 'carbonara'])
    expect(sorted[0].missing).toEqual([])
  })

  it('breaks a tie by cooking time, so the order does not wander', () => {
    const sorted = matchRecipes([carbonara, omelette], new Set())

    expect(sorted.map((m) => m.recipe.slug)).toEqual(['omelette', 'carbonara'])
  })
})

describe('buildShoppingList', () => {
  it('leaves out what the pantry already covers', () => {
    const lines = buildShoppingList([carbonara], new Set(['pasta', 'egg']))

    expect(lines.map((line) => line.ingredient.id)).toEqual(['parmesan'])
  })

  it('adds up the same ingredient across two recipes onto one line', () => {
    const lines = buildShoppingList([carbonara, omelette], new Set())
    const eggs = lines.find((line) => line.ingredient.id === 'egg')

    expect(eggs?.amount).toBe(5)
    expect(eggs?.recipes).toEqual(['Carbonara', 'Omelette'])
  })

  it('never buys an optional ingredient', () => {
    const lines = buildShoppingList([carbonara], new Set())

    expect(lines.map((line) => line.ingredient.id)).not.toContain('parsley')
  })
})
