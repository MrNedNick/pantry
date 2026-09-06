import type { RecipeIngredient } from '@/lib/pantry/types'

const UNIT_LABELS: Record<RecipeIngredient['unit'], string> = {
  g: 'g',
  ml: 'ml',
  tbsp: 'tbsp',
  tsp: 'tsp',
  piece: '',
  clove: 'clove',
  pinch: 'pinch',
}

/** "200 g", "3 ×", "1 clove" — used by the recipe page and the shopping list. */
export function formatAmount(item: {
  amount: number
  unit: RecipeIngredient['unit']
}): string {
  const unit = UNIT_LABELS[item.unit]
  const amount = Number.isInteger(item.amount)
    ? String(item.amount)
    : item.amount.toFixed(2).replace(/\.?0+$/, '')
  return unit ? `${amount} ${unit}` : `${amount} ×`
}
