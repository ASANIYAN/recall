import { getAllCards, getAllDecks } from '@/db/client'
import type { ExportPayload } from './schema'

export async function buildExportPayload(): Promise<ExportPayload> {
  const [decks, cards] = await Promise.all([getAllDecks(), getAllCards()])
  return { decks, cards }
}

export function downloadExport(payload: ExportPayload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `recall-export-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}
