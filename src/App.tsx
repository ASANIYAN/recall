import { Sparkle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

function App() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-bg">
      <div className="border-[3px] border-ink bg-surface px-8 py-6 shadow-md">
        <h1 className="font-display text-2xl uppercase text-ink">Recall</h1>
        <p className="mt-2 font-mono text-xs text-ink-60">
          scaffold ready — tokens wired up
        </p>
        <Button className="mt-4">
          <Sparkle weight="bold" />
          Add Card
        </Button>
      </div>
    </main>
  )
}

export default App
