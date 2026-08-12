import { render, screen } from '@testing-library/react'
import App from './App'

test('renders the deck list empty state at the root route', async () => {
  render(<App />)
  expect(await screen.findByText('No decks yet.')).toBeInTheDocument()
})
