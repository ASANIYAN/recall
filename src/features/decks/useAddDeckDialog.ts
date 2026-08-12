import { useState } from 'react'
import { toast } from 'sonner'
import { createDeck } from '@/db/client'
import type { Deck } from '@/db/schema'
import type { DeckFormValues } from './schema'

interface UseAddDeckDialogOptions {
  onCreated?: (deck: Deck) => void
}

export function useAddDeckDialog({ onCreated }: UseAddDeckDialogOptions) {
  const [open, setOpen] = useState(false)

  async function handleSubmit(values: DeckFormValues) {
    const deck: Deck = {
      id: crypto.randomUUID(),
      name: values.name,
      createdAt: new Date().toISOString(),
    }
    try {
      await createDeck(deck)
    } catch {
      toast.error('Could not save that deck. Try again.')
      return
    }
    onCreated?.(deck)
    setOpen(false)
  }

  return { open, setOpen, handleSubmit }
}
