import { type IDBPDatabase, openDB } from 'idb'
import type { Card, Deck, RecallDB, Snapshot } from './schema'

const DB_NAME = 'recall'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<RecallDB>> | null = null

/** Test-only: drop the cached connection so the next call reopens against a fresh `indexedDB`. */
export async function __resetDBForTests() {
  if (dbPromise) {
    ;(await dbPromise).close()
    dbPromise = null
  }
}

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<RecallDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore('decks', { keyPath: 'id' })

        const cards = db.createObjectStore('cards', { keyPath: 'id' })
        cards.createIndex('deckId', 'deckId')
        cards.createIndex('nextShowDate', 'nextShowDate')

        const snapshots = db.createObjectStore('snapshots')
        snapshots.createIndex('deckId', 'deckId')
      },
    })
  }
  return dbPromise
}

function snapshotKey(deckId: string, date: string) {
  return `${deckId}_${date}`
}

// ===== decks =====

export async function createDeck(deck: Deck) {
  const db = await getDB()
  await db.add('decks', deck)
}

export async function getDeck(id: string) {
  const db = await getDB()
  return db.get('decks', id)
}

export async function getAllDecks() {
  const db = await getDB()
  return db.getAll('decks')
}

export async function updateDeck(deck: Deck) {
  const db = await getDB()
  await db.put('decks', deck)
}

export async function deleteDeck(id: string) {
  const db = await getDB()
  await db.delete('decks', id)
}

// ===== cards =====

export async function createCard(card: Card) {
  const db = await getDB()
  await db.add('cards', card)
}

export async function getCard(id: string) {
  const db = await getDB()
  return db.get('cards', id)
}

export async function getCardsByDeck(deckId: string) {
  const db = await getDB()
  return db.getAllFromIndex('cards', 'deckId', deckId)
}

export async function getAllCards() {
  const db = await getDB()
  return db.getAll('cards')
}

/** Review-phase cards due on or before `today` (ISO date, YYYY-MM-DD). */
export async function getDueCards(today: string) {
  const db = await getDB()
  const range = IDBKeyRange.upperBound(today)
  const cards = await db.getAllFromIndex('cards', 'nextShowDate', range)
  return cards.filter((card) => card.phase === 'review')
}

export async function updateCard(card: Card) {
  const db = await getDB()
  await db.put('cards', card)
}

export async function deleteCard(id: string) {
  const db = await getDB()
  await db.delete('cards', id)
}

// ===== snapshots =====

/** Upsert — one record per deck per day, keyed on `deckId` + `date`. */
export async function putSnapshot(snapshot: Snapshot) {
  const db = await getDB()
  await db.put(
    'snapshots',
    snapshot,
    snapshotKey(snapshot.deckId, snapshot.date),
  )
}

export async function getSnapshotsByDeck(deckId: string) {
  const db = await getDB()
  return db.getAllFromIndex('snapshots', 'deckId', deckId)
}
