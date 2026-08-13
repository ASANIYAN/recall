import { createDeck } from '@/db/client'
import type { Deck } from '@/db/schema'
import { useCreateEntityDialog } from '@/shared/form/useCreateEntityDialog'
import type { DeckFormValues } from './schema'

interface UseAddDeckDialogOptions {
  onCreated?: (deck: Deck) => void
}

export function useAddDeckDialog({ onCreated }: UseAddDeckDialogOptions) {
  return useCreateEntityDialog<DeckFormValues, Deck>({
    build: (values) => ({
      id: crypto.randomUUID(),
      name: values.name,
      createdAt: new Date().toISOString(),
    }),
    create: createDeck,
    errorMessage: 'Could not save that deck. Try again.',
    onCreated,
  })
}
