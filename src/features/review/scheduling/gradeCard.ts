import type { CardPhase } from '@/db/schema'
import {
  AGAIN_EASE_DELTA,
  EASE_FACTOR_FLOOR,
  GRADUATION_INTERVAL_DAYS,
  INITIAL_EASE_FACTOR,
} from './constants'
import { advanceLearningStep, type Grade } from './learningSteps'
import { applyReviewGrade } from './sm2'

export interface GradeCardInput {
  phase: CardPhase
  learningStep: number
  interval: number
  easeFactor: number
  lapses: number
}

export interface GradeCardResult {
  phase: CardPhase
  learningStep: number
  interval: number
  easeFactor: number
  /** Set only when the result is review-phase — learning-phase due-ness is tracked in-memory, not persisted. */
  nextShowDate?: string
  lapses: number
}

/** `today` is an ISO date (YYYY-MM-DD). Adds fractional days by rounding to whole days. */
export function addDays(today: string, days: number): string {
  const d = new Date(`${today}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + Math.round(days))
  return d.toISOString().slice(0, 10)
}

/**
 * Applies a grade to a card and returns its next scheduling state.
 * `today` drives `nextShowDate` — always recalculated from today, never
 * from the card's previous `nextShowDate`, so early/late reviews don't
 * throw off the schedule (see PLAN.md Phase 2 edge case).
 */
export function gradeCard(
  card: GradeCardInput,
  grade: Grade,
  today: string,
): GradeCardResult {
  if (card.phase === 'learning') {
    const { graduated, learningStep } = advanceLearningStep(
      card.learningStep,
      grade,
    )
    if (!graduated) {
      return { ...card, learningStep }
    }
    return {
      phase: 'review',
      learningStep: 0,
      interval: GRADUATION_INTERVAL_DAYS,
      easeFactor: INITIAL_EASE_FACTOR,
      nextShowDate: addDays(today, GRADUATION_INTERVAL_DAYS),
      lapses: card.lapses,
    }
  }

  if (grade === 'again') {
    return {
      phase: 'learning',
      learningStep: 0,
      interval: card.interval,
      easeFactor: Math.max(
        EASE_FACTOR_FLOOR,
        card.easeFactor + AGAIN_EASE_DELTA,
      ),
      lapses: card.lapses + 1,
    }
  }

  const { interval, easeFactor } = applyReviewGrade(
    card.interval,
    card.easeFactor,
    grade,
  )
  return {
    phase: 'review',
    learningStep: 0,
    interval,
    easeFactor,
    nextShowDate: addDays(today, interval),
    lapses: card.lapses,
  }
}
