import { render, screen } from '@testing-library/react'
import App from './App'

test('renders the empty state when nothing is due', async () => {
  render(<App />)
  expect(await screen.findByText('Nothing due right now.')).toBeInTheDocument()
})
