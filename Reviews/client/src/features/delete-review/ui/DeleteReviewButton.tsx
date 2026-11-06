import { DeleteOutlined } from '@ant-design/icons'
import { App, Button, Popconfirm } from 'antd'
import { useState } from 'react'

import type { Review } from '@/entities/review'

interface DeleteReviewButtonProps {
  review: Review
  onDelete: (id: string) => Promise<void>
}

export const DeleteReviewButton = ({ review, onDelete }: DeleteReviewButtonProps) => {
  const { message } = App.useApp()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)

    try {
      await onDelete(review.id)
      message.success('Отзыв удалён')
    } catch (cause) {
      message.error(cause instanceof Error ? cause.message : 'Не удалось удалить отзыв')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Popconfirm
      title="Удалить отзыв?"
      description={`Отзыв автора «${review.author}» будет удалён безвозвратно.`}
      okText="Удалить"
      cancelText="Отмена"
      okButtonProps={{ danger: true }}
      onConfirm={handleConfirm}
    >
      <Button type="text" danger size="small" icon={<DeleteOutlined />} loading={isDeleting}>
        Удалить
      </Button>
    </Popconfirm>
  )
}
