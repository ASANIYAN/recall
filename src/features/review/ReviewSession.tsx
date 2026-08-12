import { useAutoAnimate } from '@formkit/auto-animate/react'
import { PageLoading } from '@/shared/PageLoading'
import { PageMessage } from '@/shared/PageMessage'
import { TextLink } from '@/shared/TextLink'
import { Flashcard } from './Flashcard'
import { GradeButtons } from './GradeButtons'
import { useReviewSession } from './useReviewSession'

interface ReviewSessionProps {
  deckId?: string
}

export function ReviewSession({ deckId }: ReviewSessionProps) {
  const {
    currentCard,
    loading,
    loadError,
    isTransitioning,
    flipped,
    toggleFlip,
    grade,
  } = useReviewSession(deckId)
  const [queueParent] = useAutoAnimate()

  const exitTo = deckId ? `/decks/${deckId}` : '/app'

  if (loading) return <PageLoading />

  if (loadError) {
    return (
      <PageMessage
        title="Could Not Load"
        message="Something went wrong loading this review session."
        linkTo={exitTo}
        linkLabel="← Exit review"
      />
    )
  }

  if (!currentCard) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-bg p-8">
        <TextLink to={exitTo} className="self-start">
          ← Exit review
        </TextLink>
        <div className="max-w-xl border-2 border-dashed border-ink-35 p-10 text-center">
          <p className="mb-3 font-display text-2xl">［ ］</p>
          <p className="font-mono text-xs text-ink-60">
            Nothing due right now.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-bg p-8">
      <TextLink to={exitTo} className="self-start">
        ← Exit review
      </TextLink>
      <div
        ref={queueParent}
        className="flex w-full max-w-md flex-col items-center gap-6"
      >
        <Flashcard
          key={currentCard.id}
          card={currentCard}
          flipped={flipped}
          onFlip={toggleFlip}
        />
      </div>
      {flipped && <GradeButtons onGrade={grade} disabled={isTransitioning} />}
    </div>
  )
}
