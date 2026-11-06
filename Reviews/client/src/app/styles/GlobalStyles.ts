import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    min-height: 100%;
  }

  body {
    margin: 0;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.base};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  code {
    padding: 2px 6px;
    font-size: 0.9em;
    background: ${({ theme }) => theme.colors.primarySoft};
    border-radius: ${({ theme }) => theme.radii.sm};
  }

  ::selection {
    color: #fff;
    background: ${({ theme }) => theme.colors.primary};
  }
`
