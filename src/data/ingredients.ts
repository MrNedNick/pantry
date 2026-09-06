import type { Ingredient, IngredientCategory } from '@/lib/pantry/types'

export const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  staples: 'Staples',
  vegetables: 'Vegetables & fruit',
  'dairy-and-eggs': 'Dairy & eggs',
  protein: 'Protein',
  'herbs-and-spices': 'Herbs & spices',
  extras: 'Extras',
}

/** The catalogue the picker is built from. Recipes may only use these ids. */
export const INGREDIENTS: Ingredient[] = [
  // staples
  { id: 'flour', name: 'Plain flour', category: 'staples' },
  { id: 'pasta', name: 'Pasta', category: 'staples' },
  { id: 'rice', name: 'Rice', category: 'staples' },
  { id: 'bread', name: 'Bread', category: 'staples' },
  { id: 'potato', name: 'Potatoes', category: 'staples' },
  { id: 'oats', name: 'Rolled oats', category: 'staples' },
  { id: 'chickpeas', name: 'Chickpeas', category: 'staples' },
  { id: 'lentils', name: 'Red lentils', category: 'staples' },
  { id: 'canned-tomatoes', name: 'Canned tomatoes', category: 'staples' },
  { id: 'coconut-milk', name: 'Coconut milk', category: 'staples' },
  { id: 'stock', name: 'Stock cube', category: 'staples' },
  { id: 'sugar', name: 'Sugar', category: 'staples' },
  { id: 'olive-oil', name: 'Olive oil', category: 'staples' },
  { id: 'soy-sauce', name: 'Soy sauce', category: 'staples' },
  { id: 'vinegar', name: 'Vinegar', category: 'staples' },
  { id: 'honey', name: 'Honey', category: 'staples' },
  { id: 'peanut-butter', name: 'Peanut butter', category: 'staples' },
  { id: 'baking-powder', name: 'Baking powder', category: 'staples' },

  // vegetables & fruit
  { id: 'onion', name: 'Onion', category: 'vegetables' },
  { id: 'garlic', name: 'Garlic', category: 'vegetables' },
  { id: 'carrot', name: 'Carrot', category: 'vegetables' },
  { id: 'tomato', name: 'Tomato', category: 'vegetables' },
  { id: 'bell-pepper', name: 'Bell pepper', category: 'vegetables' },
  { id: 'courgette', name: 'Courgette', category: 'vegetables' },
  { id: 'aubergine', name: 'Aubergine', category: 'vegetables' },
  { id: 'spinach', name: 'Spinach', category: 'vegetables' },
  { id: 'mushroom', name: 'Mushrooms', category: 'vegetables' },
  { id: 'cabbage', name: 'Cabbage', category: 'vegetables' },
  { id: 'cucumber', name: 'Cucumber', category: 'vegetables' },
  { id: 'lemon', name: 'Lemon', category: 'vegetables' },
  { id: 'lime', name: 'Lime', category: 'vegetables' },
  { id: 'banana', name: 'Banana', category: 'vegetables' },
  { id: 'apple', name: 'Apple', category: 'vegetables' },
  { id: 'spring-onion', name: 'Spring onion', category: 'vegetables' },

  // dairy & eggs
  { id: 'egg', name: 'Eggs', category: 'dairy-and-eggs' },
  { id: 'milk', name: 'Milk', category: 'dairy-and-eggs' },
  { id: 'butter', name: 'Butter', category: 'dairy-and-eggs' },
  { id: 'yoghurt', name: 'Yoghurt', category: 'dairy-and-eggs' },
  { id: 'cheddar', name: 'Cheddar', category: 'dairy-and-eggs' },
  { id: 'parmesan', name: 'Parmesan', category: 'dairy-and-eggs' },
  { id: 'feta', name: 'Feta', category: 'dairy-and-eggs' },
  { id: 'cream', name: 'Cream', category: 'dairy-and-eggs' },

  // protein
  { id: 'chicken-thigh', name: 'Chicken thighs', category: 'protein' },
  { id: 'chicken-breast', name: 'Chicken breast', category: 'protein' },
  { id: 'minced-beef', name: 'Minced beef', category: 'protein' },
  { id: 'bacon', name: 'Bacon', category: 'protein' },
  { id: 'white-fish', name: 'White fish', category: 'protein' },
  { id: 'tuna', name: 'Canned tuna', category: 'protein' },
  { id: 'tofu', name: 'Tofu', category: 'protein' },
  { id: 'prawns', name: 'Prawns', category: 'protein' },

  // herbs & spices
  { id: 'salt', name: 'Salt', category: 'herbs-and-spices' },
  { id: 'pepper', name: 'Black pepper', category: 'herbs-and-spices' },
  { id: 'paprika', name: 'Paprika', category: 'herbs-and-spices' },
  { id: 'cumin', name: 'Cumin', category: 'herbs-and-spices' },
  { id: 'curry-powder', name: 'Curry powder', category: 'herbs-and-spices' },
  { id: 'chilli-flakes', name: 'Chilli flakes', category: 'herbs-and-spices' },
  { id: 'oregano', name: 'Oregano', category: 'herbs-and-spices' },
  { id: 'basil', name: 'Basil', category: 'herbs-and-spices' },
  { id: 'parsley', name: 'Parsley', category: 'herbs-and-spices' },
  { id: 'coriander', name: 'Coriander', category: 'herbs-and-spices' },
  { id: 'ginger', name: 'Ginger', category: 'herbs-and-spices' },
  { id: 'cinnamon', name: 'Cinnamon', category: 'herbs-and-spices' },

  // extras
  { id: 'walnuts', name: 'Walnuts', category: 'extras' },
  { id: 'raisins', name: 'Raisins', category: 'extras' },
  { id: 'olives', name: 'Olives', category: 'extras' },
  { id: 'sesame-seeds', name: 'Sesame seeds', category: 'extras' },
  { id: 'dark-chocolate', name: 'Dark chocolate', category: 'extras' },
]

export const INGREDIENTS_BY_ID = new Map(INGREDIENTS.map((i) => [i.id, i]))

/** Catalogue grouped for the picker, in the order the categories are listed. */
export const INGREDIENTS_BY_CATEGORY = (
  Object.keys(CATEGORY_LABELS) as IngredientCategory[]
).map((category) => ({
  category,
  label: CATEGORY_LABELS[category],
  items: INGREDIENTS.filter((i) => i.category === category),
}))
