import { randomUUID } from 'node:crypto'

import type { AppNotification, NotificationType } from './notification.types.js'

interface CreateNotificationInput {
  userId: string
  reviewId: string
  type: NotificationType
  title: string
  message: string
  reason?: string
}

class NotificationRepository {
  private notifications: AppNotification[] = []

  findByUserId(userId: string): AppNotification[] {
    return this.notifications
      .filter((notification) => notification.userId === userId)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
  }

  countUnread(userId: string): number {
    return this.notifications.filter(
      (notification) => notification.userId === userId && !notification.isRead,
    ).length
  }

  create(input: CreateNotificationInput): AppNotification {
    const notification: AppNotification = {
      id: randomUUID(),
      ...input,
      isRead: false,
      createdAt: new Date().toISOString(),
    }

    this.notifications = [notification, ...this.notifications]

    return notification
  }

  markRead(id: string, userId: string): AppNotification | undefined {
    const notification = this.notifications.find(
      (item) => item.id === id && item.userId === userId,
    )

    if (notification) {
      notification.isRead = true
    }

    return notification
  }

  markAllRead(userId: string): number {
    let updated = 0

    for (const notification of this.notifications) {
      if (notification.userId === userId && !notification.isRead) {
        notification.isRead = true
        updated += 1
      }
    }

    return updated
  }

  deleteByReviewId(reviewId: string): void {
    this.notifications = this.notifications.filter(
      (notification) => notification.reviewId !== reviewId,
    )
  }
}

export const notificationRepository = new NotificationRepository()
