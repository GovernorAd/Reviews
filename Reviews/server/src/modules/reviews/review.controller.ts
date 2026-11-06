import type { RequestHandler } from 'express'

import { HttpError } from '../../shared/errors/HttpError.js'
import { getAuthUser } from '../auth/auth.middleware.js'
import {
  adminReviewsQuerySchema,
  createReviewSchema,
  listReviewsQuerySchema,
  moderateReviewSchema,
} from './review.schema.js'
import { reviewService } from './review.service.js'

const readReviewId = (value: string | string[] | undefined): string => {
  const id = Array.isArray(value) ? value[0] : value

  if (!id) {
    throw HttpError.badRequest('Не указан идентификатор отзыва')
  }

  return id
}

export const listReviews: RequestHandler = (req, res) => {
  const query = listReviewsQuerySchema.parse(req.query)

  res.json({ data: reviewService.list(query) })
}

export const getReviewCatalog: RequestHandler = (_req, res) => {
  res.json({ data: reviewService.getCatalog() })
}

export const getReview: RequestHandler = (req, res) => {
  const reviewId = readReviewId(req.params.id)

  res.json({ data: reviewService.getById(reviewId, req.user) })
}

export const createReview: RequestHandler = (req, res) => {
  const user = getAuthUser(req)
  const input = createReviewSchema.parse(req.body)

  res.status(201).json({ data: reviewService.create(input, user) })
}

export const deleteReview: RequestHandler = (req, res) => {
  const user = getAuthUser(req)
  const reviewId = readReviewId(req.params.id)

  reviewService.remove(reviewId, user)

  res.status(204).send()
}

export const listAdminReviews: RequestHandler = (req, res) => {
  const query = adminReviewsQuerySchema.parse(req.query)

  res.json({ data: reviewService.listForAdmin(query) })
}

export const moderateReview: RequestHandler = (req, res) => {
  const reviewId = readReviewId(req.params.id)
  const input = moderateReviewSchema.parse(req.body)

  res.json({ data: reviewService.moderate(reviewId, input) })
}

export const updateReview: RequestHandler = (req, res) => {
  const reviewId = readReviewId(req.params.id)
  const input = createReviewSchema.parse(req.body)

  res.json({ data: reviewService.update(reviewId, input) })
}
