import { Alert, Button, Empty, Skeleton } from 'antd'
import styled from 'styled-components'

import { ReviewPreviewCard, type Review } from '@/entities/review'

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`

const CardPlaceholder = styled.div`
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing(5)};
  padding: ${({ theme }) => theme.spacing(5)};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`

const SkeletonImage = styled(Skeleton.Node)`
  width: 100% !important;
  height: 170px !important;
  border-radius: ${({ theme }) => theme.radii.md};
`

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing(10)} ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
`

interface ReviewsListProps {
  reviews: Review[]
  isLoading: boolean
  error: string | null
  hasFilters?: boolean
  onRetry: () => void
}

const SKELETON_KEYS = ['first', 'second', 'third']

export const ReviewsList = ({
  reviews,
  isLoading,
  error,
  hasFilters = false,
  onRetry,
}: ReviewsListProps) => {
  if (isLoading) {
    return (
      <List>
        {SKELETON_KEYS.map((key) => (
          <CardPlaceholder key={key}>
            <SkeletonImage active />
            <Skeleton active title paragraph={{ rows: 4 }} />
          </CardPlaceholder>
        ))}
      </List>
    )
  }

  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        message="Не удалось загрузить отзывы"
        description={error}
        action={
          <Button size="small" onClick={onRetry}>
            Повторить
          </Button>
        }
      />
    )
  }

  if (reviews.length === 0) {
    return (
      <EmptyState>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            hasFilters
              ? 'По выбранным условиям отзывов не найдено. Попробуйте изменить фильтры.'
              : 'Отзывов пока нет — станьте первым, кто поделится впечатлениями.'
          }
        />
      </EmptyState>
    )
  }

  return (
    <List>
      {reviews.map((review) => (
        <ReviewPreviewCard key={review.id} review={review} />
      ))}
    </List>
  )
}
