import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/shared/ConfirmDialog'
import { Panel } from '@/shared/Panel'
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
    <div className="min-h-svh bg-bg p-4 sm:p-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <TextLink to="/app">← Decks</TextLink>
        <h1 className="font-display text-2xl text-ink uppercase">Data</h1>

        <Panel>
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
        </Panel>

        <Panel>
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
        </Panel>
      </div>

      <ConfirmDialog
        open={!!pendingImport}
        onOpenChange={(open) => !open && cancelImport()}
        title="Confirm Import"
        description={
          pendingImport && (
            <p className="font-mono text-ink-60 text-xs">
              Adds {pendingImport.summary.decksAdded} decks and{' '}
              {pendingImport.summary.cardsAdded} cards. Updates{' '}
              {pendingImport.summary.decksUpdated} decks and{' '}
              {pendingImport.summary.cardsUpdated} cards. Nothing is deleted.
            </p>
          )
        }
        confirmLabel="Import"
        pendingLabel="Importing…"
        isPending={isImporting}
        onConfirm={confirmImport}
        onCancel={cancelImport}
      />
    </div>
  )
}
