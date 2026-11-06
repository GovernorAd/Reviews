import { Router } from 'express'

import {
  listAdminReviews,
  moderateReview,
  updateReview,
} from './review.controller.js'

export const reviewAdminRouter = Router()

reviewAdminRouter.get('/', listAdminReviews)
reviewAdminRouter.patch('/:id', updateReview)
reviewAdminRouter.patch('/:id/status', moderateReview)
