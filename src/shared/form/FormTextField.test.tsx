import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { expect, test, vi } from 'vitest'
import { Form } from '@/components/ui/form'
import { FormTextField } from './FormTextField'

interface Values {
  name: string
}

function Harness({
  fieldRef,
}: {
  fieldRef?: (el: HTMLInputElement | null) => void
}) {
  const form = useForm<Values>({ defaultValues: { name: '' } })
  return (
    <Form {...form}>
      <FormTextField
        control={form.control}
        name="name"
        label="Name"
        placeholder="Rust Fundamentals"
        fieldRef={fieldRef}
      />
    </Form>
  )
}

test('renders a labeled text input wired to the field name', async () => {
  render(<Harness />)
  const input = screen.getByLabelText('Name')
  await userEvent.type(input, 'Rust Basics')
  expect(input).toHaveValue('Rust Basics')
})

test("merges an external fieldRef with react-hook-form's own ref", () => {
  const fieldRef = vi.fn()
  render(<Harness fieldRef={fieldRef} />)
  expect(fieldRef).toHaveBeenCalledWith(screen.getByLabelText('Name'))
})
