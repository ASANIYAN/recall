import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { getCardsByDeck, getDeck, getSnapshotsByDeck } from '@/db/client'
import type { Card, Deck, Snapshot } from '@/db/schema'
import { deriveMastery } from '@/features/mastery/deriveMastery'
import { MasteryTrendChart } from './MasteryTrendChart'
import { ProblemCardsList } from './ProblemCardsList'
import { StatBlock } from './StatBlock'
import { writeSnapshotForDeck } from './writeSnapshot'

export function StatsPage() {
  const { deckId } = useParams<{ deckId: string }>()
  const [deck, setDeck] = useState<Deck | null>(null)
  const [cards, setCards] = useState<Card[] | null>(null)
  const [snapshots, setSnapshots] = useState<Snapshot[] | null>(null)

  useEffect(() => {
    if (!deckId) return
    let cancelled = false

    async function load() {
      await writeSnapshotForDeck(deckId as string)
      const [loadedDeck, loadedCards, loadedSnapshots] = await Promise.all([
        getDeck(deckId as string),
        getCardsByDeck(deckId as string),
        getSnapshotsByDeck(deckId as string),
      ])
      if (cancelled) return
      setDeck(loadedDeck ?? null)
      setCards(loadedCards)
      setSnapshots(loadedSnapshots)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [deckId])

  if (!deck || !cards || !snapshots) return null

  const masteryCounts = { new: 0, shaky: 0, solid: 0, mastered: 0 }
  let highestLapses = 0
  for (const card of cards) {
    masteryCounts[deriveMastery(card)]++
    highestLapses = Math.max(highestLapses, card.lapses)
  }

  return (
    <div className="min-h-svh bg-bg p-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <Link
          to={`/decks/${deck.id}`}
          className="font-mono text-ink-60 text-xs hover:text-ink"
        >
          ← {deck.name}
        </Link>
        <h1 className="font-display text-2xl text-ink uppercase">Stats</h1>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatBlock value={masteryCounts.mastered} label="Mastered" />
          <StatBlock value={masteryCounts.solid} label="Solid" />
          <StatBlock value={masteryCounts.shaky} label="Shaky" />
          <StatBlock value={highestLapses} label="Highest lapses" />
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
