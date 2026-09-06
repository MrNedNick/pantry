'use client'

import { Button } from '@/components/button/button'

const STORAGE_KEY = 'pantry:theme'

/**
 * The inline script in the layout puts `light` or `dark` on <html> before first
 * paint, so which icon to show is already decided by CSS. That leaves this with
 * no state of its own: no effect, no hydration mismatch, and the accessible
 * name stays correct because both labels are in the markup and the wrong one is
 * hidden along with its icon.
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement
    const next = root.classList.contains('dark') ? 'light' : 'dark'
    root.classList.toggle('dark', next === 'dark')
    root.classList.toggle('light', next === 'light')
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage blocked — the theme still applies, it just won't be remembered */
    }
  }

  return (
    <Button variant="outline" size="md" onClick={toggle} className="w-10 px-0">
      <span className="dark:hidden">
        <span aria-hidden="true">☾</span>
        <span className="sr-only">Switch to dark theme</span>
      </span>
      <span className="hidden dark:inline">
        <span aria-hidden="true">☀</span>
        <span className="sr-only">Switch to light theme</span>
      </span>
    </Button>
  )
}
