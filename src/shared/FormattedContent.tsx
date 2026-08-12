import { Fragment } from 'react'

interface FormattedContentProps {
  text: string
}

/**
 * Renders plain text with fenced ``` code blocks as monospace blocks.
 * Minimal on purpose — CLAUDE.md §3 asks for "at least" fenced code block
 * support, not a full markdown renderer, so no parser dependency is added.
 */
export function FormattedContent({ text }: FormattedContentProps) {
  const parts = text.split('```')

  return (
    <>
      {parts.map((part, index) => {
        const isCodeBlock = index % 2 === 1
        if (isCodeBlock) {
          return (
            <pre
              // biome-ignore lint/suspicious/noArrayIndexKey: parts is deterministically derived from `text` each render, never reordered
              key={index}
              className="mt-2 overflow-x-auto border-2 border-ink bg-bg-soft p-3 font-mono text-sm"
            >
              <code>{part.trim()}</code>
            </pre>
          )
        }
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: parts is deterministically derived from `text` each render, never reordered
          <Fragment key={index}>
            {part && <p className="whitespace-pre-wrap">{part.trim()}</p>}
          </Fragment>
        )
      })}
    </>
  )
}
