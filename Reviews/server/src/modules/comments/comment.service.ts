import { HttpError } from '../../shared/errors/HttpError.js'
import type { AuthUser } from '../auth/auth.types.js'
import { reviewRepository } from '../reviews/review.repository.js'
import type { CreateCommentInput } from './comment.schema.js'
import type { Comment } from './comment.types.js'

export const commentService = {
  create(reviewId: string, input: CreateCommentInput, user: AuthUser): Comment {
    const review = reviewRepository.findById(reviewId)

    if (!review) {
      throw HttpError.notFound('Отзыв не найден')
    }

    if (review.status !== 'approved') {
      throw HttpError.forbidden('Комментировать можно только опубликованные отзывы')
    }

    const comment = reviewRepository.addComment(reviewId, {
      text: input.text,
      author: user.username,
      userId: user.id,
    })

    if (!comment) {
      throw HttpError.notFound('Отзыв не найден')
    }

    return comment
  },
}
