import type { RequestHandler } from 'express'

import { HttpError } from '../../shared/errors/HttpError.js'
import { getAuthUser } from '../auth/auth.middleware.js'
import { createCommentSchema } from './comment.schema.js'
import { commentService } from './comment.service.js'

const readReviewId = (value: string | string[] | undefined): string => {
  const reviewId = Array.isArray(value) ? value[0] : value

  if (!reviewId) {
    throw HttpError.badRequest('Не указан идентификатор отзыва')
  }

  return reviewId
}

export const createComment: RequestHandler = (req, res) => {
  const user = getAuthUser(req)
  const reviewId = readReviewId(req.params.reviewId)
  const input = createCommentSchema.parse(req.body)
  const comment = commentService.create(reviewId, input, user)

  res.status(201).json({ data: comment })
}
