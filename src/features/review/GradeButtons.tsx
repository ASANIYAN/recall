import { cva } from 'class-variance-authority'
import type { Grade } from './scheduling/learningSteps'

const gradeButtonVariants = cva(
  'flex-1 border-[3px] border-ink bg-surface px-1 py-3 text-center font-display text-[11px] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      grade: {
        again: 'hover:bg-pink',
        hard: 'hover:bg-amber',
        good: 'hover:bg-violet hover:text-surface',
        easy: 'hover:bg-cyan',
      },
    },
  },
)

const GRADES: { grade: Grade; label: string }[] = [
  { grade: 'again', label: 'Again' },
  { grade: 'hard', label: 'Hard' },
  { grade: 'good', label: 'Good' },
  { grade: 'easy', label: 'Easy' },
]

interface GradeButtonsProps {
  onGrade: (grade: Grade) => void
  disabled?: boolean
}

/** Keyboard-first: 1–4 map to Again/Hard/Good/Easy — see CLAUDE.md §7. */
export function GradeButtons({ onGrade, disabled }: GradeButtonsProps) {
  return (
    <div className="flex w-full max-w-md gap-2">
      {GRADES.map(({ grade, label }) => (
        <button
          key={grade}
          type="button"
          disabled={disabled}
          onClick={() => onGrade(grade)}
          className={gradeButtonVariants({ grade })}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
