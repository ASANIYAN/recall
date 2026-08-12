import { Link } from 'react-router'
import { AddCardDialog } from '@/features/cards/AddCardDialog'
import { AggregateBar } from '@/features/mastery/AggregateBar'
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
        <div className="max-w-md border-2 border-dashed border-ink-35 p-10 text-center">
          <p className="mb-3 font-display text-2xl">［ ］</p>
          <p className="mb-4 font-mono text-ink-60 text-xs">No decks yet.</p>
          <AddDeckDialog onCreated={refresh} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-bg p-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-2xl text-ink uppercase">Decks</h1>
          <div className="flex items-center gap-3">
            <TextLink to="/data">Data</TextLink>
            <AddDeckDialog onCreated={refresh} />
            <AddCardDialog decks={decks} onCreated={refresh} />
          </div>
        </div>
        {deckSummaries.map(({ deck, cards, masteredCount }) => (
          <Link
            key={deck.id}
            to={`/decks/${deck.id}`}
            className="flex items-center justify-between border-[3px] border-ink bg-surface px-5 py-4 shadow-sm transition-transform duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
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
        ))}
      </div>
    </div>
  )
}
