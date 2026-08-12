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
import type { DeckFormValues } from './schema'
import { useDeckForm } from './useDeckForm'

interface DeckFormProps {
  onSubmit: (values: DeckFormValues) => Promise<void>
}

export function DeckForm({ onSubmit }: DeckFormProps) {
  const { form, setNameRef, handleSubmit } = useDeckForm({ onSubmit })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit()} className="flex flex-col gap-5">
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
                    setNameRef(el)
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
