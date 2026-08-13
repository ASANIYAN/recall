import { useEffect, useRef } from 'react'

/** Focuses the attached element on mount. Returns a ref-setter for JSX `ref`. */
export function useAutoFocusRef<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  return function setRef(el: T | null) {
    ref.current = el
  }
}
