import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { expect, test, vi } from 'vitest'
import { Form } from '@/components/ui/form'
import { FormTextareaField } from './FormTextareaField'

interface Values {
  front: string
}

function Harness({
  fieldRef,
}: {
  fieldRef?: (el: HTMLTextAreaElement | null) => void
}) {
  const form = useForm<Values>({ defaultValues: { front: '' } })
  return (
    <Form {...form}>
      <FormTextareaField
        control={form.control}
        name="front"
        label="Front"
        fieldRef={fieldRef}
      />
    </Form>
  )
}

test('renders a labeled textarea wired to the field name', async () => {
  render(<Harness />)
  const textarea = screen.getByLabelText('Front')
  await userEvent.type(textarea, 'What is ownership?')
  expect(textarea).toHaveValue('What is ownership?')
})

test('autofocuses when fieldRef comes from useAutoFocusRef', () => {
  const fieldRef = vi.fn()
  render(<Harness fieldRef={fieldRef} />)
  expect(fieldRef).toHaveBeenCalledWith(screen.getByLabelText('Front'))
})
