import { App, Button, Input } from 'antd'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { useAuth } from '@/entities/user'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`

const LoginPrompt = styled.div`
  padding: ${({ theme }) => theme.spacing(3)};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.md};

  a {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
  }
`

interface CommentFormProps {
  reviewId: string
  onSubmit: (reviewId: string, text: string) => Promise<unknown>
}

export const CommentForm = ({ reviewId, onSubmit }: CommentFormProps) => {
  const { isAuthenticated } = useAuth()
  const { message } = App.useApp()
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isAuthenticated) {
    return (
      <LoginPrompt>
        Оставлять комментарии могут только зарегистрированные пользователи.{' '}
        <Link to="/login">Войти</Link>
      </LoginPrompt>
    )
  }

  const trimmedText = text.trim()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (trimmedText.length < 2) {
      message.warning('Комментарий должен содержать минимум 2 символа')
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(reviewId, trimmedText)
      setText('')
      message.success('Комментарий добавлен')
    } catch (cause) {
      message.error(cause instanceof Error ? cause.message : 'Не удалось добавить комментарий')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input.TextArea
        value={text}
        rows={2}
        maxLength={400}
        showCount
        disabled={isSubmitting}
        placeholder="Напишите комментарий…"
        onChange={(event) => setText(event.target.value)}
      />

      <Actions>
        <Button
          type="primary"
          htmlType="submit"
          size="small"
          loading={isSubmitting}
          disabled={trimmedText.length < 2}
        >
          Отправить
        </Button>
      </Actions>
    </Form>
  )
}
