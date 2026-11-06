import { Typography } from 'antd'
import type { ReactNode } from 'react'
import styled from 'styled-components'

import { Container, Page } from '@/shared/ui'

const { Paragraph, Title } = Typography

const Center = styled.div`
  display: flex;
  justify-content: center;
`

const Card = styled.section`
  width: 100%;
  max-width: 440px;
  padding: ${({ theme }) => theme.spacing(8)};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing(6)};
  }
`

const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing(6)};
`

const Heading = styled(Title)`
  margin: 0 0 ${({ theme }) => theme.spacing(2)} !important;
`

const Subtitle = styled(Paragraph)`
  margin: 0 !important;
  color: ${({ theme }) => theme.colors.textMuted};
`

const Footer = styled.footer`
  margin-top: ${({ theme }) => theme.spacing(5)};
  font-size: 14px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};

  a {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
  }
`

interface AuthCardProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

export const AuthCard = ({ title, subtitle, children, footer }: AuthCardProps) => (
  <Page>
    <Container>
      <Center>
        <Card>
          <Header>
            <Heading level={2}>{title}</Heading>
            <Subtitle>{subtitle}</Subtitle>
          </Header>

          {children}

          {footer ? <Footer>{footer}</Footer> : null}
        </Card>
      </Center>
    </Container>
  </Page>
)
