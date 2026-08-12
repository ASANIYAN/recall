interface StatBlockProps {
  value: number
  label: string
}

/** Matches design-system.html's `.stat` — a single mastery-oriented figure, not an activity count. */
export function StatBlock({ value, label }: StatBlockProps) {
  return (
    <div className="border-[3px] border-ink bg-surface p-5 shadow-sm">
      <div className="font-display text-4xl text-ink leading-none">{value}</div>
      <div className="mt-1.5 font-mono text-ink-60 text-xs uppercase">
        {label}
      </div>
    </div>
  )
}
