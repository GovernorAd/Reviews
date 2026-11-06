import { createApp } from './app.js'
import { env } from './config/env.js'
import { authService } from './modules/auth/index.js'

await authService.ensureAdmin()

const app = createApp()

const server = app.listen(env.port, () => {
  console.log(`[server] Режим: ${env.nodeEnv}`)
  console.log(`[server] API: http://localhost:${env.port}/api`)
  console.log(`[server] Health: http://localhost:${env.port}/api/health`)

  if (env.isProduction && env.jwtSecret === 'reviews-dev-secret-change-me') {
    console.warn('[server] ВНИМАНИЕ: используется dev-секрет JWT. Задайте JWT_SECRET в .env')
  }

  if (env.isProduction && env.adminPassword === 'admin12345') {
    console.warn('[server] ВНИМАНИЕ: используется пароль администратора по умолчанию')
  }
})

const shutdown = (signal: NodeJS.Signals) => {
  console.log(`[server] ${signal} — завершаем работу`)

  server.close(() => {
    process.exit(0)
  })

  setTimeout(() => process.exit(1), 5000).unref()
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
