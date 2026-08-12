import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createDeck } from '@/db/client'
import type { Deck } from '@/db/schema'
import { type DeckFormValues, deckFormSchema } from './schema'

interface AddDeckDialogProps {
  onCreated?: (deck: Deck) => void
}

export function AddDeckDialog({ onCreated }: AddDeckDialogProps) {
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

function DeckForm({
  onSubmit,
}: {
  onSubmit: (values: DeckFormValues) => Promise<void>
}) {
  const nameRef = useRef<HTMLInputElement>(null)
  const form = useForm<DeckFormValues>({
    resolver: zodResolver(deckFormSchema),
    defaultValues: { name: '' },
  })

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  ref={(el) => {
                    field.ref(el)
                    nameRef.current = el
                  }}
                  placeholder="Rust Fundamentals"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="violet"
          className="self-start"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Saving…' : 'Save Deck'}
        </Button>
      </form>
    </Form>
  )
}
