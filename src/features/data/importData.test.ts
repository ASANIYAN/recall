import { IDBFactory } from 'fake-indexeddb'
import { beforeEach, describe, expect, test } from 'vitest'
import {
  __resetDBForTests,
  createCard,
  createDeck,
  getAllCards,
  getAllDecks,
  getCard,
  getDeck,
} from '@/db/client'
import type { Card, Deck } from '@/db/schema'
import {
  commitImport,
  computeImportSummary,
  parseImportFile,
} from './importData'
import type { ExportPayload } from './schema'

beforeEach(async () => {
  await __resetDBForTests()
  globalThis.indexedDB = new IDBFactory()
})

function makeDeck(overrides: Partial<Deck> = {}): Deck {
  return {
    id: 'deck-1',
    name: 'Deck',
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

describe('parseImportFile', () => {
  test('parses a valid export payload', () => {
    const payload: ExportPayload = { decks: [makeDeck()], cards: [makeCard()] }
    expect(parseImportFile(JSON.stringify(payload))).toEqual(payload)
  })

  test('rejects malformed JSON', () => {
    expect(() => parseImportFile('not json')).toThrow()
  })

  test('rejects JSON that does not match the export shape', () => {
    expect(() => parseImportFile(JSON.stringify({ decks: 'nope' }))).toThrow()
  })
})

describe('computeImportSummary', () => {
  test('counts new records as added and existing ones as updated', async () => {
    await createDeck(makeDeck({ id: 'deck-1' }))
    await createCard(makeCard({ id: 'card-1', deckId: 'deck-1' }))

    const payload: ExportPayload = {
      decks: [makeDeck({ id: 'deck-1' }), makeDeck({ id: 'deck-2' })],
      cards: [
        makeCard({ id: 'card-1', deckId: 'deck-1' }),
        makeCard({ id: 'card-2', deckId: 'deck-2' }),
        makeCard({ id: 'card-3', deckId: 'deck-2' }),
      ],
    }

    const summary = await computeImportSummary(payload)
    expect(summary).toEqual({
      decksAdded: 1,
      decksUpdated: 1,
      cardsAdded: 2,
      cardsUpdated: 1,
    })
  })

  test('does not write anything while just computing the summary', async () => {
    const payload: ExportPayload = { decks: [makeDeck()], cards: [makeCard()] }
    await computeImportSummary(payload)
    expect(await getAllDecks()).toHaveLength(0)
    expect(await getAllCards()).toHaveLength(0)
  })
})

describe('commitImport', () => {
  test('upserts by ID: updates existing records, adds new ones, deletes nothing', async () => {
    await createDeck(makeDeck({ id: 'deck-1', name: 'Original Name' }))
    await createCard(makeCard({ id: 'card-1', front: 'Original Front' }))
    await createCard(
      makeCard({ id: 'card-untouched', front: 'Should survive' }),
    )

    const payload: ExportPayload = {
      decks: [
        makeDeck({ id: 'deck-1', name: 'Renamed' }),
        makeDeck({ id: 'deck-2', name: 'New Deck' }),
      ],
      cards: [
        makeCard({ id: 'card-1', front: 'Updated Front' }),
        makeCard({ id: 'card-2', front: 'Brand New' }),
      ],
    }

    await commitImport(payload)

    expect((await getDeck('deck-1'))?.name).toBe('Renamed')
    expect((await getDeck('deck-2'))?.name).toBe('New Deck')
    expect((await getCard('card-1'))?.front).toBe('Updated Front')
    expect((await getCard('card-2'))?.front).toBe('Brand New')
    // Nothing outside the import payload was deleted.
    expect((await getCard('card-untouched'))?.front).toBe('Should survive')
  })
})
