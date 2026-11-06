import { LogoutOutlined } from '@ant-design/icons'
import { App, Button } from 'antd'
import { useState } from 'react'

import { useAuth } from '@/entities/user'

export const LogoutButton = () => {
  const { logout } = useAuth()
  const { message } = App.useApp()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)

    try {
      await logout()
      message.success('Вы вышли из аккаунта')
    } catch (cause) {
      message.error(cause instanceof Error ? cause.message : 'Не удалось выйти из аккаунта')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="text"
      size="small"
      icon={<LogoutOutlined />}
      loading={isLoading}
      onClick={handleClick}
    >
      Выйти
    </Button>
  )
}
