import { http } from '@/shared/api'
import { toQueryString } from '@/shared/lib'

import type {
  CarBrandSummary,
  Comment,
  CreateCommentPayload,
  CreateReviewPayload,
  PaginatedReviews,
  Review,
  ReviewsQuery,
} from '../model/types'

export const reviewApi = {
  getAll: (query: ReviewsQuery = {}, signal?: AbortSignal) =>
    http.get<PaginatedReviews>(
      `/reviews${toQueryString({
        search: query.search,
        brand: query.brand,
        version: query.version,
        minRating: query.minRating,
        sort: query.sort,
        page: query.page,
        limit: query.limit,
      })}`,
      { signal },
    ),

  getCatalog: (signal?: AbortSignal) =>
    http.get<CarBrandSummary[]>('/reviews/catalog', { signal }),

  getById: (id: string, signal?: AbortSignal) =>
    http.get<Review>(`/reviews/${encodeURIComponent(id)}`, { signal }),

  create: (payload: CreateReviewPayload) => http.post<Review>('/reviews', payload),

  remove: (id: string) => http.delete(`/reviews/${encodeURIComponent(id)}`),

  addComment: (reviewId: string, payload: CreateCommentPayload) =>
    http.post<Comment>(`/reviews/${encodeURIComponent(reviewId)}/comments`, payload),
}
