import { Link } from 'react-router-dom'

import { LoginForm } from '@/features/login'
import { AuthCard } from '@/widgets/auth-card'

export const LoginPage = () => (
  <AuthCard
    title="Вход"
    subtitle="Войдите, чтобы оставлять отзывы и комментарии."
    footer={
      <>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </>
    }
  >
    <LoginForm />
  </AuthCard>
)
