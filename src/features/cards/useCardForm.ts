import { zodResolver } from '@hookform/resolvers/zod'
import type { KeyboardEvent } from 'react'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { type CardFormValues, cardFormSchema } from './schema'

interface UseCardFormOptions {
  defaultDeckId: string
  onSubmit: (values: CardFormValues) => Promise<void>
}

/** Autofocus front on open, Cmd/Ctrl+Enter to submit. */
export function useCardForm({ defaultDeckId, onSubmit }: UseCardFormOptions) {
  const frontRef = useRef<HTMLTextAreaElement>(null)
  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: { deckId: defaultDeckId, front: '', back: '', tags: '' },
  })

  useEffect(() => {
    frontRef.current?.focus()
  }, [])

  function setFrontRef(el: HTMLTextAreaElement | null) {
    frontRef.current = el
  }

  function handleSubmit() {
    return form.handleSubmit(onSubmit)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      form.handleSubmit(onSubmit)()
    }
  }

  return { form, setFrontRef, handleSubmit, handleKeyDown }
}
