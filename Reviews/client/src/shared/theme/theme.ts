export const theme = {
  colors: {
    primary: '#6d5efc',
    primarySoft: '#efedff',
    background: '#f5f6fb',
    surface: '#ffffff',
    border: '#e6e8f0',
    text: '#1c1d2b',
    textMuted: '#6b7080',
    danger: '#e5484d',
    success: '#2fa36b',
    rating: '#f5a623',
  },
  radii: {
    sm: '8px',
    md: '14px',
    lg: '20px',
    pill: '999px',
  },
  spacing: (steps: number) => `${steps * 4}px`,
  shadows: {
    card: '0 12px 32px rgba(28, 29, 43, 0.08)',
    header: '0 1px 0 rgba(28, 29, 43, 0.06)',
  },
  fonts: {
    base: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
  },
  breakpoints: {
    md: '768px',
    lg: '1024px',
  },
} as const

export type AppTheme = typeof theme
