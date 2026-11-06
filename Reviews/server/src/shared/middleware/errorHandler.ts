import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'

import { env } from '../../config/env.js'
import { HttpError } from '../errors/HttpError.js'

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        message: 'Ошибка валидации',
        details: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
    })
    return
  }

  if (error instanceof HttpError) {
    res.status(error.status).json({ error: { message: error.message } })
    return
  }

  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ error: { message: 'Некорректный JSON в теле запроса' } })
    return
  }

  console.error('[server] Unhandled error:', error)

  res.status(500).json({
    error: {
      message: env.isProduction
        ? 'Внутренняя ошибка сервера'
        : error instanceof Error
          ? error.message
          : 'Внутренняя ошибка сервера',
    },
  })
}
