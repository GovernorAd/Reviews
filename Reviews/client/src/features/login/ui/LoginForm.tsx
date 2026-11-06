import { App, Button, Form, Input } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth, type LoginPayload } from '@/entities/user'

export const LoginForm = () => {
  const { login } = useAuth()
  const { message } = App.useApp()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFinish = async (values: LoginPayload) => {
    setIsSubmitting(true)

    try {
      await login(values)
      message.success('Вы вошли в аккаунт')
      navigate('/', { replace: true })
    } catch (cause) {
      message.error(cause instanceof Error ? cause.message : 'Не удалось войти')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form<LoginPayload> layout="vertical" requiredMark={false} onFinish={handleFinish}>
      <Form.Item
        name="username"
        label="Логин"
        rules={[{ required: true, message: 'Введите логин' }]}
      >
        <Input size="large" autoComplete="username" autoFocus placeholder="Ваш логин" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Пароль"
        rules={[{ required: true, message: 'Введите пароль' }]}
      >
        <Input.Password size="large" autoComplete="current-password" placeholder="Ваш пароль" />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        size="large"
        block
        loading={isSubmitting}
        style={{ marginTop: 8 }}
      >
        Войти
      </Button>
    </Form>
  )
}
