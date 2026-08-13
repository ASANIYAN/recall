import type { Card } from '@/db/schema'
import { ListItemCardLink } from '@/shared/ListItemCard'
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
        <ListItemCardLink
          key={card.id}
          to={`/review/${card.deckId}`}
          className="gap-4"
        >
          <p className="min-w-0 flex-1 truncate font-sans text-ink text-sm">
            {card.front}
          </p>
          <span className="shrink-0 font-mono text-ink-60 text-xs uppercase">
            {card.lapses} lapses
          </span>
        </ListItemCardLink>
      ))}
    </div>
  )
}
