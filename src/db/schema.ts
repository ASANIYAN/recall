import type { DBSchema } from 'idb'

export type CardPhase = 'learning' | 'review'

export interface Deck {
  id: string
  name: string
  createdAt: string
}

export interface Card {
  id: string
  deckId: string
  front: string
  back: string
  tags?: string[]
  createdAt: string

  phase: CardPhase
  /** Index into the learning-step sequence. Meaningful only in the learning phase. */
  learningStep: number
  /** Days, not a timestamp — storing "when the last review happened" would force re-deriving the gap via subtraction every time. */
  interval: number
  easeFactor: number
  /** ISO date (YYYY-MM-DD). Review-phase cards only. */
  nextShowDate?: string
  lapses: number
}

export interface Snapshot {
  deckId: string
  /** ISO date (YYYY-MM-DD). One record per deck per day. */
  date: string
  newCount: number
  shakyCount: number
  solidCount: number
  masteredCount: number
}

export interface RecallDB extends DBSchema {
  decks: {
    key: string
    value: Deck
  }
  cards: {
    key: string
    value: Card
    indexes: { deckId: string; nextShowDate: string }
  }
  snapshots: {
    key: string
    value: Snapshot
    indexes: { deckId: string }
  }
}
