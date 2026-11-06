import { SearchOutlined } from '@ant-design/icons'
import { Input, Select } from 'antd'
import styled from 'styled-components'

import type { ReviewsQuery, ReviewSort } from '@/entities/review'

const Panel = styled.section`
  display: grid;
  grid-template-columns: minmax(220px, 1fr) 190px 190px;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`

const RATING_OPTIONS = [
  { value: 5, label: 'Только 5 звёзд' },
  { value: 4, label: '4 и выше' },
  { value: 3, label: '3 и выше' },
]

const SORT_OPTIONS: Array<{ value: ReviewSort; label: string }> = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
  { value: 'rating', label: 'По оценке' },
]

interface ReviewFiltersProps {
  search: string
  minRating?: number
  sort: ReviewSort
  onChange: (patch: Partial<ReviewsQuery>) => void
}

export const ReviewFilters = ({ search, minRating, sort, onChange }: ReviewFiltersProps) => (
  <Panel aria-label="Фильтры отзывов">
    <Input
      size="large"
      allowClear
      value={search}
      prefix={<SearchOutlined />}
      placeholder="Поиск по марке, версии, автору или тексту"
      onChange={(event) => onChange({ search: event.target.value })}
    />

    <Select<number>
      size="large"
      allowClear
      value={minRating}
      placeholder="Любая оценка"
      options={RATING_OPTIONS}
      onChange={(value) => onChange({ minRating: value })}
      aria-label="Минимальная оценка"
    />

    <Select<ReviewSort>
      size="large"
      value={sort}
      options={SORT_OPTIONS}
      onChange={(value) => onChange({ sort: value })}
      aria-label="Сортировка отзывов"
    />
  </Panel>
)
