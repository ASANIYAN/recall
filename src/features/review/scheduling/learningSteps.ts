export type Grade = 'again' | 'hard' | 'good' | 'easy'

/** Same-day step sequence: 1 min, 10 min, 1 day. */
export const LEARNING_STEP_MINUTES = [1, 10, 1440] as const

export interface LearningStepResult {
  graduated: boolean
  learningStep: number
}

/**
 * Advances a learning-phase card's step per its grade.
 * Again resets to the first step. Hard repeats the current step — the
 * review-phase grade table doesn't define what Hard means during
 * learning, so it's treated as "struggled, not wrong": no advance, no reset.
 * Good/Easy advance a step; clearing the last step graduates the card.
 */
export function advanceLearningStep(
  currentStep: number,
  grade: Grade,
): LearningStepResult {
  if (grade === 'again') {
    return { graduated: false, learningStep: 0 }
  }
  if (grade === 'hard') {
    return { graduated: false, learningStep: currentStep }
  }
  const nextStep = currentStep + 1
  if (nextStep >= LEARNING_STEP_MINUTES.length) {
    return { graduated: true, learningStep: 0 }
  }
  return { graduated: false, learningStep: nextStep }
}
