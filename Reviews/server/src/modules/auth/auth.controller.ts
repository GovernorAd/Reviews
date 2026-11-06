import type { RequestHandler } from 'express'

import { clearAuthCookie, setAuthCookie } from './auth.cookie.js'
import { getAuthUser } from './auth.middleware.js'
import { loginSchema, registerSchema } from './auth.schema.js'
import { authService } from './auth.service.js'

export const register: RequestHandler = async (req, res) => {
  const input = registerSchema.parse(req.body)
  const { user, token } = await authService.register(input)

  setAuthCookie(res, token)

  res.status(201).json({ data: { user } })
}

export const login: RequestHandler = async (req, res) => {
  const input = loginSchema.parse(req.body)
  const { user, token } = await authService.login(input)

  setAuthCookie(res, token)

  res.json({ data: { user } })
}

export const me: RequestHandler = (req, res) => {
  res.json({ data: { user: getAuthUser(req) } })
}

export const logout: RequestHandler = (_req, res) => {
  clearAuthCookie(res)

  res.status(204).send()
}
