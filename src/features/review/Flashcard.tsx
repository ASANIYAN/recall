import { useAutoAnimate } from '@formkit/auto-animate/react'
import type { Card } from '@/db/schema'
import { deriveMastery } from '@/features/mastery/deriveMastery'
import { MasteryStamp } from '@/features/mastery/MasteryStamp'
import { FormattedContent } from '@/shared/FormattedContent'

interface FlashcardProps {
  card: Card
  flipped: boolean
  onFlip: () => void
}

export function Flashcard({ card, flipped, onFlip }: FlashcardProps) {
  const mastery = deriveMastery(card)
  const [stampParent] = useAutoAnimate()

  return (
    <button
      type="button"
      onClick={onFlip}
      className="w-full max-w-md cursor-pointer text-left [perspective:1200px] focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-4"
      aria-label="Flip card"
    >
      <div
        className={`relative min-h-64 w-full [transform-style:preserve-3d] transition-transform duration-200 ease-out active:scale-[0.98] ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        <div className="absolute inset-0 flex flex-col justify-center gap-4 overflow-y-auto wrap-break-word border-[3px] border-ink bg-surface p-4 shadow-md sm:p-6 [backface-visibility:hidden]">
          <p className="font-mono text-xs text-ink-60">Front</p>
          <div className="font-sans text-lg">
            <FormattedContent text={card.front} />
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center gap-4 overflow-y-auto wrap-break-word border-[3px] border-ink bg-surface p-4 shadow-md sm:p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div ref={stampParent}>
            <MasteryStamp key={mastery} label={mastery} />
          </div>
          <div className="font-sans text-lg">
            <FormattedContent text={card.back} />
          </div>
        </div>
      </div>
    </button>
  )
}
