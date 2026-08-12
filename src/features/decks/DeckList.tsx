import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getAllCards, getAllDecks } from '@/db/client'
import type { Card, Deck } from '@/db/schema'
import { AggregateBar } from '@/features/mastery/AggregateBar'
import { deriveMastery } from '@/features/mastery/deriveMastery'

export function DeckList() {
  const [decks, setDecks] = useState<Deck[] | null>(null)
  const [cardsByDeck, setCardsByDeck] = useState<Record<string, Card[]>>({})

  useEffect(() => {
    let cancelled = false

    async function load() {
      const [allDecks, allCards] = await Promise.all([
        getAllDecks(),
        getAllCards(),
      ])
      if (cancelled) return

      const grouped: Record<string, Card[]> = {}
      for (const card of allCards) {
        if (!grouped[card.deckId]) grouped[card.deckId] = []
        grouped[card.deckId].push(card)
      }
      setDecks(allDecks)
      setCardsByDeck(grouped)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (!decks) return null

  if (decks.length === 0) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-bg p-8">
        <div className="max-w-md border-2 border-dashed border-ink-35 p-10 text-center">
          <p className="mb-3 font-display text-2xl">［ ］</p>
          <p className="font-mono text-xs text-ink-60">No decks yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-bg p-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <h1 className="font-display text-2xl text-ink uppercase">Decks</h1>
        {decks.map((deck) => {
          const cards = cardsByDeck[deck.id] ?? []
          const masteredCount = cards.filter(
            (card) => deriveMastery(card) === 'mastered',
          ).length
          return (
            <Link
              key={deck.id}
              to={`/decks/${deck.id}`}
              className="flex items-center justify-between border-[3px] border-ink bg-surface px-5 py-4 shadow-sm transition-transform duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div>
                <div className="font-sans font-bold text-base text-ink">
                  {deck.name}
                </div>
                <div className="mt-1 font-mono text-ink-60 text-xs">
                  {cards.length} cards · {masteredCount} mastered
                </div>
              </div>
              <AggregateBar cards={cards} size="mini" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
