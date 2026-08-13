import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { expect, test } from 'vitest'
import { ListItemCard, ListItemCardLink } from './ListItemCard'

test('renders a static row as a plain div', () => {
  render(<ListItemCard>Rust Basics</ListItemCard>)
  const row = screen.getByText('Rust Basics')
  expect(row.tagName).toBe('DIV')
})

test('renders a navigable row as a link to the given route', () => {
  render(
    <MemoryRouter>
      <ListItemCardLink to="/decks/deck-1">Rust Basics</ListItemCardLink>
    </MemoryRouter>,
  )
  expect(screen.getByRole('link', { name: 'Rust Basics' })).toHaveAttribute(
    'href',
    '/decks/deck-1',
  )
})
