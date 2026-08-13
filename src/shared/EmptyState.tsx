import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  message: string
  children?: ReactNode
  className?: string
}

/** Dashed-border "nothing here yet" box, optionally paired with an action. */
export function EmptyState({ message, children, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'max-w-xl border-2 border-dashed border-ink-35 p-6 text-center sm:p-10',
        className,
      )}
    >
      <p className="mb-3 font-display text-2xl">［ ］</p>
      <p className={cn('font-mono text-ink-60 text-xs', children && 'mb-4')}>
        {message}
      </p>
      {children}
    </div>
  )
}
