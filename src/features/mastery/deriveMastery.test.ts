import { describe, expect, test } from 'vitest'
import { deriveMastery } from './deriveMastery'

describe('deriveMastery', () => {
  test('learning phase with no lapses is new', () => {
    expect(deriveMastery({ phase: 'learning', interval: 0, lapses: 0 })).toBe(
      'new',
    )
  })

  test('learning phase after regressing from review is shaky, not new', () => {
    expect(deriveMastery({ phase: 'learning', interval: 15, lapses: 1 })).toBe(
      'shaky',
    )
  })

  test('review phase boundary values', () => {
    expect(deriveMastery({ phase: 'review', interval: 6.99, lapses: 0 })).toBe(
      'shaky',
    )
    expect(deriveMastery({ phase: 'review', interval: 7, lapses: 0 })).toBe(
      'solid',
    )
    expect(deriveMastery({ phase: 'review', interval: 21, lapses: 0 })).toBe(
      'solid',
    )
    expect(deriveMastery({ phase: 'review', interval: 21.01, lapses: 0 })).toBe(
      'mastered',
    )
  })

  test('review phase ignores stale lapses once re-graduated', () => {
    expect(deriveMastery({ phase: 'review', interval: 30, lapses: 3 })).toBe(
      'mastered',
    )
  })
})
