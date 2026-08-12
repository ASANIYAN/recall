import { z } from 'zod'

export const cardFormSchema = z.object({
  deckId: z.string().min(1, 'Choose a deck'),
  front: z.string().trim().min(1, 'Front is required'),
  back: z.string().trim().min(1, 'Back is required'),
  tags: z.string().trim().optional(),
})

export type CardFormValues = z.infer<typeof cardFormSchema>

/** Comma-separated tag input → the array shape `Card.tags` expects. */
export function parseTags(tagsInput: string | undefined): string[] | undefined {
  if (!tagsInput) return undefined
  const tags = tagsInput
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
  return tags.length > 0 ? tags : undefined
}
