import { Component, type ReactNode } from 'react'
import { PageMessage } from './PageMessage'

const RELOAD_FLAG_KEY = 'recall:chunk-reload-attempted'

interface ChunkErrorBoundaryProps {
  children: ReactNode
}

interface ChunkErrorBoundaryState {
  hasError: boolean
}

/**
 * A lazy-loaded chunk's filename is hashed per build. If a tab stays open
 * across a new deploy, its already-loaded code still points at the old
 * hash, which the new deploy no longer serves — the dynamic import()
 * rejects, React re-throws during render, and with no boundary that
 * crashes to a blank page (see the bug this fixes).
 *
 * First failure: reload once to pick up the current deploy's asset
 * manifest — this is the common case and self-heals silently. If it
 * happens again in the same session, it's a real error, not a stale
 * deploy, so show a way out instead of reload-looping forever.
 */
export class ChunkErrorBoundary extends Component<
  ChunkErrorBoundaryProps,
  ChunkErrorBoundaryState
> {
  state: ChunkErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    if (sessionStorage.getItem(RELOAD_FLAG_KEY) !== '1') {
      sessionStorage.setItem(RELOAD_FLAG_KEY, '1')
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      if (sessionStorage.getItem(RELOAD_FLAG_KEY) !== '1') {
        // componentDidCatch is about to reload the page — render nothing
        // rather than flash an error message that's about to disappear.
        return null
      }
      return (
        <PageMessage
          title="Could Not Load"
          message="Something went wrong loading this page. Try refreshing."
          linkTo="/app"
          linkLabel="← Back to decks"
        />
      )
    }
    return this.props.children
  }
}
