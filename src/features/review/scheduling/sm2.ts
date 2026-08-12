import {
  EASE_FACTOR_FLOOR,
  EASY_EASE_DELTA,
  EASY_INTERVAL_MULTIPLIER,
  HARD_EASE_DELTA,
  HARD_INTERVAL_MULTIPLIER,
} from './constants'
import type { Grade } from './learningSteps'

export type ReviewGrade = Exclude<Grade, 'again'>

export interface ReviewResult {
  interval: number
  easeFactor: number
}

/**
 * SM-2-style interval/easeFactor math for a review-phase card.
 * Again is not a ReviewGrade: it regresses the card to the learning phase
 * instead, which the caller (gradeCard.ts) handles directly.
 */
export function applyReviewGrade(
  currentInterval: number,
  currentEaseFactor: number,
  grade: ReviewGrade,
): ReviewResult {
  switch (grade) {
    case 'hard':
      return {
        interval: currentInterval * HARD_INTERVAL_MULTIPLIER,
        easeFactor: Math.max(
          EASE_FACTOR_FLOOR,
          currentEaseFactor + HARD_EASE_DELTA,
        ),
      }
    case 'good':
      return {
        interval: currentInterval * currentEaseFactor,
        easeFactor: currentEaseFactor,
      }
    case 'easy':
      return {
        interval:
          currentInterval * currentEaseFactor * EASY_INTERVAL_MULTIPLIER,
        easeFactor: currentEaseFactor + EASY_EASE_DELTA,
      }
  }
}
