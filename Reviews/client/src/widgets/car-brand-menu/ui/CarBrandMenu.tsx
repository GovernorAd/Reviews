import { CarOutlined, DownOutlined } from '@ant-design/icons'
import { Dropdown, Skeleton, type MenuProps } from 'antd'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'

import { useCarCatalog, type CarBrandSummary, type CarVersionSummary } from '@/entities/review'
import { Container } from '@/shared/ui'

const Bar = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Inner = styled(Container)`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing(3)};
  padding-top: ${({ theme }) => theme.spacing(2)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};

  @media (max-width: 900px) {
    align-items: center;
    overflow: hidden;
  }
`

const Label = styled.div`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => `${theme.spacing(1.5)} 0`};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  white-space: nowrap;
`

const ScrollArea = styled.div.attrs({ id: 'car-brand-menu-scroll' })`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(1.5)};
  min-width: 0;

  @media (max-width: 900px) {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 2px;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`

const BrandChip = styled.div<{ $active: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 2px;
  padding: 2px 4px 2px ${({ theme }) => theme.spacing(2.5)};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primarySoft : theme.colors.background};
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.pill};
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySoft};
  }
`

const BrandLink = styled(Link)<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  padding: ${({ theme }) => `${theme.spacing(1)} 0`};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.text)};
  white-space: nowrap;
`

const CountBadge = styled.span<{ $active?: boolean }>`
  display: inline-grid;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  place-items: center;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  color: ${({ theme, $active }) => ($active ? '#fff' : theme.colors.textMuted)};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : 'rgba(28, 29, 43, 0.06)'};
  border-radius: ${({ theme }) => theme.radii.pill};
`

const CaretButton = styled.button`
  display: grid;
  width: 24px;
  height: 24px;
  padding: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 50%;
  place-items: center;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.primary};
    background: rgba(109, 94, 252, 0.12);
    outline: none;
  }
`

const MenuRow = styled.span`
  display: flex;
  min-width: 220px;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(4)};
`

const MenuName = styled.span<{ $active?: boolean }>`
  overflow: hidden;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.text)};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  text-overflow: ellipsis;
  white-space: nowrap;
`

const StatusText = styled.span`
  padding: ${({ theme }) => `${theme.spacing(1.5)} 0`};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`

const SKELETON_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8']

const normalize = (value: string) => value.toLocaleLowerCase('ru-RU')

const buildCatalogUrl = (brand: string, version?: string) => {
  const params = new URLSearchParams({ brand })

  if (version) {
    params.set('version', version)
  }

  return `/?${params.toString()}`
}

const getVersionItems = (
  brand: CarBrandSummary,
  activeVersion: string | undefined,
  onSelect: (version?: string) => void,
): MenuProps['items'] => {
  const versionItems: MenuProps['items'] = brand.versions.map(
    (version: CarVersionSummary) => ({
      key: version.version,
      label: (
        <MenuRow data-version={version.version}>
          <MenuName
            $active={Boolean(
              activeVersion && normalize(activeVersion) === normalize(version.version),
            )}
          >
            {version.version}
          </MenuName>
          <CountBadge data-count={version.total}>{version.total}</CountBadge>
        </MenuRow>
      ),
      onClick: () => onSelect(version.version),
    }),
  )

  return [
    {
      key: '__all__',
      label: (
        <MenuRow data-version="__all__">
          <MenuName $active={!activeVersion}>Все отзывы</MenuName>
          <CountBadge data-count={brand.total}>{brand.total}</CountBadge>
        </MenuRow>
      ),
      onClick: () => onSelect(),
    },
    ...(versionItems.length > 0 ? [{ type: 'divider' as const }] : []),
    ...versionItems,
  ]
}

export const CarBrandMenu = () => {
  const { brands, isLoading, error } = useCarCatalog()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const activeBrand = searchParams.get('brand') ?? undefined
  const activeVersion = searchParams.get('version') ?? undefined

  const renderContent = () => {
    if (isLoading && brands.length === 0) {
      return (
        <ScrollArea>
          {SKELETON_KEYS.map((key) => (
            <Skeleton.Button key={key} active size="small" shape="round" style={{ width: 92 }} />
          ))}
        </ScrollArea>
      )
    }

    if (error && brands.length === 0) {
      return <StatusText>Не удалось загрузить список марок</StatusText>
    }

    if (brands.length === 0) {
      return <StatusText>Пока нет отзывов об автомобилях</StatusText>
    }

    return (
      <ScrollArea>
        {brands.map((brand) => {
          const isActive = Boolean(activeBrand && normalize(activeBrand) === normalize(brand.brand))
          const items = getVersionItems(brand, isActive ? activeVersion : undefined, (version) =>
            navigate(buildCatalogUrl(brand.brand, version)),
          )

          return (
            <BrandChip key={brand.brand} $active={isActive}>
              <BrandLink
                to={buildCatalogUrl(brand.brand)}
                $active={isActive}
                title={`Все отзывы о ${brand.brand}`}
                data-brand={brand.brand}
              >
                {brand.brand}
                <CountBadge $active={isActive} data-count={brand.total}>
                  {brand.total}
                </CountBadge>
              </BrandLink>

              <Dropdown menu={{ items }} trigger={['click']} placement="bottomLeft">
                <CaretButton
                  type="button"
                  aria-label={`Версии ${brand.brand}`}
                  title={`Версии ${brand.brand}`}
                >
                  <DownOutlined style={{ fontSize: 10 }} />
                </CaretButton>
              </Dropdown>
            </BrandChip>
          )
        })}
      </ScrollArea>
    )
  }

  return (
    <Bar aria-label="Меню марок автомобилей">
      <Inner>
        <Label>
          <CarOutlined />
          Марки
        </Label>
        {renderContent()}
      </Inner>
    </Bar>
  )
}
