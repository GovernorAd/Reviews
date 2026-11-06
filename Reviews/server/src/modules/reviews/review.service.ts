import { HttpError } from '../../shared/errors/HttpError.js'
import type { AuthUser } from '../auth/auth.types.js'
import { notificationService } from '../notifications/index.js'
import { reviewRepository } from './review.repository.js'
import type {
  AdminReviewsQuery,
  CreateReviewInput,
  ListReviewsQuery,
  ModerateReviewInput,
  UpdateReviewInput,
} from './review.schema.js'
import type {
  AdminReviewsResult,
  CarBrandSummary,
  PaginatedReviews,
  Review,
} from './review.types.js'

export const reviewService = {
  list(query: ListReviewsQuery): PaginatedReviews {
    const { page, limit, ...filters } = query

    return reviewRepository.findPage(filters, page, limit)
  },

  listForAdmin(query: AdminReviewsQuery): AdminReviewsResult {
    return reviewRepository.findAdminPage(query.status, query.page, query.limit)
  },

  getCatalog(): CarBrandSummary[] {
    return reviewRepository.getCatalog()
  },

  getById(id: string, viewer?: AuthUser): Review {
    const review = reviewRepository.findById(id)

    if (!review) {
      throw HttpError.notFound('Отзыв не найден')
    }

    const canSeeUnpublished =
      viewer?.role === 'admin' || (review.userId !== undefined && review.userId === viewer?.id)

    if (review.status !== 'approved' && !canSeeUnpublished) {
      throw HttpError.notFound('Отзыв не найден')
    }

    return review
  },

  create(input: CreateReviewInput, user: AuthUser): Review {
    return reviewRepository.create({
      ...input,
      author: user.username,
      userId: user.id,
    })
  },

  update(id: string, input: UpdateReviewInput): Review {
    const review = reviewRepository.update(id, input)

    if (!review) {
      throw HttpError.notFound('Отзыв не найден')
    }

    return review
  },

  moderate(id: string, input: ModerateReviewInput): Review {
    const current = reviewRepository.findById(id)

    if (!current) {
      throw HttpError.notFound('Отзыв не найден')
    }

    const previousStatus = current.status
    const review = reviewRepository.moderate(id, input)

    if (!review) {
      throw HttpError.notFound('Отзыв не найден')
    }

    if (input.status === 'rejected') {
      notificationService.notifyReviewModerated({
        review,
        status: 'rejected',
        reason: input.reason,
      })
    } else if (previousStatus !== 'approved') {
      notificationService.notifyReviewModerated({
        review,
        status: 'approved',
      })
    }

    return review
  },

  remove(id: string, user: AuthUser): void {
    const review = reviewRepository.findById(id)

    if (!review) {
      throw HttpError.notFound('Отзыв не найден')
    }

    if (review.userId !== user.id) {
      throw HttpError.forbidden('Можно удалять только свои отзывы')
    }

    reviewRepository.delete(id)
    notificationService.removeByReviewId(id)
  },
}
