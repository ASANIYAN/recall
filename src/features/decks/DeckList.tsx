import { AddCardDialog } from '@/features/cards/AddCardDialog'
import { AggregateBar } from '@/features/mastery/AggregateBar'
import { EmptyState } from '@/shared/EmptyState'
import { ListItemCardLink } from '@/shared/ListItemCard'
import { PageLoading } from '@/shared/PageLoading'
import { TextLink } from '@/shared/TextLink'
import { AddDeckDialog } from './AddDeckDialog'
import { useDeckList } from './useDeckList'

export function DeckList() {
  const { deckSummaries, decks, refresh } = useDeckList()

  if (!deckSummaries) return <PageLoading />

  if (deckSummaries.length === 0) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-bg p-8">
        <EmptyState message="No decks yet." className="p-10">
          <AddDeckDialog onCreated={refresh} />
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-bg p-4 sm:p-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-2xl text-ink uppercase">Decks</h1>
          <div className="flex flex-wrap items-center gap-3">
            <TextLink to="/data">Data</TextLink>
            <AddDeckDialog onCreated={refresh} />
            <AddCardDialog decks={decks} onCreated={refresh} />
          </div>
        </div>
        {deckSummaries.map(({ deck, cards, masteredCount }) => (
          <ListItemCardLink key={deck.id} to={`/decks/${deck.id}`}>
            <div>
              <div className="font-sans font-bold text-base text-ink">
                {deck.name}
              </div>
              <div className="mt-1 font-mono text-ink-60 text-xs">
                {cards.length} cards · {masteredCount} mastered
              </div>
            </div>
            <AggregateBar cards={cards} size="mini" />
          </ListItemCardLink>
        ))}
      </div>
    </div>
  )
}
