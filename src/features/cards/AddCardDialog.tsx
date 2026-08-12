import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Card, Deck } from '@/db/schema'
import { CardForm } from './CardForm'
import { useAddCardDialog } from './useAddCardDialog'

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
  const { open, setOpen, initialDeckId, handleSubmit } = useAddCardDialog({
    decks,
    defaultDeckId,
    onCreated,
  })

  if (decks.length === 0) return null

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
