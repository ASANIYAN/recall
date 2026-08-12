import { render, screen } from '@testing-library/react'
import { beforeEach, test } from 'vitest'
import App from './App'

beforeEach(() => {
  window.history.pushState({}, '', '/')
})

test('renders the landing page at the root route', async () => {
  render(<App />)
  expect(await screen.findByText('Open App →')).toBeInTheDocument()
})

test('renders the deck list empty state at /app', async () => {
  window.history.pushState({}, '', '/app')
  render(<App />)
  expect(await screen.findByText('No decks yet.')).toBeInTheDocument()
})
