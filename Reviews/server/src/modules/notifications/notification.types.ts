import type { ReviewStatus } from '../reviews/review.types.js'

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

export interface ReviewModerationSubject {
  id: string
  userId?: string
  carBrand: string
  carVersion: string
}

export interface ReviewModerationNotificationInput {
  review: ReviewModerationSubject
  status: Extract<ReviewStatus, 'approved' | 'rejected'>
  reason?: string
}
