import { motion } from 'motion/react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Flashcard } from '@/features/review/Flashcard'
import { GradeButtons } from '@/features/review/GradeButtons'
import { useLandingDemo } from './useLandingDemo'

/** Hard/snappy per CLAUDE.md §8 — overrides Motion's spring default everywhere on this page. */
const EASE_OUT = { type: 'tween', ease: 'easeOut', duration: 0.2 } as const

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { ...EASE_OUT, delay },
  }
}

const STAMPS = [
  {
    label: 'New',
    className: 'border-dashed bg-surface text-ink-60',
    caption: "Hasn't earned a stamp yet.",
  },
  {
    label: 'Shaky',
    className: 'bg-pink-tint text-shaky-text -rotate-2',
    caption: 'Graduated, but still fragile.',
  },
  {
    label: 'Solid',
    className: 'bg-violet-tint text-solid-text rotate-1',
    caption: 'Reliable, not yet automatic.',
  },
  {
    label: 'Mastered',
    className: 'bg-cyan-tint text-mastered-text -rotate-1',
    caption: 'You know this cold.',
  },
]

const FEATURES = [
  {
    n: '01',
    title: 'Keyboard-first review',
    body: 'Space to flip, 1–4 to grade. Hundreds of reps a week, no mouse.',
  },
  {
    n: '02',
    title: 'Code-aware cards',
    body: 'Fenced code blocks render in real monospace, not mush.',
  },
  {
    n: '03',
    title: 'Own your data',
    body: 'Export and import as JSON, any time. No lock-in.',
  },
  {
    n: '04',
    title: 'Works offline',
    body: 'Installable PWA. No account, no server, no sync.',
  },
]

export function LandingPage() {
  const { card, flipped, toggleFlip, grade, reset } = useLandingDemo()

  return (
    <div className="bg-surface">
      <motion.nav
        {...fadeUp()}
        className="flex items-center justify-between border-ink border-b-[3px] bg-bg px-8 py-5"
      >
        <span className="font-display text-lg text-ink uppercase">Recall</span>
        <Button variant="outline" size="sm" asChild>
          <Link to="/app">Open App →</Link>
        </Button>
      </motion.nav>

      <section className="border-ink border-b-[3px] bg-bg px-8 pt-16 pb-20 text-center">
        <motion.h1
          {...fadeUp(0.05)}
          className="mx-auto mb-5 max-w-3xl text-balance font-display text-4xl text-ink uppercase leading-[1.05] sm:text-5xl"
        >
          Flashcards that track what you've{' '}
          <span className="inline-block -rotate-1 bg-ink px-2.5 py-0.5 text-surface">
            actually
          </span>{' '}
          learned
        </motion.h1>
        <motion.p
          {...fadeUp(0.1)}
          className="mx-auto mb-9 max-w-md font-sans text-ink-60 text-lg"
        >
          No streaks. No points. Just four honest states — New, Shaky, Solid,
          Mastered — and a review loop fast enough to live in your keyboard.
        </motion.p>
        <motion.div
          {...fadeUp(0.15)}
          className="mb-16 flex justify-center gap-3"
        >
          <Button variant="default" asChild>
            <Link to="/app">Open Recall</Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="#how-it-works">See how it works</a>
          </Button>
        </motion.div>

        <motion.div {...fadeUp(0.2)} className="mx-auto max-w-md">
          <p className="mb-3 font-mono text-ink-60 text-xs uppercase">
            {'// try it — space to flip, 1–4 to grade'}
          </p>
          <Flashcard card={card} flipped={flipped} onFlip={toggleFlip} />
          <div className="mt-5 flex flex-col items-center gap-3">
            {flipped && <GradeButtons onGrade={grade} />}
            <button
              type="button"
              onClick={reset}
              className="font-mono text-ink-35 text-xs hover:text-ink-60 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
            >
              ↻ Reset demo
            </button>
          </div>
        </motion.div>
      </section>

      <motion.section
        id="how-it-works"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={EASE_OUT}
        className="mx-auto max-w-3xl px-8 py-20 text-center"
      >
        <h2 className="mb-10 inline-block -rotate-1 bg-ink px-3.5 py-1.5 font-display text-surface text-xs uppercase tracking-wide">
          Mastery, not activity
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {STAMPS.map((stamp) => (
            <div key={stamp.label} className="w-44">
              <span
                className={`mb-2.5 inline-flex border-2 border-ink px-3 py-1.5 font-display text-[11px] uppercase ${stamp.className}`}
              >
                {stamp.label}
              </span>
              <p className="font-mono text-ink-60 text-xs">{stamp.caption}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={EASE_OUT}
        className="mx-auto grid max-w-3xl grid-cols-1 gap-4 px-8 pb-24 sm:grid-cols-2"
      >
        {FEATURES.map((feature) => (
          <div
            key={feature.n}
            className="border-[3px] border-ink bg-surface p-5"
          >
            <p className="mb-2 font-mono text-ink-35 text-xs">{feature.n}</p>
            <h3 className="mb-1.5 font-sans font-bold text-ink text-sm">
              {feature.title}
            </h3>
            <p className="font-mono text-ink-60 text-xs leading-relaxed">
              {feature.body}
            </p>
          </div>
        ))}
      </motion.section>

      <footer className="border-ink border-t-[3px] bg-bg px-8 py-16 text-center">
        <p className="mb-6 font-display text-2xl text-ink uppercase">
          Ready to actually remember it?
        </p>
        <Button variant="default" asChild>
          <Link to="/app">Open Recall</Link>
        </Button>
      </footer>
    </div>
  )
}
