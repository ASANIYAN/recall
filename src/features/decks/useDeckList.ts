import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getAllCards, getAllDecks } from '@/db/client'
import type { Card, Deck } from '@/db/schema'
import { countByMastery } from '@/features/mastery/countByMastery'

export interface DeckSummary {
  deck: Deck
  cards: Card[]
  masteredCount: number
}

function groupCardsByDeck(cards: Card[]): Record<string, Card[]> {
  const grouped: Record<string, Card[]> = {}
  for (const card of cards) {
    if (!grouped[card.deckId]) grouped[card.deckId] = []
    grouped[card.deckId].push(card)
  }
  return grouped
}

function summarizeDecks(decks: Deck[], cards: Card[]): DeckSummary[] {
  const cardsByDeck = groupCardsByDeck(cards)
  return decks.map((deck) => {
    const deckCards = cardsByDeck[deck.id] ?? []
    const masteredCount = countByMastery(deckCards).mastered
    return { deck, cards: deckCards, masteredCount }
  })
}

export function useDeckList() {
  const [deckSummaries, setDeckSummaries] = useState<DeckSummary[] | null>(null)

  const refresh = useCallback(async () => {
    try {
      const [allDecks, allCards] = await Promise.all([
        getAllDecks(),
        getAllCards(),
      ])
      setDeckSummaries(summarizeDecks(allDecks, allCards))
    } catch {
      toast.error('Could not load your decks.')
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const decks = deckSummaries?.map((summary) => summary.deck) ?? []

  return { deckSummaries, decks, refresh }
}
