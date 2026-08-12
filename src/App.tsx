import { BrowserRouter, Route, Routes, useParams } from 'react-router'
import { DeckDetail } from '@/features/decks/DeckDetail'
import { DeckList } from '@/features/decks/DeckList'
import { ReviewSession } from '@/features/review/ReviewSession'

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
      </Routes>
    </BrowserRouter>
  )
}

export default App
