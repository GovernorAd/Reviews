import { useCallback, useEffect, useState } from 'react'

import { ApiError } from '@/shared/api'

import { reviewApi } from '../api/reviewApi'
import type { Comment, Review } from './types'

interface UseReviewResult {
  review: Review | null
  isLoading: boolean
  error: string | null
  errorStatus: number | null
  refresh: () => Promise<void>
  addComment: (text: string) => Promise<Comment>
  removeReview: () => Promise<void>
}

export const useReview = (id: string | undefined): UseReviewResult => {
  const [review, setReview] = useState<Review | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [errorStatus, setErrorStatus] = useState<number | null>(null)

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!id) {
        setIsLoading(false)
        setError('Отзыв не найден')
        setErrorStatus(404)
        return
      }

      setIsLoading(true)
      setError(null)
      setErrorStatus(null)

      try {
        const data = await reviewApi.getById(id, signal)

        if (!signal?.aborted) {
          setReview(data)
        }
      } catch (cause) {
        if (signal?.aborted) {
          return
        }

        setError(cause instanceof Error ? cause.message : 'Не удалось загрузить отзыв')
        setErrorStatus(cause instanceof ApiError ? cause.status : null)
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false)
        }
      }
    },
    [id],
  )

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)

    return () => controller.abort()
  }, [load])

  const refresh = useCallback(() => load(), [load])

  const addComment = useCallback(
    async (text: string) => {
      if (!id) {
        throw new Error('Отзыв не найден')
      }

      const comment = await reviewApi.addComment(id, { text })

      setReview((current) =>
        current && current.id === id
          ? { ...current, comments: [...current.comments, comment] }
          : current,
      )

      return comment
    },
    [id],
  )

  const removeReview = useCallback(async () => {
    if (!id) {
      return
    }

    await reviewApi.remove(id)
    setReview(null)
  }, [id])

  return { review, isLoading, error, errorStatus, refresh, addComment, removeReview }
}
