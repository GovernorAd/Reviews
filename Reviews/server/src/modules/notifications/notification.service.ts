import { HttpError } from '../../shared/errors/HttpError.js'
import { notificationRepository } from './notification.repository.js'
import type {
  AppNotification,
  NotificationsResult,
  ReviewModerationNotificationInput,
} from './notification.types.js'

export const notificationService = {
  list(userId: string): NotificationsResult {
    return {
      items: notificationRepository.findByUserId(userId),
      unreadCount: notificationRepository.countUnread(userId),
    }
  },

  markRead(id: string, userId: string): AppNotification {
    const notification = notificationRepository.markRead(id, userId)

    if (!notification) {
      throw HttpError.notFound('Уведомление не найдено')
    }

    return notification
  },

  markAllRead(userId: string): number {
    return notificationRepository.markAllRead(userId)
  },

  removeByReviewId(reviewId: string): void {
    notificationRepository.deleteByReviewId(reviewId)
  },

  notifyReviewModerated({
    review,
    status,
    reason,
  }: ReviewModerationNotificationInput): AppNotification | null {
    if (!review.userId) {
      return null
    }

    const carTitle = `${review.carBrand} ${review.carVersion}`

    if (status === 'approved') {
      return notificationRepository.create({
        userId: review.userId,
        reviewId: review.id,
        type: 'review-approved',
        title: 'Отзыв одобрен',
        message: `Ваш отзыв о ${carTitle} опубликован на сайте.`,
      })
    }

    return notificationRepository.create({
      userId: review.userId,
      reviewId: review.id,
      type: 'review-rejected',
      title: 'Отзыв отклонён',
      message: `Ваш отзыв о ${carTitle} отклонён модератором.`,
      reason,
    })
  },
}
