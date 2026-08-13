import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { SubmitButton } from './SubmitButton'

test('shows the label and stays enabled while idle', () => {
  render(<SubmitButton isSubmitting={false} label="Save Deck" />)
  const button = screen.getByRole('button', { name: 'Save Deck' })
  expect(button).toBeEnabled()
})

test('shows the pending label and disables while submitting', () => {
  render(
    <SubmitButton
      isSubmitting={true}
      label="Save Deck"
      pendingLabel="Saving…"
    />,
  )
  expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled()
})
