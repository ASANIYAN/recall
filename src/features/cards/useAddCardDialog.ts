import { useState } from 'react'
import { toast } from 'sonner'
import { createCard } from '@/db/client'
import type { Card, Deck } from '@/db/schema'
import { INITIAL_EASE_FACTOR } from '@/features/review/scheduling/constants'
import { getLastUsedDeckId, setLastUsedDeckId } from '@/shared/lastUsedDeck'
import type { CardFormValues } from './schema'
import { parseTags } from './schema'

interface UseAddCardDialogOptions {
  decks: Deck[]
  /** Locks the deck picker to this deck (e.g. from DeckDetail). Otherwise defaults to last-used. */
  defaultDeckId?: string
  onCreated?: (card: Card) => void
}

export function useAddCardDialog({
  decks,
  defaultDeckId,
  onCreated,
}: UseAddCardDialogOptions) {
  const [open, setOpen] = useState(false)

  const initialDeckId =
    defaultDeckId ?? getLastUsedDeckId() ?? decks[0]?.id ?? ''

  async function handleSubmit(values: CardFormValues) {
    const card: Card = {
      id: crypto.randomUUID(),
      deckId: values.deckId,
      front: values.front,
      back: values.back,
      tags: parseTags(values.tags),
      createdAt: new Date().toISOString(),
      phase: 'learning',
      learningStep: 0,
      interval: 0,
      easeFactor: INITIAL_EASE_FACTOR,
      lapses: 0,
    }
    try {
      await createCard(card)
    } catch {
      toast.error('Could not save that card. Try again.')
      return
    }
    setLastUsedDeckId(values.deckId)
    onCreated?.(card)
    setOpen(false)
  }

  return { open, setOpen, initialDeckId, handleSubmit }
}
