import { LoginOutlined } from '@ant-design/icons'
import { Button, Pagination, Typography } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'

import {
  useReviews,
  type Review,
  type ReviewsQuery,
  type ReviewSort,
} from '@/entities/review'
import { useAuth } from '@/entities/user'
import { CreateReviewButton } from '@/features/create-review'
import { ReviewFilters } from '@/features/review-filters'
import { useDebouncedValue } from '@/shared/lib'
import { Container, Page } from '@/shared/ui'
import { ReviewsList } from '@/widgets/reviews-list'

const { Paragraph, Text, Title } = Typography

const PAGE_SIZE = 10

const Hero = styled.section`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(5)};
  margin-bottom: ${({ theme }) => theme.spacing(6)};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`

const Heading = styled.div`
  max-width: 680px;
`

const Subtitle = styled(Paragraph)`
  margin: ${({ theme }) => `${theme.spacing(2)} 0 0 !important`};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMuted};
`

const ActiveFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};
  font-size: 13px;
  background: ${({ theme }) => theme.colors.primarySoft};
  border: 1px solid rgba(109, 94, 252, 0.28);
  border-radius: ${({ theme }) => theme.radii.pill};
`

const FilterLabel = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
`

const FilterValue = styled.strong`
  color: ${({ theme }) => theme.colors.primary};
`

const ClearButton = styled.button`
  margin-left: auto;
  padding: 2px 0;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  background: transparent;
  border: 0;

  &:hover {
    text-decoration: underline;
  }
`

const ResultsBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
  margin: ${({ theme }) => `${theme.spacing(5)} 0 ${theme.spacing(3)}`};
`

const ResultsText = styled(Text)`
  font-size: 14px;
`

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing(7)};
`

const getPageHeading = (brand?: string, version?: string) => {
  if (brand && version) {
    return {
      title: `${brand} ${version}`,
      subtitle: `Отзывы владельцев ${brand} ${version}: опыт эксплуатации, плюсы и минусы.`,
    }
  }

  if (brand) {
    return {
      title: `Отзывы о ${brand}`,
      subtitle: `Все отзывы владельцев автомобилей ${brand}. Выберите версию в меню, чтобы уточнить список.`,
    }
  }

  if (version) {
    return {
      title: `Отзывы: ${version}`,
      subtitle: `Отзывы владельцев версии ${version}.`,
    }
  }

  return {
    title: 'Отзывы об автомобилях',
    subtitle:
      'Личный опыт владельцев: что радует, что разочаровало и на что обратить внимание перед покупкой.',
  }
}

export const ReviewsPage = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const brand = searchParams.get('brand') ?? undefined
  const version = searchParams.get('version') ?? undefined

  const [search, setSearch] = useState('')
  const [minRating, setMinRating] = useState<number>()
  const [sort, setSort] = useState<ReviewSort>('newest')
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebouncedValue(search, 400)

  useEffect(() => {
    setSearch('')
    setMinRating(undefined)
    setSort('newest')
    setPage(1)
  }, [brand, version])

  const query = useMemo<ReviewsQuery>(
    () => ({
      search: debouncedSearch.trim() || undefined,
      brand,
      version,
      minRating,
      sort,
      page,
      limit: PAGE_SIZE,
    }),
    [debouncedSearch, brand, version, minRating, sort, page],
  )

  const { reviews, pagination, isLoading, error, refresh } = useReviews(query)

  const hasFilters = Boolean(
    search.trim() || minRating || sort !== 'newest' || brand || version,
  )

  const heading = getPageHeading(brand, version)

  const handleFiltersChange = (patch: Partial<ReviewsQuery>) => {
    if (patch.search !== undefined) {
      setSearch(patch.search)
    }

    if ('minRating' in patch) {
      setMinRating(patch.minRating)
    }

    if (patch.sort !== undefined) {
      setSort(patch.sort)
    }

    setPage(1)
  }

  const handleClearCarFilter = () => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('brand')
    nextParams.delete('version')
    setSearchParams(nextParams, { replace: true })
  }

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReviewCreated = (review: Review) => {
    navigate(`/reviews/${review.id}`)
  }

  const renderReviewAction = () => {
    if (isAuthLoading) {
      return (
        <Button size="large" loading>
          Проверяем сессию…
        </Button>
      )
    }

    if (isAuthenticated) {
      return <CreateReviewButton onCreated={handleReviewCreated} />
    }

    return (
      <Button
        type="primary"
        size="large"
        icon={<LoginOutlined />}
        onClick={() => navigate('/login')}
      >
        Войти, чтобы оставить отзыв
      </Button>
    )
  }

  return (
    <Page>
      <Container>
        <Hero>
          <Heading>
            <Title level={1} style={{ margin: 0 }}>
              {heading.title}
            </Title>
            <Subtitle>{heading.subtitle}</Subtitle>
          </Heading>

          {renderReviewAction()}
        </Hero>

        {brand || version ? (
          <ActiveFilter>
            <FilterLabel>Выбран автомобиль:</FilterLabel>
            <FilterValue>
              {[brand, version].filter(Boolean).join(' · ')}
            </FilterValue>
            <ClearButton type="button" onClick={handleClearCarFilter}>
              Показать все отзывы
            </ClearButton>
          </ActiveFilter>
        ) : null}

        <ReviewFilters
          search={search}
          minRating={minRating}
          sort={sort}
          onChange={handleFiltersChange}
        />

        <ResultsBar>
          <ResultsText type="secondary">
            {isLoading || !pagination
              ? 'Загружаем отзывы…'
              : `Найдено отзывов: ${pagination.total}`}
          </ResultsText>

          {pagination && pagination.totalPages > 1 ? (
            <ResultsText type="secondary">
              Страница {pagination.page} из {pagination.totalPages}
            </ResultsText>
          ) : null}
        </ResultsBar>

        <ReviewsList
          reviews={reviews}
          isLoading={isLoading}
          error={error}
          hasFilters={hasFilters}
          onRetry={() => void refresh()}
        />

        {pagination && pagination.totalPages > 1 ? (
          <PaginationWrapper>
            <Pagination
              current={pagination.page}
              pageSize={pagination.limit}
              total={pagination.total}
              showSizeChanger={false}
              onChange={handlePageChange}
              aria-label="Пагинация отзывов"
            />
          </PaginationWrapper>
        ) : null}
      </Container>
    </Page>
  )
}
