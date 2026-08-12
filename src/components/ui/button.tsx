import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Reskinned to the neubrutalist system in design-system.html's `.btn` —
 * 3px border, hard offset shadow, lift on hover, press into the shadow on
 * active. CLAUDE.md §2: shadcn is "owned source," reskinned freely.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-1.5 border-[3px] border-ink bg-surface px-5 py-3 font-display text-xs tracking-wide text-ink uppercase whitespace-nowrap shadow-sm transition-all duration-150 ease-out outline-none select-none hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md active:translate-x-1 active:translate-y-1 active:shadow-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-ink text-surface',
        violet: 'bg-violet text-surface',
        cyan: 'bg-cyan text-ink',
        outline: 'bg-surface text-ink',
        ghost:
          'border-transparent shadow-none hover:border-ink hover:shadow-sm',
        destructive: 'bg-pink text-ink',
        link: 'border-transparent normal-case shadow-none text-primary underline-offset-4 hover:no-underline hover:shadow-none active:translate-0',
      },
      size: {
        default: '',
        sm: 'px-3.5 py-2 text-[10px]',
        lg: 'px-6 py-4',
        icon: 'size-9 p-0',
        'icon-sm': 'size-7 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
