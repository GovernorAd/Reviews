import { Router } from 'express'

import { optionalAuth, requireAuth } from '../auth/auth.middleware.js'
import {
  createReview,
  deleteReview,
  getReview,
  getReviewCatalog,
  listReviews,
} from './review.controller.js'

export const reviewRouter = Router()

reviewRouter.get('/', listReviews)
reviewRouter.get('/catalog', getReviewCatalog)
reviewRouter.get('/:id', optionalAuth, getReview)
reviewRouter.post('/', requireAuth, createReview)
reviewRouter.delete('/:id', requireAuth, deleteReview)
