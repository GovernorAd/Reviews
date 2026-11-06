import type { Request, RequestHandler } from 'express'

import { HttpError } from '../../shared/errors/HttpError.js'
import { AUTH_COOKIE_NAME } from './auth.cookie.js'
import { authService } from './auth.service.js'
import { verifyAuthToken } from './auth.token.js'
import type { AuthUser } from './auth.types.js'

const readCookie = (req: Request, name: string): string | undefined => {
  const cookieHeader = req.headers.cookie

  if (!cookieHeader) {
    return undefined
  }

  for (const part of cookieHeader.split(';')) {
    const separatorIndex = part.indexOf('=')

    if (separatorIndex === -1) {
      continue
    }

    const key = part.slice(0, separatorIndex).trim()

    if (key === name) {
      return decodeURIComponent(part.slice(separatorIndex + 1).trim())
    }
  }

  return undefined
}

const loadRequestUser = async (req: Request): Promise<AuthUser | undefined> => {
  const token = readCookie(req, AUTH_COOKIE_NAME)

  if (!token) {
    return undefined
  }

  const userId = await verifyAuthToken(token)

  return authService.getUserById(userId)
}

export const requireAuth: RequestHandler = async (req, _res, next) => {
  try {
    const user = await loadRequestUser(req)

    if (!user) {
      throw HttpError.unauthorized('Требуется авторизация')
    }

    req.user = user
    next()
  } catch {
    next(HttpError.unauthorized('Сессия недействительна, войдите снова'))
  }
}

export const optionalAuth: RequestHandler = async (req, _res, next) => {
  try {
    req.user = await loadRequestUser(req)
  } catch {}

  next()
}

export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (!req.user) {
    next(HttpError.unauthorized('Требуется авторизация'))
    return
  }

  if (req.user.role !== 'admin') {
    next(HttpError.forbidden('Доступ только для администратора'))
    return
  }

  next()
}

export const getAuthUser = (req: Request): AuthUser => {
  if (!req.user) {
    throw HttpError.unauthorized('Требуется авторизация')
  }

  return req.user
}
