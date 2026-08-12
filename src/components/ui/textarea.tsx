import type * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-17.5 w-full resize-y border-[3px] border-ink bg-surface px-3.5 py-3 font-mono text-sm text-ink transition-shadow outline-none placeholder:text-ink-35 focus-visible:shadow-[4px_4px_0_var(--color-violet)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
