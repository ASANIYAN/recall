import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { ConfirmDialog } from './ConfirmDialog'

test('confirming calls onConfirm', async () => {
  const onConfirm = vi.fn()
  const onCancel = vi.fn()
  render(
    <ConfirmDialog
      open={true}
      onOpenChange={() => {}}
      title="Confirm Import"
      confirmLabel="Import"
      pendingLabel="Importing…"
      isPending={false}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />,
  )

  await userEvent.click(screen.getByRole('button', { name: 'Import' }))
  expect(onConfirm).toHaveBeenCalledOnce()

  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
  expect(onCancel).toHaveBeenCalledOnce()
})

test('disables both actions and shows the pending label while pending', () => {
  render(
    <ConfirmDialog
      open={true}
      onOpenChange={() => {}}
      title="Confirm Import"
      confirmLabel="Import"
      pendingLabel="Importing…"
      isPending={true}
      onConfirm={() => {}}
      onCancel={() => {}}
    />,
  )

  expect(screen.getByRole('button', { name: 'Importing…' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
})
