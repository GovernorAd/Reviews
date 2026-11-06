import { Spin } from 'antd'
import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import styled from 'styled-components'

import { useAuth } from '@/entities/user'

const Loader = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(20)} 0;
`

export const AdminRoute = ({ children }: PropsWithChildren) => {
  const { user, isAdmin, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Loader>
        <Spin size="large" />
      </Loader>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
