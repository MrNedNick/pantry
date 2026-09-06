import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Keeps every section on the same measure instead of stretching to 1440px. */
export function Container({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mx-auto w-full max-w-5xl px-4 sm:px-6', className)}>
      {children}
    </div>
  )
}
