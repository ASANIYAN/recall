import { Form } from '@/components/ui/form'
import { FormTextField } from '@/shared/form/FormTextField'
import { SubmitButton } from '@/shared/form/SubmitButton'
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
        <FormTextField
          control={form.control}
          name="name"
          label="Name"
          placeholder="Rust Fundamentals"
          fieldRef={setNameRef}
        />
        <SubmitButton
          isSubmitting={form.formState.isSubmitting}
          label="Save Deck"
        />
      </form>
    </Form>
  )
}
