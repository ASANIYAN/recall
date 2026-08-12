import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useParams } from 'react-router'
import { Toaster } from '@/components/ui/sonner'
import { DataSettings } from '@/features/data/DataSettings'
import { DeckDetail } from '@/features/decks/DeckDetail'
import { DeckList } from '@/features/decks/DeckList'
import { ReviewSession } from '@/features/review/ReviewSession'
import { ChunkErrorBoundary } from '@/shared/ChunkErrorBoundary'
import { PageLoading } from '@/shared/PageLoading'
import { PageMessage } from '@/shared/PageMessage'

// recharts is heavy and only needed on the stats page — the review loop is
// the daily-use core path, so it stays out of the main bundle.
const StatsPage = lazy(() =>
  import('@/features/stats/StatsPage').then((m) => ({ default: m.StatsPage })),
)

// Motion (the animation library) is landing-page only — lazy so it never
// loads for anyone going straight to the app itself.
const LandingPage = lazy(() =>
  import('@/features/landing/LandingPage').then((m) => ({
    default: m.LandingPage,
  })),
)

function ReviewRoute() {
  const { deckId } = useParams<{ deckId: string }>()
  return <ReviewSession deckId={deckId} />
}

function NotFoundRoute() {
  return (
    <PageMessage
      title="Not Found"
      message="That page does not exist."
      linkTo="/app"
      linkLabel="← Back to decks"
    />
  )
}

function App() {
  useEffect(() => {
    // A prior tab session may have set this after a stale-deploy chunk
    // failure. This boot succeeded, so any future failure is fresh and
    // deserves its own reload attempt rather than skipping straight to
    // the fallback message.
    sessionStorage.removeItem('recall:chunk-reload-attempted')
  }, [])

  return (
    <BrowserRouter>
      <ChunkErrorBoundary>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<PageLoading />}>
                <LandingPage />
              </Suspense>
            }
          />
          <Route path="/app" element={<DeckList />} />
          <Route path="/decks/:deckId" element={<DeckDetail />} />
          <Route path="/review" element={<ReviewSession />} />
          <Route path="/review/:deckId" element={<ReviewRoute />} />
          <Route path="/data" element={<DataSettings />} />
          <Route
            path="/decks/:deckId/stats"
            element={
              <Suspense fallback={<PageLoading />}>
                <StatsPage />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFoundRoute />} />
        </Routes>
      </ChunkErrorBoundary>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
