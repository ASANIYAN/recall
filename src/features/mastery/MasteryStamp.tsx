import { cva } from 'class-variance-authority'
import type { MasteryLabel } from './deriveMastery'

/**
 * Rotation reads as "stamped" — New stays dashed/unrotated (hasn't earned
 * a stamp yet), Shaky/Solid/Mastered get a slight rotation.
 */
const stampVariants = cva(
  'inline-flex items-center gap-1.5 border-2 border-ink px-3 py-1.5 font-display text-[11px] uppercase',
  {
    variants: {
      label: {
        new: 'border-dashed bg-surface text-ink-60',
        shaky: 'bg-pink-tint text-shaky-text -rotate-2',
        solid: 'bg-violet-tint text-solid-text rotate-1',
        mastered: 'bg-cyan-tint text-mastered-text -rotate-1',
      },
    },
  },
)

const LABEL_TEXT: Record<MasteryLabel, string> = {
  new: 'New',
  shaky: 'Shaky',
  solid: 'Solid',
  mastered: 'Mastered',
}

interface MasteryStampProps {
  label: MasteryLabel
}

export function MasteryStamp({ label }: MasteryStampProps) {
  return <span className={stampVariants({ label })}>{LABEL_TEXT[label]}</span>
}
