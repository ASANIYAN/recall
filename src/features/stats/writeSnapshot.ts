import { getCardsByDeck, putSnapshot } from '@/db/client'
import type { Snapshot } from '@/db/schema'
import { deriveMastery } from '@/features/mastery/deriveMastery'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Writes one snapshot per deck per day — safe to call every time the deck
 * is viewed. `putSnapshot` upserts on `deckId` + `date`, so repeated calls
 * on the same day just overwrite with the latest counts instead of
 * accumulating duplicates. See CLAUDE.md §3.
 */
export async function writeSnapshotForDeck(deckId: string): Promise<Snapshot> {
  const cards = await getCardsByDeck(deckId)
  const snapshot: Snapshot = {
    deckId,
    date: todayISO(),
    newCount: 0,
    shakyCount: 0,
    solidCount: 0,
    masteredCount: 0,
  }

  for (const card of cards) {
    switch (deriveMastery(card)) {
      case 'new':
        snapshot.newCount++
        break
      case 'shaky':
        snapshot.shakyCount++
        break
      case 'solid':
        snapshot.solidCount++
        break
      case 'mastered':
        snapshot.masteredCount++
        break
    }
  }

  await putSnapshot(snapshot)
  return snapshot
}
