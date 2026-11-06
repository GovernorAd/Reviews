import { randomUUID } from 'node:crypto'

import type { User, UserRole } from './auth.types.js'

interface CreateUserInput {
  username: string
  email: string
  passwordHash: string
  role?: UserRole
}

class UserRepository {
  private users: User[] = []

  findById(id: string): User | undefined {
    return this.users.find((user) => user.id === id)
  }

  findByUsername(username: string): User | undefined {
    const normalized = username.toLowerCase()

    return this.users.find((user) => user.username.toLowerCase() === normalized)
  }

  findByEmail(email: string): User | undefined {
    const normalized = email.toLowerCase()

    return this.users.find((user) => user.email.toLowerCase() === normalized)
  }

  create(input: CreateUserInput): User {
    const user: User = {
      id: randomUUID(),
      username: input.username,
      email: input.email,
      passwordHash: input.passwordHash,
      role: input.role ?? 'user',
      createdAt: new Date().toISOString(),
    }

    this.users.push(user)

    return user
  }

  setRole(id: string, role: UserRole): User | undefined {
    const user = this.findById(id)

    if (user) {
      user.role = role
    }

    return user
  }
}

export const userRepository = new UserRepository()
