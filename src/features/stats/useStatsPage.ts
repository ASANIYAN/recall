import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getCardsByDeck, getDeck, getSnapshotsByDeck } from '@/db/client'
import type { Card, Deck, Snapshot } from '@/db/schema'
import { computeMasterySummary } from './computeMasterySummary'
import { writeSnapshotForDeck } from './writeSnapshot'

export function useStatsPage(deckId: string | undefined) {
  const [deck, setDeck] = useState<Deck | null | undefined>(undefined)
  const [cards, setCards] = useState<Card[] | null>(null)
  const [snapshots, setSnapshots] = useState<Snapshot[] | null>(null)

  useEffect(() => {
    if (!deckId) return
    let cancelled = false

    async function load() {
      try {
        const loadedDeck = await getDeck(deckId as string)
        if (cancelled) return
        if (!loadedDeck) {
          setDeck(null)
          return
        }

        await writeSnapshotForDeck(deckId as string)
        const [loadedCards, loadedSnapshots] = await Promise.all([
          getCardsByDeck(deckId as string),
          getSnapshotsByDeck(deckId as string),
        ])
        if (cancelled) return
        setDeck(loadedDeck)
        setCards(loadedCards)
        setSnapshots(loadedSnapshots)
      } catch {
        if (!cancelled) toast.error('Could not load stats for this deck.')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [deckId])

  const summary = cards ? computeMasterySummary(cards) : null

  return { deck, cards, snapshots, summary }
}
