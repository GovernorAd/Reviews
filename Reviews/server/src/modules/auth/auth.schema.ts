import { z } from 'zod'

const usernameSchema = z
  .string()
  .trim()
  .min(3, 'Логин должен содержать минимум 3 символа')
  .max(30, 'Логин должен содержать максимум 30 символов')
  .regex(
    /^[\p{L}\p{N}_.-]+$/u,
    'Логин может содержать буквы, цифры, точку, дефис и подчёркивание',
  )

const passwordSchema = z
  .string()
  .min(8, 'Пароль должен содержать минимум 8 символов')
  .max(72, 'Пароль должен содержать максимум 72 символа')

export const registerSchema = z.object({
  username: usernameSchema,
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email('Некорректный email')),
  password: passwordSchema,
})

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Укажите логин'),
  password: z.string().min(1, 'Укажите пароль'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
