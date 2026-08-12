import { IDBFactory } from 'fake-indexeddb'
import { beforeEach, describe, expect, test } from 'vitest'
import {
  __resetDBForTests,
  createCard,
  createDeck,
  deleteCard,
  deleteDeck,
  getAllDecks,
  getCard,
  getCardsByDeck,
  getDeck,
  getDueCards,
  getSnapshotsByDeck,
  putSnapshot,
  updateCard,
  updateDeck,
} from './client'
import type { Card, Deck } from './schema'
import { buildFixtureCards, buildFixtureDecks } from './seed'

beforeEach(async () => {
  await __resetDBForTests()
  globalThis.indexedDB = new IDBFactory()
})

function makeDeck(overrides: Partial<Deck> = {}): Deck {
  return {
    id: 'deck-1',
    name: 'Test Deck',
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

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

describe('decks', () => {
  test('creates, reads, updates, and deletes a deck', async () => {
    const deck = makeDeck()
    await createDeck(deck)
    expect(await getDeck(deck.id)).toEqual(deck)

    const renamed = { ...deck, name: 'Renamed Deck' }
    await updateDeck(renamed)
    expect(await getDeck(deck.id)).toEqual(renamed)

    await deleteDeck(deck.id)
    expect(await getDeck(deck.id)).toBeUndefined()
  })

  test('lists all decks', async () => {
    await createDeck(makeDeck({ id: 'deck-1' }))
    await createDeck(makeDeck({ id: 'deck-2' }))
    const decks = await getAllDecks()
    expect(decks).toHaveLength(2)
  })
})

describe('cards', () => {
  test('creates, reads, updates, and deletes a card', async () => {
    const card = makeCard()
    await createCard(card)
    expect(await getCard(card.id)).toEqual(card)

    const graded = {
      ...card,
      phase: 'review' as const,
      interval: 1,
      nextShowDate: '2026-08-12',
    }
    await updateCard(graded)
    expect(await getCard(card.id)).toEqual(graded)

    await deleteCard(card.id)
    expect(await getCard(card.id)).toBeUndefined()
  })

  test('lists cards by deck', async () => {
    await createCard(makeCard({ id: 'card-1', deckId: 'deck-1' }))
    await createCard(makeCard({ id: 'card-2', deckId: 'deck-1' }))
    await createCard(makeCard({ id: 'card-3', deckId: 'deck-2' }))
    const cards = await getCardsByDeck('deck-1')
    expect(cards.map((c) => c.id).sort()).toEqual(['card-1', 'card-2'])
  })

  test('returns only review-phase cards due on or before today', async () => {
    await createCard(
      makeCard({ id: 'due', phase: 'review', nextShowDate: '2026-08-10' }),
    )
    await createCard(
      makeCard({ id: 'future', phase: 'review', nextShowDate: '2026-08-20' }),
    )
    await createCard(makeCard({ id: 'learning', phase: 'learning' }))

    const due = await getDueCards('2026-08-11')
    expect(due.map((c) => c.id)).toEqual(['due'])
  })
})

describe('snapshots', () => {
  test('upserts one record per deck per day', async () => {
    await putSnapshot({
      deckId: 'deck-1',
      date: '2026-08-11',
      newCount: 5,
      shakyCount: 2,
      solidCount: 1,
      masteredCount: 0,
    })
    await putSnapshot({
      deckId: 'deck-1',
      date: '2026-08-11',
      newCount: 4,
      shakyCount: 2,
      solidCount: 2,
      masteredCount: 0,
    })

    const snapshots = await getSnapshotsByDeck('deck-1')
    expect(snapshots).toHaveLength(1)
    expect(snapshots[0].newCount).toBe(4)
  })
})

describe('fixtures', () => {
  test('seed fixtures write and read back cleanly', async () => {
    const decks = buildFixtureDecks()
    const cards = buildFixtureCards()

    await Promise.all(decks.map(createDeck))
    await Promise.all(cards.map(createCard))

    expect(await getAllDecks()).toHaveLength(decks.length)
    for (const card of cards) {
      expect(await getCard(card.id)).toEqual(card)
    }
  })
})
