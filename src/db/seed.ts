import { createCard, createDeck } from './client'
import type { Card, Deck } from './schema'

function isoDate(daysFromToday: number) {
  const d = new Date()
  d.setDate(d.getDate() + daysFromToday)
  return d.toISOString().slice(0, 10)
}

export function buildFixtureDecks(): Deck[] {
  return [
    {
      id: 'deck-rust',
      name: 'Rust Fundamentals',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'deck-sysdesign',
      name: 'System Design Basics',
      createdAt: new Date().toISOString(),
    },
  ]
}

/** One card in each scheduling state: new, learning, shaky, solid, mastered. */
export function buildFixtureCards(): Card[] {
  const createdAt = new Date().toISOString()

  return [
    {
      id: 'card-new',
      deckId: 'deck-rust',
      front: 'What does the `?` operator do?',
      back: 'Propagates an `Err`/`None` early from the current function.',
      createdAt,
      phase: 'learning',
      learningStep: 0,
      interval: 0,
      easeFactor: 2.5,
      lapses: 0,
    },
    {
      id: 'card-learning',
      deckId: 'deck-rust',
      front: 'What is ownership?',
      back: 'Each value has a single owner; when the owner goes out of scope, the value is dropped.',
      createdAt,
      phase: 'learning',
      learningStep: 1,
      interval: 0,
      easeFactor: 2.5,
      lapses: 0,
    },
    {
      id: 'card-shaky',
      deckId: 'deck-rust',
      front: "What happens to a value's previous owner when it's moved?",
      back: 'The previous owner becomes invalid — the compiler blocks any further use of it.',
      createdAt,
      phase: 'review',
      learningStep: 0,
      interval: 3,
      easeFactor: 2.3,
      nextShowDate: isoDate(0),
      lapses: 2,
    },
    {
      id: 'card-solid',
      deckId: 'deck-rust',
      front: 'What is a trait object?',
      back: 'A dynamically-dispatched value behind `dyn Trait`, used when the concrete type is not known at compile time.',
      createdAt,
      phase: 'review',
      learningStep: 0,
      interval: 12,
      easeFactor: 2.5,
      nextShowDate: isoDate(-1),
      lapses: 0,
    },
    {
      id: 'card-mastered',
      deckId: 'deck-sysdesign',
      front: 'What problem does a load balancer solve?',
      back: 'Distributes traffic across multiple servers so no single server is a bottleneck or single point of failure.',
      createdAt,
      phase: 'review',
      learningStep: 0,
      interval: 45,
      easeFactor: 2.8,
      nextShowDate: isoDate(5),
      lapses: 0,
    },
  ]
}

export async function seedDevData() {
  const decks = buildFixtureDecks()
  const cards = buildFixtureCards()
  await Promise.all(decks.map(createDeck))
  await Promise.all(cards.map(createCard))
}
