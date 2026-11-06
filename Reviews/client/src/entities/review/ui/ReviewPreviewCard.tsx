import { ArrowRightOutlined } from '@ant-design/icons'
import { Avatar, Rate, Typography } from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { formatDate, getInitials, truncateWords } from '@/shared/lib'

import type { Review } from '../model/types'
import { CarImage } from './CarImage'

const { Text } = Typography

const EXCERPT_WORDS = 50

const Card = styled.article`
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 40px rgba(28, 29, 43, 0.12);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`

const ImageLink = styled(Link)`
  display: block;
  min-height: 190px;
  background: ${({ theme }) => theme.colors.primarySoft};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    aspect-ratio: 16 / 9;
    min-height: 0;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  min-width: 0;
  padding: ${({ theme }) => theme.spacing(5)};
`

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
`

const BrandLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
`

const Brand = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.02em;
`

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(1)};
`

const Excerpt = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.65;
`

const Footer = styled.footer`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing(3)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  min-width: 0;
`

const AuthorAvatar = styled(Avatar)`
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.primary};
`

const AuthorText = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

const AuthorName = styled(Text)`
  overflow: hidden;
  font-size: 13px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const DateText = styled(Text)`
  font-size: 12px;
`

const ReadLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }
`

interface ReviewPreviewCardProps {
  review: Review
}

export const ReviewPreviewCard = ({ review }: ReviewPreviewCardProps) => {
  const reviewPath = `/reviews/${review.id}`
  const excerpt = truncateWords(review.text, EXCERPT_WORDS)
  const carTitle = `${review.carBrand} ${review.carVersion}`

  return (
    <Card>
      <ImageLink to={reviewPath} aria-label={`Читать отзыв о ${carTitle}`}>
        <CarImage src={review.imageUrl} alt={`Фото ${carTitle}`} />
      </ImageLink>

      <Content>
        <TopRow>
          <div>
            <BrandLink to={reviewPath}>
              <Brand>{carTitle}</Brand>
            </BrandLink>
            <RatingRow>
              <Rate disabled allowHalf value={review.rating} style={{ fontSize: 14 }} />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {review.rating.toFixed(1)}
              </Text>
            </RatingRow>
          </div>
        </TopRow>

        <Excerpt>{excerpt}</Excerpt>

        <Footer>
          <AuthorInfo>
            <AuthorAvatar size={30}>{getInitials(review.author)}</AuthorAvatar>
            <AuthorText>
              <AuthorName>{review.author}</AuthorName>
              <DateText type="secondary">{formatDate(review.createdAt)}</DateText>
            </AuthorText>
          </AuthorInfo>

          <ReadLink to={reviewPath}>
            Читать полностью <ArrowRightOutlined />
          </ReadLink>
        </Footer>
      </Content>
    </Card>
  )
}
