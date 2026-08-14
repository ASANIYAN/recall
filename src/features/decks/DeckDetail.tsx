import { Link, useParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { AddCardDialog } from '@/features/cards/AddCardDialog'
import { AggregateBar } from '@/features/mastery/AggregateBar'
import { deriveMastery } from '@/features/mastery/deriveMastery'
import { MasteryStamp } from '@/features/mastery/MasteryStamp'
import { EmptyState } from '@/shared/EmptyState'
import { FormattedContent } from '@/shared/FormattedContent'
import { ListItemCard } from '@/shared/ListItemCard'
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
    <div className="min-h-svh bg-bg p-4 sm:p-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <TextLink to="/app">← Decks</TextLink>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="wrap-break-word font-display text-2xl text-ink uppercase">
            {deck.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
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
          <EmptyState message="This deck has no cards yet." />
        ) : (
          <div className="flex flex-col gap-3">
            {cards.map((card) => (
              <ListItemCard key={card.id} className="gap-4">
                <div className="min-w-0 flex-1 wrap-break-word font-sans text-ink text-sm">
                  <FormattedContent text={card.front} />
                </div>
                <MasteryStamp label={deriveMastery(card)} />
              </ListItemCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
