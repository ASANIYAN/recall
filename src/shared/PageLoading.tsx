/** Full-page loading state — same bracket motif as the empty states, pulsing. */
export function PageLoading() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-bg p-8">
      <div className="text-center">
        <p className="mb-3 animate-pulse font-display text-2xl">［ ］</p>
        <p className="font-mono text-ink-60 text-xs">Loading…</p>
      </div>
    </div>
  )
}
