import type { Card } from '@/db/schema'
import { countByMastery } from './countByMastery'
import type { MasteryLabel } from './deriveMastery'

const ORDER: MasteryLabel[] = ['new', 'shaky', 'solid', 'mastered']

const SEGMENT_CLASS: Record<MasteryLabel, string> = {
  new: 'bg-surface',
  shaky: 'bg-pink',
  solid: 'bg-violet',
  mastered: 'bg-cyan',
}

interface AggregateBarProps {
  cards: Pick<Card, 'phase' | 'interval' | 'lapses'>[]
  /** `mini` matches design-system.html's deck-list-item variant. */
  size?: 'default' | 'mini'
  className?: string
}

/**
 * Deck-level mastery breakdown. Segment order is always
 * New → Shaky → Solid → Mastered, left to right — CLAUDE.md §8/design-system.html.
 */
export function AggregateBar({
  cards,
  size = 'default',
  className = '',
}: AggregateBarProps) {
  const counts = countByMastery(cards)
  const total = cards.length

  const dimensions =
    size === 'mini'
      ? 'h-2.5 w-[90px] border-2'
      : 'h-[22px] w-full max-w-[420px] border-[3px]'
  const segmentBorder = size === 'mini' ? 'border-r-2' : 'border-r-[3px]'

  return (
    <div className={`flex border-ink ${dimensions} ${className}`}>
      {total === 0
        ? null
        : ORDER.filter((label) => counts[label] > 0).map((label) => (
            <span
              key={label}
              className={`h-full border-ink last:border-r-0 ${segmentBorder} ${SEGMENT_CLASS[label]}`}
              style={{ width: `${(counts[label] / total) * 100}%` }}
            />
          ))}
    </div>
  )
}
