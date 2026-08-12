import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Deck } from '@/db/schema'
import type { CardFormValues } from './schema'
import { useCardForm } from './useCardForm'

interface CardFormProps {
  decks: Deck[]
  defaultDeckId: string
  onSubmit: (values: CardFormValues) => Promise<void>
}

export function CardForm({ decks, defaultDeckId, onSubmit }: CardFormProps) {
  const { form, setFrontRef, handleSubmit, handleKeyDown } = useCardForm({
    defaultDeckId,
    onSubmit,
  })

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit()}
        onKeyDown={handleKeyDown}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="deckId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deck</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a deck" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {decks.map((deck) => (
                    <SelectItem key={deck.id} value={deck.id}>
                      {deck.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="front"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Front</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  ref={(el) => {
                    field.ref(el)
                    setFrontRef(el)
                  }}
                  placeholder="What happens when a value is moved?"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="back"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Back</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="The previous owner becomes invalid..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (optional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="ownership, borrowing" />
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
          {form.formState.isSubmitting ? 'Saving…' : 'Save Card'}
        </Button>
      </form>
    </Form>
  )
}
