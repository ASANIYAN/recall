import { createCard } from '@/db/client'
import type { Card, Deck } from '@/db/schema'
import { INITIAL_EASE_FACTOR } from '@/features/review/scheduling/constants'
import { useCreateEntityDialog } from '@/shared/form/useCreateEntityDialog'
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
  const initialDeckId =
    defaultDeckId ?? getLastUsedDeckId() ?? decks[0]?.id ?? ''

  const { open, setOpen, handleSubmit } = useCreateEntityDialog<
    CardFormValues,
    Card
  >({
    build: (values) => ({
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
    }),
    create: createCard,
    errorMessage: 'Could not save that card. Try again.',
    onCreated: (card) => {
      setLastUsedDeckId(card.deckId)
      onCreated?.(card)
    },
  })

  return { open, setOpen, initialDeckId, handleSubmit }
}
