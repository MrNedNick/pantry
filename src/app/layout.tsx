import type { Metadata } from 'next'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { site } from '@/content/site'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline.toLowerCase()}`,
    template: `%s — ${site.name}`,
  },
  description:
    'Tick off what is in your kitchen and see which recipes you can cook right now, sorted by how little is missing.',
}

/**
 * Applies the stored theme before first paint so the page never flashes the
 * wrong palette. Small enough to stay inline.
 */
const THEME_SCRIPT = `
try {
  var t = localStorage.getItem('pantry:theme');
  if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.classList.add(t);
} catch (e) {}
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh flex-col bg-surface text-text antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-surface focus:px-4 focus:py-2 focus:text-sm"
        >
          Skip to content
        </a>
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
