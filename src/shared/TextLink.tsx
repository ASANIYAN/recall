import { Link, type LinkProps } from 'react-router'

/** The small mono back/nav links used throughout — hover, press, and a visible keyboard-focus ring. */
export function TextLink({ className = '', ...props }: LinkProps) {
  return (
    <Link
      className={`font-mono text-ink-60 text-xs hover:text-ink active:text-ink/70 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 ${className}`}
      {...props}
    />
  )
}
