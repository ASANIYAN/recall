import '@testing-library/jest-dom/vitest'
import 'fake-indexeddb/auto'

// jsdom doesn't implement matchMedia — needed by the sonner Toaster mounted in App.
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}
