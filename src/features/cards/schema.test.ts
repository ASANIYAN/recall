import { describe, expect, test } from 'vitest'
import { parseTags } from './schema'

describe('parseTags', () => {
  test('splits comma-separated input and trims whitespace', () => {
    expect(parseTags('ownership, borrowing,  lifetimes')).toEqual([
      'ownership',
      'borrowing',
      'lifetimes',
    ])
  })

  test('drops empty entries from stray commas', () => {
    expect(parseTags('ownership,, borrowing,')).toEqual(['ownership', 'borrowing'])
  })

  test('returns undefined for empty or whitespace-only input', () => {
    expect(parseTags(undefined)).toBeUndefined()
    expect(parseTags('')).toBeUndefined()
    expect(parseTags('   ')).toBeUndefined()
    expect(parseTags(',,,')).toBeUndefined()
  })
})
