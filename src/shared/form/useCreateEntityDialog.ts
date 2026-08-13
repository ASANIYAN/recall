import { useState } from 'react'
import { toast } from 'sonner'

interface UseCreateEntityDialogOptions<TValues, TEntity> {
  /** Builds the full entity (id, timestamps, defaults) from validated form values. */
  build: (values: TValues) => TEntity
  /** Persists the entity. Rejecting shows `errorMessage` and keeps the dialog open. */
  create: (entity: TEntity) => Promise<void>
  errorMessage: string
  onCreated?: (entity: TEntity) => void
}

/** Owns open state and the create/persist/close cycle shared by every "Add X" dialog. */
export function useCreateEntityDialog<TValues, TEntity>({
  build,
  create,
  errorMessage,
  onCreated,
}: UseCreateEntityDialogOptions<TValues, TEntity>) {
  const [open, setOpen] = useState(false)

  async function handleSubmit(values: TValues) {
    const entity = build(values)
    try {
      await create(entity)
    } catch {
      toast.error(errorMessage)
      return
    }
    onCreated?.(entity)
    setOpen(false)
  }

  return { open, setOpen, handleSubmit }
}
