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

export const GuestRoute = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Loader>
        <Spin size="large" />
      </Loader>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
