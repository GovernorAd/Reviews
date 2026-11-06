import { App as AntdApp, ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import type { PropsWithChildren } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { AuthProvider } from '@/entities/user'
import { theme } from '@/shared/theme'

import { GlobalStyles } from '../styles/GlobalStyles'

export const AppProviders = ({ children }: PropsWithChildren) => (
  <ThemeProvider theme={theme}>
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: {
          colorPrimary: theme.colors.primary,
          colorInfo: theme.colors.primary,
          colorBgBase: theme.colors.background,
          colorTextBase: theme.colors.text,
          colorBorder: theme.colors.border,
          colorSuccess: theme.colors.success,
          colorError: theme.colors.danger,
          borderRadius: 10,
          fontFamily: theme.fonts.base,
        },
        components: {
          Button: {
            borderRadius: 10,
            controlHeightLG: 44,
            fontWeight: 600,
          },
          Input: {
            controlHeightLG: 44,
          },
          Select: {
            controlHeightLG: 44,
          },
          Modal: {
            borderRadiusLG: 18,
          },
        },
      }}
    >
      <AntdApp>
        <GlobalStyles />
        <AuthProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  </ThemeProvider>
)
