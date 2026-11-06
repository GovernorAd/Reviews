import { StarFilled } from '@ant-design/icons'
import { Avatar, Button, Spin, Typography } from 'antd'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { useAuth } from '@/entities/user'
import { NotificationBell } from '@/features/notification-center'
import { LogoutButton } from '@/features/logout'
import { getInitials } from '@/shared/lib'
import { Container } from '@/shared/ui'

const { Text } = Typography

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Inner = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(4)};
  min-height: 68px;

  @media (max-width: 680px) {
    flex-wrap: wrap;
    padding-top: ${({ theme }) => theme.spacing(2)};
    padding-bottom: ${({ theme }) => theme.spacing(2)};
  }
`

const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
`

const LogoMark = styled.span`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  color: #fff;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #a08cff);
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: 0 8px 18px rgba(109, 94, 252, 0.35);
`

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};

  @media (max-width: 680px) {
    display: contents;
  }
`

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};

  @media (max-width: 680px) {
    order: 3;
    width: 100%;
    justify-content: center;
  }
`

const NavItem = styled(NavLink)`
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  border-radius: ${({ theme }) => theme.radii.pill};
  transition:
    color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySoft};
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySoft};
  }
`

const AuthArea = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding-left: ${({ theme }) => theme.spacing(3)};
  border-left: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 680px) {
    padding-left: 0;
    border-left: none;
  }
`

const UserArea = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`

const Username = styled(Text)`
  max-width: 120px;
  overflow: hidden;
  font-size: 13px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 480px) {
    display: none;
  }
`

const UserAvatar = styled(Avatar)`
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.primary};
`

export const AppHeader = () => {
  const { user, isLoading, isAdmin } = useAuth()
  const navigate = useNavigate()

  return (
    <Header>
      <Inner>
        <Logo to="/">
          <LogoMark>
            <StarFilled />
          </LogoMark>
          Reviews
        </Logo>

        <Right>
          <Nav>
            <NavItem to="/" end>
              Отзывы
            </NavItem>
            {isAdmin ? <NavItem to="/admin/reviews">Админ-панель</NavItem> : null}
            <NavItem to="/about">О проекте</NavItem>
          </Nav>

          <AuthArea>
            {isLoading ? (
              <Spin size="small" />
            ) : user ? (
              <UserArea>
                <NotificationBell />
                <UserAvatar size={30}>{getInitials(user.username)}</UserAvatar>
                <Username>{user.username}</Username>
                <LogoutButton />
              </UserArea>
            ) : (
              <>
                <Button type="text" onClick={() => navigate('/login')}>
                  Войти
                </Button>
                <Button type="primary" onClick={() => navigate('/register')}>
                  Регистрация
                </Button>
              </>
            )}
          </AuthArea>
        </Right>
      </Inner>
    </Header>
  )
}
