import { Link } from 'react-router-dom'

import { RegisterForm } from '@/features/register'
import { AuthCard } from '@/widgets/auth-card'

export const RegisterPage = () => (
  <AuthCard
    title="Регистрация"
    subtitle="Создайте аккаунт, чтобы делиться отзывами и комментариями."
    footer={
      <>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </>
    }
  >
    <RegisterForm />
  </AuthCard>
)
