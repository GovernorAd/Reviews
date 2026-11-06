import { env } from '../../config/env.js'
import { HttpError } from '../../shared/errors/HttpError.js'
import { hashPassword, verifyPassword } from './auth.password.js'
import { userRepository } from './auth.repository.js'
import type { LoginInput, RegisterInput } from './auth.schema.js'
import { createAuthToken } from './auth.token.js'
import { toAuthUser, type AuthUser } from './auth.types.js'

interface AuthResult {
  user: AuthUser
  token: string
}

export const authService = {
  async ensureAdmin(): Promise<void> {
    const existing = userRepository.findByUsername(env.adminUsername)

    if (existing) {
      if (existing.role !== 'admin') {
        userRepository.setRole(existing.id, 'admin')
      }

      return
    }

    if (userRepository.findByEmail(env.adminEmail)) {
      throw new Error(`Email администратора уже занят: ${env.adminEmail}`)
    }

    const passwordHash = await hashPassword(env.adminPassword)

    userRepository.create({
      username: env.adminUsername,
      email: env.adminEmail,
      passwordHash,
      role: 'admin',
    })

    console.log(`[server] Создан администратор: ${env.adminUsername}`)
  },

  async register(input: RegisterInput): Promise<AuthResult> {
    if (userRepository.findByUsername(input.username)) {
      throw HttpError.conflict('Этот логин уже занят')
    }

    if (userRepository.findByEmail(input.email)) {
      throw HttpError.conflict('Этот email уже зарегистрирован')
    }

    const passwordHash = await hashPassword(input.password)
    const user = userRepository.create({
      username: input.username,
      email: input.email,
      passwordHash,
    })

    return {
      user: toAuthUser(user),
      token: await createAuthToken(user.id),
    }
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const user = userRepository.findByUsername(input.username)
    const isPasswordValid = user ? await verifyPassword(input.password, user.passwordHash) : false

    if (!user || !isPasswordValid) {
      throw HttpError.unauthorized('Неверный логин или пароль')
    }

    return {
      user: toAuthUser(user),
      token: await createAuthToken(user.id),
    }
  },

  getUserById(id: string): AuthUser {
    const user = userRepository.findById(id)

    if (!user) {
      throw HttpError.unauthorized('Сессия недействительна, войдите снова')
    }

    return toAuthUser(user)
  },
}
