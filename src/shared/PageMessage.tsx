import { Link } from 'react-router'

interface PageMessageProps {
  title: string
  message: string
  linkTo: string
  linkLabel: string
}

/**
 * Full-page dead-end handler: not-found entities, unmatched routes.
 * Always pairs the message with a way out, so no page is a trap.
 */
export function PageMessage({
  title,
  message,
  linkTo,
  linkLabel,
}: PageMessageProps) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-bg p-8">
      <div className="max-w-xl border-2 border-dashed border-ink-35 p-10 text-center">
        <p className="mb-3 font-display text-2xl uppercase">{title}</p>
        <p className="mb-4 font-mono text-ink-60 text-xs">{message}</p>
        <Link
          to={linkTo}
          className="font-mono text-ink text-xs underline underline-offset-2 hover:no-underline active:text-ink-60 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
        >
          {linkLabel}
        </Link>
      </div>
    </div>
  )
}
