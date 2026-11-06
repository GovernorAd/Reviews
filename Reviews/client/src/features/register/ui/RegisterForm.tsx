import { App, Button, Form, Input } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth, type RegisterPayload } from '@/entities/user'

export const RegisterForm = () => {
  const { register } = useAuth()
  const { message } = App.useApp()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFinish = async (values: RegisterPayload) => {
    setIsSubmitting(true)

    try {
      await register(values)
      message.success('Аккаунт создан. Добро пожаловать!')
      navigate('/', { replace: true })
    } catch (cause) {
      message.error(cause instanceof Error ? cause.message : 'Не удалось зарегистрироваться')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form<RegisterPayload> layout="vertical" requiredMark={false} onFinish={handleFinish}>
      <Form.Item
        name="username"
        label="Логин"
        rules={[
          { required: true, message: 'Придумайте логин' },
          { min: 3, message: 'Минимум 3 символа' },
          { max: 30, message: 'Максимум 30 символов' },
          {
            pattern: /^[\p{L}\p{N}_.-]+$/u,
            message: 'Буквы, цифры, точка, дефис и подчёркивание',
          },
        ]}
      >
        <Input size="large" autoComplete="username" autoFocus placeholder="Например, ivan_petrov" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Введите email' },
          { type: 'email', message: 'Некорректный email' },
        ]}
      >
        <Input size="large" type="email" autoComplete="email" placeholder="you@example.com" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Пароль"
        rules={[
          { required: true, message: 'Придумайте пароль' },
          { min: 8, message: 'Минимум 8 символов' },
          { max: 72, message: 'Максимум 72 символа' },
        ]}
      >
        <Input.Password size="large" autoComplete="new-password" placeholder="Не менее 8 символов" />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        size="large"
        block
        loading={isSubmitting}
        style={{ marginTop: 8 }}
      >
        Зарегистрироваться
      </Button>
    </Form>
  )
}
