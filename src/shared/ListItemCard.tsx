import { cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/utils'

const listItemCardVariants = cva(
  'flex items-center justify-between border-[3px] border-ink bg-surface px-5 py-4',
  {
    variants: {
      interactive: {
        true: 'shadow-sm transition-transform duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2',
        false: '',
      },
    },
    defaultVariants: { interactive: false },
  },
)

/** Static row — deck's own card list, no navigation. */
export function ListItemCard({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn(listItemCardVariants(), className)} {...props} />
}

/** Navigable row — deck list, problem cards list. */
export function ListItemCardLink({
  className,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(listItemCardVariants({ interactive: true }), className)}
      {...props}
    />
  )
}
