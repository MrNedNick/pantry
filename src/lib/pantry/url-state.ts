import { INGREDIENTS_BY_ID } from '@/data/ingredients'

export const HAVE_PARAM = 'have'
export const PICKED_PARAM = 'picked'

/** Raw `searchParams` as Next hands them to a page. */
export type RawSearchParams = Record<string, string | string[] | undefined>

function toList(value: string | string[] | undefined): string[] {
  if (!value) return []
  const parts = Array.isArray(value) ? value : [value]
  return parts.flatMap((part) => part.split(',')).map((part) => part.trim())
}

/**
 * Ingredient ids from the URL, filtered against the catalogue so a hand-edited
 * link can never inject anything unknown, de-duplicated and ordered.
 */
export function parseHave(params: RawSearchParams): string[] {
  const seen = new Set<string>()
  for (const id of toList(params[HAVE_PARAM])) {
    if (INGREDIENTS_BY_ID.has(id)) seen.add(id)
  }
  return [...seen].sort()
}

/** Recipe slugs from the URL. Validated against real recipes by the caller. */
export function parsePicked(params: RawSearchParams): string[] {
  const seen = new Set<string>()
  for (const slug of toList(params[PICKED_PARAM])) {
    if (/^[a-z0-9-]{2,80}$/.test(slug)) seen.add(slug)
  }
  return [...seen]
}

/** Builds the querystring for a given pantry and selection. */
export function buildQuery(have: readonly string[], picked: readonly string[]): string {
  const params = new URLSearchParams()
  if (have.length > 0) params.set(HAVE_PARAM, [...have].sort().join(','))
  if (picked.length > 0) params.set(PICKED_PARAM, [...picked].join(','))
  const query = params.toString()
  return query ? `?${query}` : ''
}

export function toggle(list: readonly string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value]
}
