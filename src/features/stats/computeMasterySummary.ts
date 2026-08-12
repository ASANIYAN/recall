import type { Card } from '@/db/schema'
import { countByMastery } from '@/features/mastery/countByMastery'
import type { MasteryLabel } from '@/features/mastery/deriveMastery'

export interface MasterySummary {
  masteryCounts: Record<MasteryLabel, number>
  highestLapses: number
}

export function computeMasterySummary(cards: Card[]): MasterySummary {
  const masteryCounts = countByMastery(cards)
  const highestLapses = cards.reduce(
    (max, card) => Math.max(max, card.lapses),
    0,
  )
  return { masteryCounts, highestLapses }
}
