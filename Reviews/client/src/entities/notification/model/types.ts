export type NotificationType = 'review-approved' | 'review-rejected'

export interface AppNotification {
  id: string
  userId: string
  reviewId: string
  type: NotificationType
  title: string
  message: string
  reason?: string
  isRead: boolean
  createdAt: string
}

export interface NotificationsResult {
  items: AppNotification[]
  unreadCount: number
}
