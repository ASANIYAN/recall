import { act, renderHook, waitFor } from '@testing-library/react'
import { toast } from 'sonner'
import { expect, test, vi } from 'vitest'
import { useCreateEntityDialog } from './useCreateEntityDialog'

vi.mock('sonner', () => ({ toast: { error: vi.fn() } }))

interface Values {
  name: string
}
interface Entity {
  id: string
  name: string
}

test('builds, persists, and closes on success, notifying onCreated', async () => {
  const create = vi.fn().mockResolvedValue(undefined)
  const onCreated = vi.fn()
  const { result } = renderHook(() =>
    useCreateEntityDialog<Values, Entity>({
      build: (values) => ({ id: 'deck-1', name: values.name }),
      create,
      errorMessage: 'Could not save.',
      onCreated,
    }),
  )

  act(() => result.current.setOpen(true))
  expect(result.current.open).toBe(true)

  await act(async () => {
    await result.current.handleSubmit({ name: 'Rust Basics' })
  })

  expect(create).toHaveBeenCalledWith({ id: 'deck-1', name: 'Rust Basics' })
  expect(onCreated).toHaveBeenCalledWith({ id: 'deck-1', name: 'Rust Basics' })
  expect(result.current.open).toBe(false)
})

test('shows an error toast and keeps the dialog open when create rejects', async () => {
  const create = vi.fn().mockRejectedValue(new Error('db down'))
  const onCreated = vi.fn()
  const { result } = renderHook(() =>
    useCreateEntityDialog<Values, Entity>({
      build: (values) => ({ id: 'deck-1', name: values.name }),
      create,
      errorMessage: 'Could not save.',
      onCreated,
    }),
  )

  act(() => result.current.setOpen(true))

  await act(async () => {
    await result.current.handleSubmit({ name: 'Rust Basics' })
  })

  await waitFor(() =>
    expect(toast.error).toHaveBeenCalledWith('Could not save.'),
  )
  expect(onCreated).not.toHaveBeenCalled()
  expect(result.current.open).toBe(true)
})
