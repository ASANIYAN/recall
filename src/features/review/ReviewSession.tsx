import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useEffect, useState } from 'react'
import { PageLoading } from '@/shared/PageLoading'
import { PageMessage } from '@/shared/PageMessage'
import { TextLink } from '@/shared/TextLink'
import { Flashcard } from './Flashcard'
import { GradeButtons } from './GradeButtons'
import type { Grade } from './scheduling/learningSteps'
import { useReviewSession } from './useReviewSession'

const GRADE_BY_KEY: Record<string, Grade> = {
  '1': 'again',
  '2': 'hard',
  '3': 'good',
  '4': 'easy',
}

interface ReviewSessionProps {
  deckId?: string
}

/** Keyboard-first review loop: Space flips, 1–4 grade. See CLAUDE.md §7. */
export function ReviewSession({ deckId }: ReviewSessionProps) {
  const { currentCard, loading, loadError, isTransitioning, grade } =
    useReviewSession(deckId)
  const [flipped, setFlipped] = useState(false)
  const [queueParent] = useAutoAnimate()

  const exitTo = deckId ? `/decks/${deckId}` : '/'

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional — resets flip state whenever the card changes, even though the id itself isn't read
  useEffect(() => {
    setFlipped(false)
  }, [currentCard?.id])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!currentCard) return

      if (event.code === 'Space') {
        event.preventDefault()
        setFlipped((f) => !f)
        return
      }

      if (!flipped || isTransitioning) return
      const selectedGrade = GRADE_BY_KEY[event.key]
      if (selectedGrade) grade(selectedGrade)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [currentCard, flipped, isTransitioning, grade])

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
        <div className="max-w-md border-2 border-dashed border-ink-35 p-10 text-center">
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
          onFlip={() => setFlipped((f) => !f)}
        />
      </div>
      {flipped && <GradeButtons onGrade={grade} disabled={isTransitioning} />}
    </div>
  )
}
