import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

import { Container, Page } from '@/shared/ui'

export const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <Page>
      <Container>
        <Result
          status="404"
          title="404"
          subTitle="Такой страницы не существует."
          extra={
            <Button type="primary" onClick={() => navigate('/')}>
              На главную
            </Button>
          }
        />
      </Container>
    </Page>
  )
}
