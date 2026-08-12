import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getCardsByDeck, getDeck } from '@/db/client'
import type { Card, Deck } from '@/db/schema'

export function useDeckDetail(deckId: string | undefined) {
  const [deck, setDeck] = useState<Deck | null | undefined>(undefined)
  const [cards, setCards] = useState<Card[] | null>(null)

  const refresh = useCallback(async () => {
    if (!deckId) return
    try {
      const [loadedDeck, loadedCards] = await Promise.all([
        getDeck(deckId),
        getCardsByDeck(deckId),
      ])
      setDeck(loadedDeck ?? null)
      setCards(loadedCards)
    } catch {
      toast.error('Could not load this deck.')
    }
  }, [deckId])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { deck, cards, refresh }
}
