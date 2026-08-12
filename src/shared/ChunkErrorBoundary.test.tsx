import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, expect, test, vi } from 'vitest'
import { ChunkErrorBoundary } from './ChunkErrorBoundary'

const RELOAD_FLAG_KEY = 'recall:chunk-reload-attempted'

function ThrowingChild(): never {
  throw new Error('error loading dynamically imported module')
}

beforeEach(() => {
  sessionStorage.removeItem(RELOAD_FLAG_KEY)
  // jsdom doesn't implement navigation — stub reload so it doesn't throw.
  Object.defineProperty(window, 'location', {
    value: { ...window.location, reload: vi.fn() },
    writable: true,
  })
})

test('reloads once on the first chunk-load failure instead of showing a blank page', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

  render(
    <ChunkErrorBoundary>
      <ThrowingChild />
    </ChunkErrorBoundary>,
  )

  expect(window.location.reload).toHaveBeenCalledOnce()
  expect(sessionStorage.getItem(RELOAD_FLAG_KEY)).toBe('1')

  consoleError.mockRestore()
})

test('shows a fallback with a way out if the failure recurs after a reload was already attempted', () => {
  sessionStorage.setItem(RELOAD_FLAG_KEY, '1')
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

  render(
    <MemoryRouter>
      <ChunkErrorBoundary>
        <ThrowingChild />
      </ChunkErrorBoundary>
    </MemoryRouter>,
  )

  expect(screen.getByText('Could Not Load')).toBeInTheDocument()
  expect(screen.getByText('← Back to decks')).toBeInTheDocument()
  expect(window.location.reload).not.toHaveBeenCalled()

  consoleError.mockRestore()
})
