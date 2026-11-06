import { useCallback, useEffect, useState } from 'react'

import { reviewAdminApi } from '../api/reviewAdminApi'
import type {
  AdminReviewsQuery,
  Review,
  ReviewStatusCounts,
  ReviewsPagination,
} from './types'

interface UseAdminReviewsResult {
  reviews: Review[]
  pagination: ReviewsPagination | null
  counts: ReviewStatusCounts | null
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export const useAdminReviews = (query: AdminReviewsQuery): UseAdminReviewsResult => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [pagination, setPagination] = useState<ReviewsPagination | null>(null)
  const [counts, setCounts] = useState<ReviewStatusCounts | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { status = 'all', page = 1, limit = 10 } = query

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await reviewAdminApi.getAll({ status, page, limit }, signal)

        if (!signal?.aborted) {
          setReviews(data.items)
          setPagination(data.pagination)
          setCounts(data.counts)
        }
      } catch (cause) {
        if (signal?.aborted) {
          return
        }

        setError(cause instanceof Error ? cause.message : 'Не удалось загрузить отзывы')
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false)
        }
      }
    },
    [status, page, limit],
  )

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)

    return () => controller.abort()
  }, [load])

  const refresh = useCallback(() => load(), [load])

  return { reviews, pagination, counts, isLoading, error, refresh }
}
