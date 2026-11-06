import type { RequestHandler } from 'express'

import { HttpError } from '../../shared/errors/HttpError.js'
import { getAuthUser } from '../auth/auth.middleware.js'
import { notificationService } from './notification.service.js'

const readNotificationId = (value: string | string[] | undefined): string => {
  const id = Array.isArray(value) ? value[0] : value

  if (!id) {
    throw HttpError.badRequest('Не указан идентификатор уведомления')
  }

  return id
}

export const listNotifications: RequestHandler = (req, res) => {
  const user = getAuthUser(req)

  res.json({ data: notificationService.list(user.id) })
}

export const markNotificationRead: RequestHandler = (req, res) => {
  const user = getAuthUser(req)
  const id = readNotificationId(req.params.id)

  res.json({ data: notificationService.markRead(id, user.id) })
}

export const markAllNotificationsRead: RequestHandler = (req, res) => {
  const user = getAuthUser(req)

  res.json({ data: { updated: notificationService.markAllRead(user.id) } })
}
