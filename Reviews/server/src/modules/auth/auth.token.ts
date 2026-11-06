import { SignJWT, jwtVerify } from 'jose'

import { env } from '../../config/env.js'

const secret = new TextEncoder().encode(env.jwtSecret)

const TOKEN_TTL = '7d'

export const createAuthToken = (userId: string): Promise<string> =>
  new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(secret)

export const verifyAuthToken = async (token: string): Promise<string> => {
  const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] })

  if (!payload.sub) {
    throw new Error('В токене отсутствует идентификатор пользователя')
  }

  return payload.sub
}
