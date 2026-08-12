import { Link } from 'react-router'
import type { Card } from '@/db/schema'
import { selectProblemCards } from './selectProblemCards'

interface ProblemCardsListProps {
  cards: Card[]
}

export function ProblemCardsList({ cards }: ProblemCardsListProps) {
  const problemCards = selectProblemCards(cards)

  if (problemCards.length === 0) {
    return (
      <p className="font-mono text-ink-60 text-xs">
        No problem cards yet — nothing has lapsed.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {problemCards.map((card) => (
        <Link
          key={card.id}
          to={`/review/${card.deckId}`}
          className="flex items-center justify-between gap-4 border-[3px] border-ink bg-surface px-5 py-4 shadow-sm transition-transform duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
        >
          <p className="min-w-0 flex-1 truncate font-sans text-ink text-sm">
            {card.front}
          </p>
          <span className="shrink-0 font-mono text-ink-60 text-xs uppercase">
            {card.lapses} lapses
          </span>
        </Link>
      ))}
    </div>
  )
}
