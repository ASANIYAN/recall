import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Deck } from '@/db/schema'
import { DeckForm } from './DeckForm'
import { useAddDeckDialog } from './useAddDeckDialog'

interface AddDeckDialogProps {
  onCreated?: (deck: Deck) => void
}

export function AddDeckDialog({ onCreated }: AddDeckDialogProps) {
  const { open, setOpen, handleSubmit } = useAddDeckDialog({ onCreated })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Deck</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Deck</DialogTitle>
        </DialogHeader>
        {open && <DeckForm onSubmit={handleSubmit} />}
      </DialogContent>
    </Dialog>
  )
}
