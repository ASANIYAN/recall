import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createCard } from '@/db/client'
import type { Card, Deck } from '@/db/schema'
import { INITIAL_EASE_FACTOR } from '@/features/review/scheduling/constants'
import { getLastUsedDeckId, setLastUsedDeckId } from '@/shared/lastUsedDeck'
import { CardForm } from './CardForm'
import { type CardFormValues, parseTags } from './schema'

interface AddCardDialogProps {
  decks: Deck[]
  /** Locks the deck picker to this deck (e.g. from DeckDetail). Otherwise defaults to last-used. */
  defaultDeckId?: string
  onCreated?: (card: Card) => void
}

/** Modal, not a route — keeps the person in context. CLAUDE.md §7. */
export function AddCardDialog({
  decks,
  defaultDeckId,
  onCreated,
}: AddCardDialogProps) {
  const [open, setOpen] = useState(false)

  if (decks.length === 0) return null

  const initialDeckId = defaultDeckId ?? getLastUsedDeckId() ?? decks[0].id

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="violet">Add Card</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Card</DialogTitle>
        </DialogHeader>
        {open && (
          <CardForm
            decks={decks}
            defaultDeckId={initialDeckId}
            onSubmit={handleSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
