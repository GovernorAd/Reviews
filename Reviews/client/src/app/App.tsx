import { Route, Routes } from 'react-router-dom'

import { AboutPage } from '@/pages/about'
import { AdminReviewsPage } from '@/pages/admin-reviews'
import { LoginPage } from '@/pages/login'
import { NotFoundPage } from '@/pages/not-found'
import { RegisterPage } from '@/pages/register'
import { ReviewDetailsPage } from '@/pages/review-details'
import { ReviewsPage } from '@/pages/reviews'
import { AppHeader } from '@/widgets/app-header'
import { CarBrandMenu } from '@/widgets/car-brand-menu'

import { AppLayout } from './layouts/AppLayout'
import { AdminRoute } from './routing/AdminRoute'
import { GuestRoute } from './routing/GuestRoute'

export const App = () => (
  <AppLayout>
    <AppHeader />
    <CarBrandMenu />
    <Routes>
      <Route path="/" element={<ReviewsPage />} />
      <Route path="/reviews/:id" element={<ReviewDetailsPage />} />
      <Route
        path="/admin/reviews"
        element={
          <AdminRoute>
            <AdminReviewsPage />
          </AdminRoute>
        }
      />
      <Route path="/about" element={<AboutPage />} />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </AppLayout>
)
