import { getAllCards, getAllDecks, updateCard, updateDeck } from '@/db/client'
import { type ExportPayload, exportPayloadSchema } from './schema'

export function parseImportFile(text: string): ExportPayload {
  return exportPayloadSchema.parse(JSON.parse(text))
}

export interface ImportSummary {
  decksAdded: number
  decksUpdated: number
  cardsAdded: number
  cardsUpdated: number
}

/** Counts adds vs. updates for the confirmation summary — nothing is written yet. */
export async function computeImportSummary(
  payload: ExportPayload,
): Promise<ImportSummary> {
  const [existingDecks, existingCards] = await Promise.all([
    getAllDecks(),
    getAllCards(),
  ])
  const existingDeckIds = new Set(existingDecks.map((deck) => deck.id))
  const existingCardIds = new Set(existingCards.map((card) => card.id))

  const decksAdded = payload.decks.filter(
    (deck) => !existingDeckIds.has(deck.id),
  ).length
  const cardsAdded = payload.cards.filter(
    (card) => !existingCardIds.has(card.id),
  ).length

  return {
    decksAdded,
    decksUpdated: payload.decks.length - decksAdded,
    cardsAdded,
    cardsUpdated: payload.cards.length - cardsAdded,
  }
}

/**
 * Upsert by ID — existing records are updated, new ones added, nothing is
 * deleted. `updateDeck`/`updateCard` both use IndexedDB `put`, which already
 * handles insert-or-update, so the same calls cover adds and updates alike.
 * See CLAUDE.md §7.
 */
export async function commitImport(payload: ExportPayload): Promise<void> {
  await Promise.all(payload.decks.map(updateDeck))
  await Promise.all(payload.cards.map(updateCard))
}
