import { z } from 'zod'

export const listReviewsQuerySchema = z.object({
  search: z.string().trim().max(120, 'Поисковая строка слишком длинная').optional(),
  brand: z.string().trim().max(40, 'Название марки слишком длинное').optional(),
  version: z.string().trim().max(60, 'Название версии слишком длинное').optional(),
  minRating: z.coerce.number().int().min(1).max(5).optional(),
  sort: z.enum(['newest', 'oldest', 'rating']).default('newest'),
  page: z.coerce.number().int().min(1, 'Страница должна быть не меньше 1').default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, 'Размер страницы должен быть не меньше 1')
    .max(50, 'Максимум 50 отзывов на страницу')
    .default(10),
})

export const adminReviewsQuerySchema = z.object({
  status: z.enum(['all', 'pending', 'approved', 'rejected']).default('all'),
  page: z.coerce.number().int().min(1, 'Страница должна быть не меньше 1').default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, 'Размер страницы должен быть не меньше 1')
    .max(50, 'Максимум 50 отзывов на страницу')
    .default(10),
})

export const createReviewSchema = z.object({
  carBrand: z
    .string()
    .trim()
    .min(2, 'Укажите марку автомобиля')
    .max(40, 'Марка должна быть короче 40 символов'),
  carVersion: z
    .string()
    .trim()
    .min(1, 'Укажите версию или модель автомобиля')
    .max(60, 'Версия должна быть короче 60 символов'),
  imageUrl: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z
      .string()
      .trim()
      .max(500, 'Ссылка на изображение слишком длинная')
      .pipe(z.url('Укажите корректный URL изображения'))
      .optional(),
  ),
  rating: z.number().int().min(1, 'Оценка — от 1 до 5').max(5, 'Оценка — от 1 до 5'),
  text: z
    .string()
    .trim()
    .min(20, 'Отзыв должен содержать минимум 20 символов')
    .max(3000, 'Отзыв должен содержать максимум 3000 символов'),
})

export const moderateReviewSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('approved'),
  }),
  z.object({
    status: z.literal('rejected'),
    reason: z
      .string()
      .trim()
      .min(5, 'Укажите причину отклонения (минимум 5 символов)')
      .max(500, 'Причина должна быть короче 500 символов'),
  }),
])

export type ListReviewsQuery = z.infer<typeof listReviewsQuerySchema>
export type AdminReviewsQuery = z.infer<typeof adminReviewsQuerySchema>
export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type ModerateReviewInput = z.infer<typeof moderateReviewSchema>
export type UpdateReviewInput = CreateReviewInput
