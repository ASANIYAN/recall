import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Deck } from '@/db/schema'
import { FormTextareaField } from '@/shared/form/FormTextareaField'
import { FormTextField } from '@/shared/form/FormTextField'
import { SubmitButton } from '@/shared/form/SubmitButton'
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

        <FormTextareaField
          control={form.control}
          name="front"
          label="Front"
          placeholder="What happens when a value is moved?"
          fieldRef={setFrontRef}
        />

        <FormTextareaField
          control={form.control}
          name="back"
          label="Back"
          placeholder="The previous owner becomes invalid..."
        />

        <FormTextField
          control={form.control}
          name="tags"
          label="Tags (optional)"
          placeholder="ownership, borrowing"
        />

        <SubmitButton
          isSubmitting={form.formState.isSubmitting}
          label="Save Card"
        />
      </form>
    </Form>
  )
}
