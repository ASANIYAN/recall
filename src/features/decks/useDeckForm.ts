import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { type DeckFormValues, deckFormSchema } from './schema'

interface UseDeckFormOptions {
  onSubmit: (values: DeckFormValues) => Promise<void>
}

export function useDeckForm({ onSubmit }: UseDeckFormOptions) {
  const nameRef = useRef<HTMLInputElement>(null)
  const form = useForm<DeckFormValues>({
    resolver: zodResolver(deckFormSchema),
    defaultValues: { name: '' },
  })

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  function setNameRef(el: HTMLInputElement | null) {
    nameRef.current = el
  }

  function handleSubmit() {
    return form.handleSubmit(onSubmit)
  }

  return { form, setNameRef, handleSubmit }
}
