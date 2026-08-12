import { type ChangeEvent, useRef, useState } from 'react'
import { toast } from 'sonner'
import { buildExportPayload, downloadExport } from './exportData'
import {
  commitImport,
  computeImportSummary,
  type ImportSummary,
  parseImportFile,
} from './importData'
import type { ExportPayload } from './schema'

export function useDataSettings() {
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

  function openFilePicker() {
    fileInputRef.current?.click()
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

  function cancelImport() {
    setPendingImport(null)
  }

  return {
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
  }
}
