/**
 * The main scenario, driven through the same seams the app uses: the pantry
 * and the selection live in the URL, so ticking a box has to end up in the
 * querystring, and the link that gets shared has to carry both.
 */
import { useSyncExternalStore } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

/** Stands in for the address bar: the fake router writes here, the page reads. */
const url = { params: new URLSearchParams(), version: 0 }
const listeners = new Set<() => void>()

function navigate(href: string) {
  url.params = new URLSearchParams(href.split('?')[1] ?? '')
  url.version += 1
  for (const listener of listeners) listener()
}

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: navigate, push: navigate, refresh: () => {} }),
  useSearchParams: () => url.params,
}))

const { IngredientPicker } = await import('./ingredient-picker')
const { PickRecipeButton } = await import('./pick-recipe-button')
const { ShareLink } = await import('./share-link')
const { parseHave, parsePicked } = await import('@/lib/pantry/url-state')

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/**
 * What the server does on every request: read the URL, hand the parsed pantry
 * to the picker. Re-rendering on a URL change is the round trip.
 */
function Page() {
  useSyncExternalStore(
    subscribe,
    () => url.version,
    () => 0,
  )
  const params = Object.fromEntries(url.params)

  return (
    <>
      <IngredientPicker have={parseHave(params)} />
      <PickRecipeButton slug="weeknight-carbonara" />
      <ShareLink />
      <output data-testid="picked">{parsePicked(params).join(',')}</output>
    </>
  )
}

/** jsdom exposes `navigator.clipboard` as a getter, so it has to be redefined. */
function stubClipboard(writeText: () => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  })
}

beforeEach(() => {
  url.params = new URLSearchParams()
  url.version = 0
})

describe('cooking from what you have', () => {
  it('puts what you tick into the shareable URL', async () => {
    const user = userEvent.setup()
    render(<Page />)

    await user.click(screen.getByRole('checkbox', { name: 'Eggs' }))
    await user.click(screen.getByRole('checkbox', { name: 'Pasta' }))

    expect(url.params.get('have')).toBe('egg,pasta')
    expect(screen.getByRole('checkbox', { name: 'Eggs' })).toBeChecked()
    expect(screen.getByText('2 ticked')).toBeInTheDocument()
  })

  it('takes an ingredient back out when it is unticked', async () => {
    const user = userEvent.setup()
    render(<Page />)

    await user.click(screen.getByRole('checkbox', { name: 'Eggs' }))
    await user.click(screen.getByRole('checkbox', { name: 'Eggs' }))

    expect(url.params.get('have')).toBe('')
    expect(screen.getByText('Nothing ticked yet')).toBeInTheDocument()
  })

  it('is fully operable from the keyboard', async () => {
    const user = userEvent.setup()
    render(<Page />)

    screen.getByRole('checkbox', { name: 'Eggs' }).focus()
    await user.keyboard(' ')

    expect(url.params.get('have')).toBe('egg')
  })

  it('empties the pantry when the kitchen is cleared', async () => {
    const user = userEvent.setup()
    render(<Page />)

    await user.click(screen.getByRole('checkbox', { name: 'Eggs' }))
    await user.click(screen.getByRole('button', { name: 'Clear pantry' }))

    expect(url.params.get('have')).toBe('')
  })

  it('finds an ingredient by name and says so when nothing matches', async () => {
    const user = userEvent.setup()
    render(<Page />)

    await user.type(screen.getByLabelText('Find an ingredient'), 'parme')
    expect(screen.getByRole('checkbox', { name: 'Parmesan' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'Pasta' })).not.toBeInTheDocument()

    await user.clear(screen.getByLabelText('Find an ingredient'))
    await user.type(screen.getByLabelText('Find an ingredient'), 'unicorn')
    expect(screen.getByText(/Nothing matches/)).toBeInTheDocument()
  })

  it('adds a recipe to the shopping selection and takes it back out', async () => {
    const user = userEvent.setup()
    render(<Page />)

    await user.click(screen.getByRole('button', { name: 'Add to shopping list' }))
    expect(url.params.get('picked')).toBe('weeknight-carbonara')
    expect(screen.getByTestId('picked')).toHaveTextContent('weeknight-carbonara')

    await user.click(
      screen.getByRole('button', { name: 'Remove from shopping list' }),
    )
    expect(url.params.get('picked')).toBeNull()
  })

  it('keeps the pantry when a recipe is picked, so the link carries both', async () => {
    const user = userEvent.setup()
    render(<Page />)

    await user.click(screen.getByRole('checkbox', { name: 'Eggs' }))
    await user.click(screen.getByRole('button', { name: 'Add to shopping list' }))

    expect(url.params.get('have')).toBe('egg')
    expect(url.params.get('picked')).toBe('weeknight-carbonara')
  })

  it('shares the selection by copying the address', async () => {
    const user = userEvent.setup()
    // After `setup`, which installs a clipboard stub of its own.
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubClipboard(writeText)
    render(<Page />)

    await user.click(screen.getByRole('button', { name: 'Copy link to this list' }))

    expect(writeText).toHaveBeenCalledWith(window.location.href)
    expect(screen.getByText(/Copied\./)).toBeInTheDocument()
  })

  it('says so when the clipboard is not available', async () => {
    const user = userEvent.setup()
    stubClipboard(vi.fn().mockRejectedValue(new Error('denied')))
    render(<Page />)

    await user.click(screen.getByRole('button', { name: 'Copy link to this list' }))

    expect(screen.getByText(/copy the address bar instead/)).toBeInTheDocument()
  })
})
