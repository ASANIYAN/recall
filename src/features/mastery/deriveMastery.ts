import type { CardPhase } from '@/db/schema'
import {
  SHAKY_MAX_DAYS,
  SOLID_MAX_DAYS,
} from '@/features/review/scheduling/constants'

export type MasteryLabel = 'new' | 'shaky' | 'solid' | 'mastered'

export interface DeriveMasteryInput {
  phase: CardPhase
  interval: number
  lapses: number
}

/**
 * Mastery is a derived label, never a stored field — this is what
 * guarantees the visual state can't drift out of sync with the underlying
 * scheduling data. A learning-phase card with lapses > 0 has graduated and regressed
 * before — it reads as "shaky", not "new". Lapses only affects the label
 * while still in that learning-phase episode; once re-graduated, the
 * label is interval-based again, ignoring older lapses.
 */
export function deriveMastery({
  phase,
  interval,
  lapses,
}: DeriveMasteryInput): MasteryLabel {
  if (phase === 'learning') {
    return lapses > 0 ? 'shaky' : 'new'
  }
  if (interval < SHAKY_MAX_DAYS) return 'shaky'
  if (interval <= SOLID_MAX_DAYS) return 'solid'
  return 'mastered'
}
