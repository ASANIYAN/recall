import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  getAllCards,
  getCardsByDeck,
  getDueCards,
  updateCard,
} from '@/db/client'
import type { Card } from '@/db/schema'
import { gradeCard } from './scheduling/gradeCard'
import { type Grade, LEARNING_STEP_MINUTES } from './scheduling/learningSteps'

/** Pause after grading so the updated mastery stamp is visible before the next card. */
const ADVANCE_DELAY_MS = 700

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

/** Alternates two arrays so the queue isn't all-learning-then-all-review. See CLAUDE.md §5. */
function interleave(a: Card[], b: Card[]): Card[] {
  const result: Card[] = []
  const max = Math.max(a.length, b.length)
  for (let i = 0; i < max; i++) {
    if (a[i]) result.push(a[i])
    if (b[i]) result.push(b[i])
  }
  return result
}

export function useReviewSession(deckId?: string) {
  const [queue, setQueue] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const queueRef = useRef<Card[]>([])
  const learningTimers = useRef(
    new Map<string, ReturnType<typeof setTimeout>>(),
  )

  useEffect(() => {
    queueRef.current = queue
  }, [queue])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setLoadError(false)
      try {
        const today = todayISO()
        const allCards = deckId
          ? await getCardsByDeck(deckId)
          : await getAllCards()
        const learningCards = allCards.filter(
          (card) => card.phase === 'learning',
        )
        const dueReviewCards = deckId
          ? (await getDueCards(today)).filter((card) => card.deckId === deckId)
          : await getDueCards(today)

        if (!cancelled) {
          setQueue(interleave(learningCards, dueReviewCards))
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setLoadError(true)
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [deckId])

  useEffect(() => {
    const timers = learningTimers.current
    return () => {
      for (const timer of timers.values()) clearTimeout(timer)
      timers.clear()
    }
  }, [])

  const grade = useCallback(
    async (selectedGrade: Grade) => {
      const current = queueRef.current[0]
      if (!current || isTransitioning) return

      setIsTransitioning(true)

      const today = todayISO()
      const result = gradeCard(current, selectedGrade, today)
      // gradeCard omits `nextShowDate` entirely on learning-phase results rather
      // than setting it undefined, so a plain spread would leave a stale date
      // from a prior review phase. Force it explicitly instead.
      const updated: Card = {
        ...current,
        ...result,
        nextShowDate: result.nextShowDate,
      }

      try {
        await updateCard(updated)
      } catch {
        toast.error('Could not save that grade. Try again.')
        setIsTransitioning(false)
        return
      }

      // Show the updated mastery state on the current card immediately.
      setQueue((prev) => [updated, ...prev.slice(1)])

      if (updated.phase === 'learning') {
        const delayMinutes = LEARNING_STEP_MINUTES[updated.learningStep]
        const timer = setTimeout(() => {
          learningTimers.current.delete(updated.id)
          setQueue((prev) => [...prev, updated])
        }, delayMinutes * 60_000)
        learningTimers.current.set(updated.id, timer)
      }

      setTimeout(() => {
        setQueue((prev) => prev.slice(1))
        setIsTransitioning(false)
      }, ADVANCE_DELAY_MS)
    },
    [isTransitioning],
  )

  return {
    currentCard: queue[0] ?? null,
    remaining: queue.length,
    loading,
    loadError,
    isTransitioning,
    grade,
  }
}
