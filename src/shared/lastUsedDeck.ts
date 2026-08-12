const STORAGE_KEY = 'recall:last-used-deck-id'

/**
 * UI-only convenience for the quick-add form, not app data — deliberately
 * lives in localStorage, not IndexedDB, so it stays outside the
 * export/import data model entirely.
 */
export function getLastUsedDeckId(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export function setLastUsedDeckId(deckId: string) {
  localStorage.setItem(STORAGE_KEY, deckId)
}
