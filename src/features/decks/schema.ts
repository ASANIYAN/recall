import { z } from 'zod'

export const deckFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
})

export type DeckFormValues = z.infer<typeof deckFormSchema>
