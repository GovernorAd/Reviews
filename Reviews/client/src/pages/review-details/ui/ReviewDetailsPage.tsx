import { ArrowLeftOutlined } from '@ant-design/icons'
import { Alert, Button, Result, Skeleton, Typography } from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

import { ReviewDetailsCard, notifyCatalogChanged, useReview } from '@/entities/review'
import { useAuth } from '@/entities/user'
import { CommentForm } from '@/features/create-comment'
import { DeleteReviewButton } from '@/features/delete-review'
import { Container, Page } from '@/shared/ui'

const { Text } = Typography

const Content = styled.div`
  max-width: 920px;
  margin: 0 auto;
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const LoadingCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(6)};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
`

const SkeletonCover = styled(Skeleton.Image)`
  width: 100% !important;
  height: 320px !important;
`

const ErrorActions = styled.div`
  display: flex;
  justify-content: center;
`

const ModerationAlert = styled(Alert)`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

export const ReviewDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { review, isLoading, error, errorStatus, refresh, addComment, removeReview } = useReview(id)

  const handleDelete = async () => {
    await removeReview()
    notifyCatalogChanged()
    navigate('/')
  }

  const backLink = (
    <BackLink to="/">
      <ArrowLeftOutlined /> Все отзывы
    </BackLink>
  )

  if (isLoading) {
    return (
      <Page>
        <Container>
          <Content>
            {backLink}
            <LoadingCard>
              <SkeletonCover active />
              <Skeleton active title paragraph={{ rows: 6 }} />
            </LoadingCard>
          </Content>
        </Container>
      </Page>
    )
  }

  if (error && errorStatus === 404) {
    return (
      <Page>
        <Container>
          <Content>
            <Result
              status="404"
              title="Отзыв не найден"
              subTitle="Возможно, он был удалён или ссылка неверна."
              extra={
                <ErrorActions>
                  <Button type="primary" onClick={() => navigate('/')}>
                    Вернуться к отзывам
                  </Button>
                </ErrorActions>
              }
            />
          </Content>
        </Container>
      </Page>
    )
  }

  if (error || !review) {
    return (
      <Page>
        <Container>
          <Content>
            {backLink}
            <Alert
              type="error"
              showIcon
              message="Не удалось загрузить отзыв"
              description={error ?? 'Попробуйте обновить страницу'}
              action={
                <Button size="small" onClick={() => void refresh()}>
                  Повторить
                </Button>
              }
            />
          </Content>
        </Container>
      </Page>
    )
  }

  const isOwner = Boolean(user && review.userId === user.id)
  const isApproved = review.status === 'approved'

  return (
    <Page>
      <Container>
        <Content>
          {backLink}

          {review.status === 'pending' ? (
            <ModerationAlert
              type="info"
              showIcon
              message="Отзыв на модерации"
              description="Отзыв видят только вы и администратор. После проверки он появится в общем списке."
            />
          ) : null}

          {review.status === 'rejected' ? (
            <ModerationAlert
              type="error"
              showIcon
              message="Отзыв отклонён"
              description={
                review.moderationReason
                  ? `Причина: ${review.moderationReason}`
                  : 'Причина отклонения не указана.'
              }
            />
          ) : null}

          <ReviewDetailsCard
            review={review}
            commentsEnabled={isApproved}
            commentForm={
              isApproved ? (
                <CommentForm
                  reviewId={review.id}
                  onSubmit={(_, text) => addComment(text)}
                />
              ) : undefined
            }
            actions={
              isOwner ? (
                <DeleteReviewButton review={review} onDelete={handleDelete} />
              ) : undefined
            }
          />

          <Text type="secondary" style={{ display: 'block', marginTop: 16, fontSize: 12 }}>
            Мнение автора может не совпадать с мнением редакции.
          </Text>
        </Content>
      </Container>
    </Page>
  )
}
