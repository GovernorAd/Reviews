import { Router } from 'express'

import { requireAuth } from '../auth/auth.middleware.js'
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from './notification.controller.js'

export const notificationRouter = Router()

notificationRouter.get('/', requireAuth, listNotifications)
notificationRouter.post('/read-all', requireAuth, markAllNotificationsRead)
notificationRouter.post('/:id/read', requireAuth, markNotificationRead)
