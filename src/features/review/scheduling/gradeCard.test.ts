import { describe, expect, test } from 'vitest'
import { EASE_FACTOR_FLOOR, INITIAL_EASE_FACTOR } from './constants'
import { type GradeCardInput, gradeCard } from './gradeCard'

const TODAY = '2026-08-11'

function newCard(overrides: Partial<GradeCardInput> = {}): GradeCardInput {
  return {
    phase: 'learning',
    learningStep: 0,
    interval: 0,
    easeFactor: INITIAL_EASE_FACTOR,
    lapses: 0,
    ...overrides,
  }
}

describe('first-ever review on a new card', () => {
  test('Again, then Good, then Easy tracks the learning step correctly', () => {
    let card = newCard()

    card = gradeCard(card, 'again', TODAY)
    expect(card).toMatchObject({ phase: 'learning', learningStep: 0 })

    card = gradeCard(card, 'good', TODAY)
    expect(card).toMatchObject({ phase: 'learning', learningStep: 1 })

    card = gradeCard(card, 'easy', TODAY)
    expect(card).toMatchObject({ phase: 'learning', learningStep: 2 })
  })

  test('clearing the final learning step graduates the card', () => {
    const card = newCard({ learningStep: 2 })
    const result = gradeCard(card, 'good', TODAY)
    expect(result.phase).toBe('review')
    expect(result.interval).toBe(1)
    expect(result.easeFactor).toBe(INITIAL_EASE_FACTOR)
    expect(result.nextShowDate).toBe('2026-08-12')
  })
})

describe('easeFactor floor', () => {
  test('repeated Hard in review phase never crosses the floor', () => {
    let card: GradeCardInput = {
      phase: 'review',
      learningStep: 0,
      interval: 10,
      easeFactor: INITIAL_EASE_FACTOR,
      lapses: 0,
    }

    for (let i = 0; i < 20; i++) {
      card = gradeCard(card, 'hard', TODAY)
      expect(card.easeFactor).toBeGreaterThanOrEqual(EASE_FACTOR_FLOOR)
    }
    expect(card.easeFactor).toBe(EASE_FACTOR_FLOOR)
  })

  test('a single Again near the floor clamps instead of undershooting', () => {
    const card: GradeCardInput = {
      phase: 'review',
      learningStep: 0,
      interval: 10,
      easeFactor: 1.35,
      lapses: 0,
    }
    const result = gradeCard(card, 'again', TODAY)
    expect(result.easeFactor).toBe(EASE_FACTOR_FLOOR)
  })
})

describe('interval growth over a sequence of Goods', () => {
  test('grows multiplicatively, not additively', () => {
    let card: GradeCardInput = {
      phase: 'review',
      learningStep: 0,
      interval: 1,
      easeFactor: 2.5,
      lapses: 0,
    }

    card = gradeCard(card, 'good', TODAY)
    expect(card.interval).toBe(2.5)

    card = gradeCard(card, 'good', TODAY)
    expect(card.interval).toBe(6.25)

    card = gradeCard(card, 'good', TODAY)
    expect(card.interval).toBeCloseTo(15.625)
  })
})

describe('mature card hitting Again', () => {
  test('regresses to learning phase and drops nextShowDate', () => {
    const card: GradeCardInput = {
      phase: 'review',
      learningStep: 0,
      interval: 15,
      easeFactor: 2.5,
      lapses: 0,
    }
    const result = gradeCard(card, 'again', TODAY)
    expect(result.phase).toBe('learning')
    expect(result.learningStep).toBe(0)
    expect(result.easeFactor).toBeCloseTo(2.3)
    expect(result.lapses).toBe(1)
    expect(result.nextShowDate).toBeUndefined()
  })
})

describe('reviewing early or late relative to nextShowDate', () => {
  test('always recalculates nextShowDate from today, not the prior due date', () => {
    const card: GradeCardInput = {
      phase: 'review',
      learningStep: 0,
      interval: 5,
      easeFactor: 2.5,
      lapses: 0,
    }

    // Reviewed several days before it was due.
    const early = gradeCard(card, 'good', '2026-08-11')
    expect(early.nextShowDate).toBe(addDaysExpected('2026-08-11', 12.5))

    // Reviewed several days after it was due.
    const late = gradeCard(card, 'good', '2026-09-01')
    expect(late.nextShowDate).toBe(addDaysExpected('2026-09-01', 12.5))
  })
})

function addDaysExpected(today: string, days: number): string {
  const d = new Date(`${today}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + Math.round(days))
  return d.toISOString().slice(0, 10)
}
