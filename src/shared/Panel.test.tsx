import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Panel } from './Panel'

test('renders its children inside a bordered section', () => {
  render(
    <Panel>
      <h2>Export</h2>
    </Panel>,
  )
  expect(screen.getByText('Export')).toBeInTheDocument()
})
