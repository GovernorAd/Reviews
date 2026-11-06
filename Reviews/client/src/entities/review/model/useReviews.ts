import { useCallback, useEffect, useState } from 'react'

import { reviewApi } from '../api/reviewApi'
import type { ReviewsPagination, Review, ReviewsQuery } from './types'

interface UseReviewsResult {
  reviews: Review[]
  pagination: ReviewsPagination | null
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export const useReviews = (query: ReviewsQuery): UseReviewsResult => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [pagination, setPagination] = useState<ReviewsPagination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { search, brand, version, minRating, sort, page = 1, limit = 10 } = query

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await reviewApi.getAll(
          { search, brand, version, minRating, sort, page, limit },
          signal,
        )

        if (!signal?.aborted) {
          setReviews(data.items)
          setPagination(data.pagination)
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
    [search, brand, version, minRating, sort, page, limit],
  )

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)

    return () => controller.abort()
  }, [load])

  const refresh = useCallback(() => load(), [load])

  return { reviews, pagination, isLoading, error, refresh }
}
