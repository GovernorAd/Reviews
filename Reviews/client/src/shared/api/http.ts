import { env } from '@/shared/config'

import { ApiError } from './ApiError'

interface ErrorResponse {
  error?: {
    message?: string
    details?: unknown
  }
}

interface DataResponse<T> {
  data: T
}

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${env.apiUrl}${path}`, {
    credentials: 'include',
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  })

  const payload = (await response.json().catch(() => null)) as (DataResponse<T> & ErrorResponse) | null

  if (!response.ok) {
    throw new ApiError(
      response.status,
      payload?.error?.message ?? `Не удалось выполнить запрос (${response.status})`,
    )
  }

  return payload?.data as T
}

export const http = {
  get: <T>(path: string, init?: RequestInit) => request<T>(path, { ...init, method: 'GET' }),
  post: <T>(path: string, body: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T = void>(path: string, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'DELETE' }),
}
