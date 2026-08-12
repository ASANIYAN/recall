import { z } from 'zod'

const deckSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
})

const cardSchema = z.object({
  id: z.string(),
  deckId: z.string(),
  front: z.string(),
  back: z.string(),
  tags: z.array(z.string()).optional(),
  createdAt: z.string(),
  phase: z.enum(['learning', 'review']),
  learningStep: z.number(),
  interval: z.number(),
  easeFactor: z.number(),
  nextShowDate: z.string().optional(),
  lapses: z.number(),
})

/** Export covers decks + cards. Snapshots are excluded — they're derived stats history, not user content. */
export const exportPayloadSchema = z.object({
  decks: z.array(deckSchema),
  cards: z.array(cardSchema),
})

export type ExportPayload = z.infer<typeof exportPayloadSchema>
