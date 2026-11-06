import { z } from 'zod'

export const createCommentSchema = z.object({
  text: z
    .string()
    .trim()
    .min(2, 'Комментарий должен содержать минимум 2 символа')
    .max(400, 'Комментарий должен содержать максимум 400 символов'),
})

export type CreateCommentInput = z.infer<typeof createCommentSchema>
