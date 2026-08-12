import { act, renderHook, waitFor } from '@testing-library/react'
import { IDBFactory } from 'fake-indexeddb'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { __resetDBForTests, createCard, getCard } from '@/db/client'
import type { Card } from '@/db/schema'
import { useReviewSession } from './useReviewSession'

beforeEach(async () => {
  await __resetDBForTests()
  globalThis.indexedDB = new IDBFactory()
})

function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    id: 'card-1',
    deckId: 'deck-1',
    front: 'Front',
    back: 'Back',
    createdAt: new Date().toISOString(),
    phase: 'learning',
    learningStep: 0,
    interval: 0,
    easeFactor: 2.5,
    lapses: 0,
    ...overrides,
  }
}

describe('useReviewSession', () => {
  test('grading a card persists the new scheduling state to IndexedDB', async () => {
    await createCard(makeCard({ learningStep: 2 })) // one Good away from graduating

    const { result } = renderHook(() => useReviewSession())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.currentCard?.id).toBe('card-1')

    await act(async () => {
      await result.current.grade('good')
    })

    const persisted = await getCard('card-1')
    expect(persisted?.phase).toBe('review')
    expect(persisted?.interval).toBe(1)
  })

  test('shows the updated mastery state before advancing to the next card', async () => {
    await createCard(makeCard({ learningStep: 2 }))

    const { result } = renderHook(() => useReviewSession())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.grade('good')
    })

    // Still visible, now carrying its graduated (review-phase) state.
    expect(result.current.currentCard?.id).toBe('card-1')
    expect(result.current.currentCard?.phase).toBe('review')
    expect(result.current.isTransitioning).toBe(true)

    await waitFor(() => expect(result.current.isTransitioning).toBe(false))
    expect(result.current.currentCard).toBeNull()
  })

  test('a learning-phase card that does not graduate re-enters the queue after its step delay', async () => {
    await createCard(makeCard({ learningStep: 0 })) // 1-minute step

    const { result } = renderHook(() => useReviewSession())
    await waitFor(() => expect(result.current.loading).toBe(false))

    // fake-indexeddb schedules its own internal completion via `setImmediate`
    // (see its scheduling.js) — fake only `setTimeout`, which is all our own
    // hook uses, so IndexedDB's internal scheduling keeps running on real timers.
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    try {
      await act(async () => {
        await result.current.grade('good')
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(701) // clear the UI-advance pause
      })
      expect(result.current.currentCard).toBeNull()

      await act(async () => {
        await vi.advanceTimersByTimeAsync(10 * 60_000) // step 1's 10-minute delay
      })
      expect(result.current.currentCard?.id).toBe('card-1')
      expect(result.current.currentCard?.learningStep).toBe(1)
    } finally {
      vi.useRealTimers()
    }
  })
})
