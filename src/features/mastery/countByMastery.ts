import type { Card } from '@/db/schema'
import { deriveMastery, type MasteryLabel } from './deriveMastery'

export function countByMastery(
  cards: Pick<Card, 'phase' | 'interval' | 'lapses'>[],
): Record<MasteryLabel, number> {
  const counts: Record<MasteryLabel, number> = {
    new: 0,
    shaky: 0,
    solid: 0,
    mastered: 0,
  }
  for (const card of cards) {
    counts[deriveMastery(card)]++
  }
  return counts
}
