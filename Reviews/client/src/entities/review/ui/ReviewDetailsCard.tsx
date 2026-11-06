import { Avatar, Rate, Typography } from 'antd'
import type { ReactNode } from 'react'
import styled from 'styled-components'

import { formatDate, formatDateTime, getInitials } from '@/shared/lib'

import type { Review } from '../model/types'
import { CarImage } from './CarImage'

const { Paragraph, Text, Title } = Typography

const Card = styled.article`
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`

const Cover = styled.div`
  aspect-ratio: 16 / 7;
  background: ${({ theme }) => theme.colors.primarySoft};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    aspect-ratio: 4 / 3;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(8)};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing(5)};
  }
`

const Heading = styled(Title)`
  margin: 0 !important;
  letter-spacing: -0.03em;
`

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
`

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
`

const AuthorAvatar = styled(Avatar)`
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.primary};
`

const AuthorText = styled.div`
  display: flex;
  flex-direction: column;
`

const Body = styled(Paragraph)`
  margin: 0 !important;
  font-size: 16px;
  line-height: 1.75;
  white-space: pre-line;
  color: ${({ theme }) => theme.colors.text};
`

const Comments = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  padding-top: ${({ theme }) => theme.spacing(5)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`

const CommentRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`

const CommentContent = styled.div`
  flex: 1;
  min-width: 0;
`

const CommentMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing(2)};
`

const CommentText = styled(Paragraph)`
  margin: 2px 0 0 !important;
  white-space: pre-line;
  color: ${({ theme }) => theme.colors.text};
`

const CommentAvatar = styled(Avatar)`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primarySoft};
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`

interface ReviewDetailsCardProps {
  review: Review
  commentForm?: ReactNode
  commentsEnabled?: boolean
  actions?: ReactNode
}

export const ReviewDetailsCard = ({
  review,
  commentForm,
  commentsEnabled = true,
  actions,
}: ReviewDetailsCardProps) => (
  <Card>
    <Cover>
      <CarImage src={review.imageUrl} alt={`Фото ${review.carBrand} ${review.carVersion}`} />
    </Cover>

    <Content>
      <Heading level={1}>
        {review.carBrand} {review.carVersion}
      </Heading>

      <MetaRow>
        <AuthorInfo>
          <AuthorAvatar size={44}>{getInitials(review.author)}</AuthorAvatar>
          <AuthorText>
            <Text strong>{review.author}</Text>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {formatDate(review.createdAt)}
            </Text>
          </AuthorText>
        </AuthorInfo>

        <Rate disabled allowHalf value={review.rating} style={{ fontSize: 20 }} />
      </MetaRow>

      <Body>{review.text}</Body>

      {commentsEnabled ? (
        <Comments>
          <Text strong>
            Комментарии{review.comments.length > 0 ? ` (${review.comments.length})` : ''}
          </Text>

          {review.comments.length > 0 ? (
            <CommentList>
              {review.comments.map((comment) => (
                <CommentRow key={comment.id}>
                  <CommentAvatar size={28}>{getInitials(comment.author)}</CommentAvatar>
                  <CommentContent>
                    <CommentMeta>
                      <Text strong style={{ fontSize: 13 }}>
                        {comment.author}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {formatDateTime(comment.createdAt)}
                      </Text>
                    </CommentMeta>
                    <CommentText style={{ fontSize: 13 }}>{comment.text}</CommentText>
                  </CommentContent>
                </CommentRow>
              ))}
            </CommentList>
          ) : (
            <Text type="secondary" style={{ fontSize: 13 }}>
              Пока нет комментариев.
            </Text>
          )}

          {commentForm}
        </Comments>
      ) : null}

      {actions ? <Actions>{actions}</Actions> : null}
    </Content>
  </Card>
)
