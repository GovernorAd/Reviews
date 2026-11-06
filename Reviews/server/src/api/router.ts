import { Router } from 'express'

import { authRouter } from '../modules/auth/index.js'
import { requireAdmin, requireAuth } from '../modules/auth/auth.middleware.js'
import { commentRouter } from '../modules/comments/index.js'
import { notificationRouter } from '../modules/notifications/index.js'
import { reviewAdminRouter, reviewRouter } from '../modules/reviews/index.js'

export const apiRouter = Router()

apiRouter.get('/health', (_req, res) => {
  res.json({
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  })
})

apiRouter.use('/auth', authRouter)
apiRouter.use('/notifications', notificationRouter)
apiRouter.use('/admin/reviews', requireAuth, requireAdmin, reviewAdminRouter)
apiRouter.use('/reviews', reviewRouter)
apiRouter.use('/reviews/:reviewId/comments', commentRouter)
