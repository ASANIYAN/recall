import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TextLink } from '@/shared/TextLink'
import { useDataSettings } from './useDataSettings'

export function DataSettings() {
  const {
    fileInputRef,
    pendingImport,
    error,
    status,
    isExporting,
    isParsingFile,
    isImporting,
    handleExport,
    openFilePicker,
    handleFileSelected,
    confirmImport,
    cancelImport,
  } = useDataSettings()

  return (
    <div className="min-h-svh bg-bg p-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <TextLink to="/">← Decks</TextLink>
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
            onClick={openFilePicker}
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
        onOpenChange={(open) => !open && cancelImport()}
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
              onClick={cancelImport}
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
