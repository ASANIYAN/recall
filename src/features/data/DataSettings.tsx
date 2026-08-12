import { type ChangeEvent, useRef, useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { buildExportPayload, downloadExport } from './exportData'
import {
  commitImport,
  computeImportSummary,
  type ImportSummary,
  parseImportFile,
} from './importData'
import type { ExportPayload } from './schema'

export function DataSettings() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingImport, setPendingImport] = useState<{
    payload: ExportPayload
    summary: ImportSummary
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isParsingFile, setIsParsingFile] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  async function handleExport() {
    setIsExporting(true)
    try {
      const payload = await buildExportPayload()
      downloadExport(payload)
    } catch {
      toast.error('Could not export your data.')
    } finally {
      setIsExporting(false)
    }
  }

  async function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setError(null)
    setStatus(null)
    setIsParsingFile(true)
    try {
      const payload = parseImportFile(await file.text())
      const summary = await computeImportSummary(payload)
      setPendingImport({ payload, summary })
    } catch {
      setError('That file is not a valid Recall export.')
    } finally {
      setIsParsingFile(false)
    }
  }

  async function confirmImport() {
    if (!pendingImport) return
    const { summary } = pendingImport
    setIsImporting(true)
    try {
      await commitImport(pendingImport.payload)
      setStatus(
        `Added ${summary.decksAdded} decks and ${summary.cardsAdded} cards. Updated ${summary.decksUpdated} decks and ${summary.cardsUpdated} cards.`,
      )
      setPendingImport(null)
    } catch {
      toast.error(
        'Import failed partway through. Some records may not have been saved.',
      )
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="min-h-svh bg-bg p-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <Link
          to="/"
          className="font-mono text-ink-60 text-xs hover:text-ink active:text-ink/70"
        >
          ← Decks
        </Link>
        <h1 className="font-display text-2xl text-ink uppercase">Data</h1>

        <div className="flex flex-col items-start gap-3 border-[3px] border-ink bg-surface p-5">
          <h2 className="font-display text-ink text-xs uppercase">Export</h2>
          <p className="font-mono text-ink-60 text-xs">
            Download all decks and cards as JSON.
          </p>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting…' : 'Export Data'}
          </Button>
        </div>

        <div className="flex flex-col items-start gap-3 border-[3px] border-ink bg-surface p-5">
          <h2 className="font-display text-ink text-xs uppercase">Import</h2>
          <p className="font-mono text-ink-60 text-xs">
            Existing decks and cards are updated by ID. Nothing is deleted.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleFileSelected}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isParsingFile}
          >
            {isParsingFile ? 'Reading File…' : 'Choose File'}
          </Button>
          {error && <p className="font-mono text-pink text-xs">{error}</p>}
          {status && <p className="font-mono text-ink-60 text-xs">{status}</p>}
        </div>
      </div>

      <Dialog
        open={!!pendingImport}
        onOpenChange={(open) => !open && setPendingImport(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Import</DialogTitle>
          </DialogHeader>
          {pendingImport && (
            <p className="font-mono text-ink-60 text-xs">
              Adds {pendingImport.summary.decksAdded} decks and{' '}
              {pendingImport.summary.cardsAdded} cards. Updates{' '}
              {pendingImport.summary.decksUpdated} decks and{' '}
              {pendingImport.summary.cardsUpdated} cards. Nothing is deleted.
            </p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPendingImport(null)}
              disabled={isImporting}
            >
              Cancel
            </Button>
            <Button
              variant="violet"
              onClick={confirmImport}
              disabled={isImporting}
            >
              {isImporting ? 'Importing…' : 'Import'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
