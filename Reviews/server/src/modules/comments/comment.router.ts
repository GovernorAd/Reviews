import { Router } from 'express'

import { requireAuth } from '../auth/auth.middleware.js'
import { createComment } from './comment.controller.js'

export const commentRouter = Router({ mergeParams: true })

commentRouter.post('/', requireAuth, createComment)
