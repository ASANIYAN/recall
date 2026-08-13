import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAutoFocusRef } from '@/shared/form/useAutoFocusRef'
import { type DeckFormValues, deckFormSchema } from './schema'

interface UseDeckFormOptions {
  onSubmit: (values: DeckFormValues) => Promise<void>
}

export function useDeckForm({ onSubmit }: UseDeckFormOptions) {
  const setNameRef = useAutoFocusRef<HTMLInputElement>()
  const form = useForm<DeckFormValues>({
    resolver: zodResolver(deckFormSchema),
    defaultValues: { name: '' },
  })

  function handleSubmit() {
    return form.handleSubmit(onSubmit)
  }

  return { form, setNameRef, handleSubmit }
}
