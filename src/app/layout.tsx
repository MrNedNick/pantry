import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pantry — cook from what you already have',
  description:
    'Tick off what is in your kitchen and see which recipes you can cook right now, sorted by how little is missing.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-surface text-text antialiased">
        {children}
      </body>
    </html>
  )
}
