import { useCallback, useEffect, useState } from 'react'

import { notificationApi } from '../api/notificationApi'
import type { AppNotification } from './types'

interface UseNotificationsResult {
  notifications: AppNotification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
}

export const useNotifications = (enabled = true): UseNotificationsResult => {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await notificationApi.getAll(signal)

        if (!signal?.aborted) {
          setNotifications(data.items)
          setUnreadCount(data.unreadCount)
        }
      } catch (cause) {
        if (signal?.aborted) {
          return
        }

        setError(cause instanceof Error ? cause.message : 'Не удалось загрузить уведомления')
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false)
        }
      }
    },
    [],
  )

  useEffect(() => {
    if (!enabled) {
      setNotifications([])
      setUnreadCount(0)
      setIsLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()
    void load(controller.signal)

    const handleFocus = () => {
      void load()
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      controller.abort()
      window.removeEventListener('focus', handleFocus)
    }
  }, [enabled, load])

  const refresh = useCallback(() => load(), [load])

  const markRead = useCallback(async (id: string) => {
    const updated = await notificationApi.markRead(id)

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === updated.id ? updated : notification,
      ),
    )
    setUnreadCount((current) => Math.max(0, current - 1))
  }, [])

  const markAllRead = useCallback(async () => {
    await notificationApi.markAllRead()

    setNotifications((current) =>
      current.map((notification) => ({ ...notification, isRead: true })),
    )
    setUnreadCount(0)
  }, [])

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refresh,
    markRead,
    markAllRead,
  }
}
