import { z } from 'zod'

try {
  process.loadEnvFile()
} catch {}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  CORS_ORIGIN: z
    .string()
    .default('http://localhost:5173,http://localhost:4173,http://127.0.0.1:5173'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET должен быть не короче 16 символов').default('reviews-dev-secret-change-me'),
  COOKIE_SECURE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  ADMIN_USERNAME: z.string().trim().min(3).default('admin'),
  ADMIN_EMAIL: z.email('Некорректный email администратора').default('admin@reviews.local'),
  ADMIN_PASSWORD: z.string().min(8, 'Пароль администратора должен быть не короче 8 символов').default('admin12345'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Некорректные переменные окружения:', z.prettifyError(parsed.error))
  process.exit(1)
}

const raw = parsed.data

export const env = {
  nodeEnv: raw.NODE_ENV,
  isProduction: raw.NODE_ENV === 'production',
  port: raw.PORT,
  corsOrigins: raw.CORS_ORIGIN.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  jwtSecret: raw.JWT_SECRET,
  cookieSecure: raw.COOKIE_SECURE,
  adminUsername: raw.ADMIN_USERNAME,
  adminEmail: raw.ADMIN_EMAIL.toLowerCase(),
  adminPassword: raw.ADMIN_PASSWORD,
} as const
