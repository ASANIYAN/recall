import { useParams } from 'react-router'
import { PageLoading } from '@/shared/PageLoading'
import { PageMessage } from '@/shared/PageMessage'
import { TextLink } from '@/shared/TextLink'
import { MasteryTrendChart } from './MasteryTrendChart'
import { ProblemCardsList } from './ProblemCardsList'
import { StatBlock } from './StatBlock'
import { useStatsPage } from './useStatsPage'

export function StatsPage() {
  const { deckId } = useParams<{ deckId: string }>()
  const { deck, cards, snapshots, summary } = useStatsPage(deckId)

  if (deck === undefined || !cards || !snapshots || !summary)
    return <PageLoading />

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
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <TextLink to={`/decks/${deck.id}`}>← {deck.name}</TextLink>
        <h1 className="font-display text-2xl text-ink uppercase">Stats</h1>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatBlock value={summary.masteryCounts.mastered} label="Mastered" />
          <StatBlock value={summary.masteryCounts.solid} label="Solid" />
          <StatBlock value={summary.masteryCounts.shaky} label="Shaky" />
          <StatBlock value={summary.highestLapses} label="Highest lapses" />
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-display text-ink text-xs uppercase">
            Mastered Over Time
          </h2>
          <MasteryTrendChart snapshots={snapshots} />
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-display text-ink text-xs uppercase">
            Problem Cards
          </h2>
          <ProblemCardsList cards={cards} />
        </div>
      </div>
    </div>
  )
}
