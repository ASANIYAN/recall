import { IDBFactory } from 'fake-indexeddb'
import { beforeEach, describe, expect, test } from 'vitest'
import { __resetDBForTests, createCard, getSnapshotsByDeck } from '@/db/client'
import type { Card } from '@/db/schema'
import { writeSnapshotForDeck } from './writeSnapshot'

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

describe('writeSnapshotForDeck', () => {
  test('counts cards into the correct mastery buckets', async () => {
    await createCard(makeCard({ id: 'new', phase: 'learning', lapses: 0 }))
    await createCard(
      makeCard({ id: 'shaky', phase: 'review', interval: 2, lapses: 0 }),
    )
    await createCard(
      makeCard({ id: 'solid', phase: 'review', interval: 10, lapses: 0 }),
    )
    await createCard(
      makeCard({ id: 'mastered', phase: 'review', interval: 30, lapses: 0 }),
    )

    const snapshot = await writeSnapshotForDeck('deck-1')

    expect(snapshot).toMatchObject({
      deckId: 'deck-1',
      newCount: 1,
      shakyCount: 1,
      solidCount: 1,
      masteredCount: 1,
    })
  })

  test('upserts one record per deck per day rather than accumulating', async () => {
    await createCard(makeCard({ id: 'card-1', phase: 'review', interval: 30 }))
    await writeSnapshotForDeck('deck-1')

    await createCard(makeCard({ id: 'card-2', phase: 'review', interval: 30 }))
    await writeSnapshotForDeck('deck-1')

    const snapshots = await getSnapshotsByDeck('deck-1')
    expect(snapshots).toHaveLength(1)
    expect(snapshots[0].masteredCount).toBe(2)
  })
})
