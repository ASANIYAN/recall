import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { getCardsByDeck, getDeck } from '@/db/client'
import type { Card, Deck } from '@/db/schema'
import { AddCardDialog } from '@/features/cards/AddCardDialog'
import { AggregateBar } from '@/features/mastery/AggregateBar'
import { deriveMastery } from '@/features/mastery/deriveMastery'
import { MasteryStamp } from '@/features/mastery/MasteryStamp'
import { FormattedContent } from '@/shared/FormattedContent'

export function DeckDetail() {
  const { deckId } = useParams<{ deckId: string }>()
  const [deck, setDeck] = useState<Deck | null>(null)
  const [cards, setCards] = useState<Card[] | null>(null)

  const refresh = useCallback(async () => {
    if (!deckId) return
    const [loadedDeck, loadedCards] = await Promise.all([
      getDeck(deckId),
      getCardsByDeck(deckId),
    ])
    setDeck(loadedDeck ?? null)
    setCards(loadedCards)
  }, [deckId])

  useEffect(() => {
    refresh()
  }, [refresh])

  if (!deck || !cards) return null

  return (
    <div className="min-h-svh bg-bg p-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <Link to="/" className="font-mono text-ink-60 text-xs hover:text-ink">
          ← Decks
        </Link>

        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-2xl text-ink uppercase">
            {deck.name}
          </h1>
          <div className="flex items-center gap-3">
            <Link
              to={`/decks/${deck.id}/stats`}
              className="font-mono text-ink-60 text-xs hover:text-ink"
            >
              Stats
            </Link>
            <AddCardDialog
              decks={[deck]}
              defaultDeckId={deck.id}
              onCreated={refresh}
            />
            <Button variant="violet" asChild>
              <Link to={`/review/${deck.id}`}>Study now</Link>
            </Button>
          </div>
        </div>

        <AggregateBar cards={cards} />

        {cards.length === 0 ? (
          <div className="max-w-md border-2 border-dashed border-ink-35 p-10 text-center">
            <p className="mb-3 font-display text-2xl">［ ］</p>
            <p className="font-mono text-ink-60 text-xs">
              This deck has no cards yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between gap-4 border-[3px] border-ink bg-surface px-5 py-4"
              >
                <div className="font-sans text-ink text-sm">
                  <FormattedContent text={card.front} />
                </div>
                <MasteryStamp label={deriveMastery(card)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
