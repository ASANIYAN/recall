import type { Card } from '@/db/schema'

const PROBLEM_CARDS_LIMIT = 5

/** Top cards by lapses — the "what needs work" signal, not an activity metric. */
export function selectProblemCards(cards: Card[]): Card[] {
  return [...cards]
    .filter((card) => card.lapses > 0)
    .sort((a, b) => b.lapses - a.lapses)
    .slice(0, PROBLEM_CARDS_LIMIT)
}
