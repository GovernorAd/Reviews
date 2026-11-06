import { http } from '@/shared/api'
import { toQueryString } from '@/shared/lib'

import type {
  AdminReviewsQuery,
  AdminReviewsResult,
  ModerateReviewPayload,
  Review,
  UpdateReviewPayload,
} from '../model/types'

export const reviewAdminApi = {
  getAll: (query: AdminReviewsQuery = {}, signal?: AbortSignal) =>
    http.get<AdminReviewsResult>(
      `/admin/reviews${toQueryString({
        status: query.status,
        page: query.page,
        limit: query.limit,
      })}`,
      { signal },
    ),

  update: (id: string, payload: UpdateReviewPayload) =>
    http.patch<Review>(`/admin/reviews/${encodeURIComponent(id)}`, payload),

  moderate: (id: string, payload: ModerateReviewPayload) =>
    http.patch<Review>(`/admin/reviews/${encodeURIComponent(id)}/status`, payload),
}
