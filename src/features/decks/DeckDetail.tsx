import { Link, useParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { AddCardDialog } from '@/features/cards/AddCardDialog'
import { AggregateBar } from '@/features/mastery/AggregateBar'
import { deriveMastery } from '@/features/mastery/deriveMastery'
import { MasteryStamp } from '@/features/mastery/MasteryStamp'
import { FormattedContent } from '@/shared/FormattedContent'
import { PageLoading } from '@/shared/PageLoading'
import { PageMessage } from '@/shared/PageMessage'
import { TextLink } from '@/shared/TextLink'
import { useDeckDetail } from './useDeckDetail'

export function DeckDetail() {
  const { deckId } = useParams<{ deckId: string }>()
  const { deck, cards, refresh } = useDeckDetail(deckId)

  if (deck === undefined || !cards) return <PageLoading />

  if (deck === null) {
    return (
      <PageMessage
        title="Deck Not Found"
        message="This deck does not exist, or was deleted."
        linkTo="/app"
        linkLabel="← Back to decks"
      />
    )
  }

  return (
    <div className="min-h-svh bg-bg p-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <TextLink to="/app">← Decks</TextLink>

        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-2xl text-ink uppercase">
            {deck.name}
          </h1>
          <div className="flex items-center gap-3">
            <TextLink to={`/decks/${deck.id}/stats`}>Stats</TextLink>
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
          <div className="max-w-xl border-2 border-dashed border-ink-35 p-10 text-center">
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
