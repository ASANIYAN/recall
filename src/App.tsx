import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes, useParams } from 'react-router'
import { DataSettings } from '@/features/data/DataSettings'
import { DeckDetail } from '@/features/decks/DeckDetail'
import { DeckList } from '@/features/decks/DeckList'
import { ReviewSession } from '@/features/review/ReviewSession'

// recharts is heavy and only needed on the stats page — the review loop is
// the daily-use core path, so it stays out of the main bundle. Same
// reasoning CLAUDE.md §2 gives for keeping Motion out of the app bundle.
const StatsPage = lazy(() => import('@/features/stats/StatsPage').then((m) => ({ default: m.StatsPage })))

function ReviewRoute() {
  const { deckId } = useParams<{ deckId: string }>()
  return <ReviewSession deckId={deckId} />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DeckList />} />
        <Route path="/decks/:deckId" element={<DeckDetail />} />
        <Route path="/review" element={<ReviewSession />} />
        <Route path="/review/:deckId" element={<ReviewRoute />} />
        <Route path="/data" element={<DataSettings />} />
        <Route
          path="/decks/:deckId/stats"
          element={
            <Suspense fallback={null}>
              <StatsPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
