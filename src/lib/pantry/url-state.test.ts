import { describe, expect, it } from 'vitest'
import { buildQuery, parseHave, parsePicked, parseShowAll, toggle } from './url-state'

describe('parseHave', () => {
  it('reads a shared link back into a pantry', () => {
    expect(parseHave({ have: 'egg,pasta,parmesan' })).toEqual([
      'egg',
      'parmesan',
      'pasta',
    ])
  })

  it('drops ids that are not in the catalogue', () => {
    expect(parseHave({ have: 'egg,unicorn-steak' })).toEqual(['egg'])
  })

  it('treats a missing or empty parameter as an empty pantry', () => {
    expect(parseHave({})).toEqual([])
    expect(parseHave({ have: '' })).toEqual([])
  })
})

describe('parsePicked', () => {
  it('keeps slug-shaped values and drops anything else', () => {
    expect(parsePicked({ picked: 'weeknight-carbonara,<script>' })).toEqual([
      'weeknight-carbonara',
    ])
  })
})

describe('buildQuery', () => {
  it('round-trips a pantry and a selection', () => {
    const query = buildQuery(['pasta', 'egg'], ['weeknight-carbonara'])
    const params = Object.fromEntries(new URLSearchParams(query))

    expect(parseHave(params)).toEqual(['egg', 'pasta'])
    expect(parsePicked(params)).toEqual(['weeknight-carbonara'])
  })

  it('stays empty when there is nothing to share', () => {
    expect(buildQuery([], [])).toBe('')
  })

  it('carries the show-all flag when asked', () => {
    const query = buildQuery(['egg'], [], true)
    expect(parseShowAll(Object.fromEntries(new URLSearchParams(query)))).toBe(
      true,
    )
  })
})

describe('parseShowAll', () => {
  it('only recognises the exact value', () => {
    expect(parseShowAll({ show: 'all' })).toBe(true)
    expect(parseShowAll({ show: 'true' })).toBe(false)
    expect(parseShowAll({})).toBe(false)
  })
})

describe('toggle', () => {
  it('adds a value that is not there and removes one that is', () => {
    expect(toggle(['egg'], 'pasta')).toEqual(['egg', 'pasta'])
    expect(toggle(['egg', 'pasta'], 'egg')).toEqual(['pasta'])
  })
})
