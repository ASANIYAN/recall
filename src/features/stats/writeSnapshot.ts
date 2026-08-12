import { getCardsByDeck, putSnapshot } from '@/db/client'
import type { Snapshot } from '@/db/schema'
import { computeMasterySummary } from './computeMasterySummary'

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
  const { masteryCounts } = computeMasterySummary(cards)

  const snapshot: Snapshot = {
    deckId,
    date: todayISO(),
    newCount: masteryCounts.new,
    shakyCount: masteryCounts.shaky,
    solidCount: masteryCounts.solid,
    masteredCount: masteryCounts.mastered,
  }

  await putSnapshot(snapshot)
  return snapshot
}
