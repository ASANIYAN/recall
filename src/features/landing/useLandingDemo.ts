import { useState } from 'react'
import type { Card } from '@/db/schema'
import { INITIAL_EASE_FACTOR } from '@/features/review/scheduling/constants'
import {
  type GradeCardInput,
  gradeCard,
} from '@/features/review/scheduling/gradeCard'
import type { Grade } from '@/features/review/scheduling/learningSteps'

const DEMO_FRONT = "What happens to a value's previous owner when it's moved?"
const DEMO_BACK =
  'The previous owner becomes invalid — the compiler blocks any further use of it.'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function initialSchedulingState(): GradeCardInput {
  // Starts "Shaky" (graduated, short interval) so a first grade visibly moves the stamp.
  return {
    phase: 'review',
    learningStep: 0,
    interval: 3,
    easeFactor: INITIAL_EASE_FACTOR,
    lapses: 1,
  }
}

/**
 * Drives the landing page's interactive demo using the real scheduling
 * function and the real Flashcard/GradeButtons/MasteryStamp components —
 * not a mockup. No IndexedDB involved; state lives only in memory.
 */
export function useLandingDemo() {
  const [schedulingState, setSchedulingState] = useState<GradeCardInput>(
    initialSchedulingState,
  )
  const [nextShowDate, setNextShowDate] = useState<string | undefined>(
    undefined,
  )
  const [flipped, setFlipped] = useState(false)

  const card: Card = {
    id: 'demo-card',
    deckId: 'demo-deck',
    front: DEMO_FRONT,
    back: DEMO_BACK,
    createdAt: new Date().toISOString(),
    nextShowDate,
    ...schedulingState,
  }

  function toggleFlip() {
    setFlipped((f) => !f)
  }

  function grade(selectedGrade: Grade) {
    const result = gradeCard(schedulingState, selectedGrade, todayISO())
    setSchedulingState({
      phase: result.phase,
      learningStep: result.learningStep,
      interval: result.interval,
      easeFactor: result.easeFactor,
      lapses: result.lapses,
    })
    setNextShowDate(result.nextShowDate)
    setFlipped(false)
  }

  function reset() {
    setSchedulingState(initialSchedulingState())
    setNextShowDate(undefined)
    setFlipped(false)
  }

  return { card, flipped, toggleFlip, grade, reset }
}
