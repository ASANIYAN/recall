import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useAutoFocusRef } from './useAutoFocusRef'

function TestInput() {
  const setRef = useAutoFocusRef<HTMLInputElement>()
  return <input ref={setRef} placeholder="focus me" />
}

test('focuses the attached element on mount', () => {
  const { getByPlaceholderText } = render(<TestInput />)
  expect(getByPlaceholderText('focus me')).toHaveFocus()
})
