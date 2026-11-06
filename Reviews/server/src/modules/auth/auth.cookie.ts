import type { Response } from 'express'

import { env } from '../../config/env.js'

export const AUTH_COOKIE_NAME = 'reviews_session'

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: env.cookieSecure,
  path: '/',
}

export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie(AUTH_COOKIE_NAME, token, { ...cookieOptions, maxAge: MAX_AGE_MS })
}

export const clearAuthCookie = (res: Response): void => {
  res.clearCookie(AUTH_COOKIE_NAME, cookieOptions)
}
