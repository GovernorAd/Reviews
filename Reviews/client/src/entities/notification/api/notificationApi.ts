import { http } from '@/shared/api'

import type { AppNotification, NotificationsResult } from '../model/types'

export const notificationApi = {
  getAll: (signal?: AbortSignal) =>
    http.get<NotificationsResult>('/notifications', { signal }),

  markRead: (id: string) =>
    http.post<AppNotification>(`/notifications/${encodeURIComponent(id)}/read`, {}),

  markAllRead: () => http.post<{ updated: number }>('/notifications/read-all', {}),
}
