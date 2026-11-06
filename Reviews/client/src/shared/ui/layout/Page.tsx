import styled from 'styled-components'

export const Page = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing(10)} 0 ${({ theme }) => theme.spacing(16)};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing(6)} 0 ${({ theme }) => theme.spacing(12)};
  }
`
