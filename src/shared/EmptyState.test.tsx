import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { EmptyState } from './EmptyState'

test('shows the message with no action', () => {
  render(<EmptyState message="No decks yet." />)
  expect(screen.getByText('No decks yet.')).toBeInTheDocument()
  expect(screen.queryByRole('button')).not.toBeInTheDocument()
})

test('shows the message alongside a paired action', () => {
  render(
    <EmptyState message="No decks yet.">
      <button type="button">Add Deck</button>
    </EmptyState>,
  )
  expect(screen.getByText('No decks yet.')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Add Deck' })).toBeInTheDocument()
})
