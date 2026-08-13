import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/** Bordered section wrapper for grouped settings/content blocks. */
export function Panel({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col items-start gap-3 border-[3px] border-ink bg-surface p-5',
        className,
      )}
      {...props}
    />
  )
}
