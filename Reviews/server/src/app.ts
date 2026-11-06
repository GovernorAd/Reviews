import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import cors from 'cors'
import express from 'express'

import { apiRouter } from './api/router.js'
import { env } from './config/env.js'
import { errorHandler } from './shared/middleware/errorHandler.js'
import { notFoundHandler } from './shared/middleware/notFoundHandler.js'

export const createApp = () => {
  const app = express()

  app.disable('x-powered-by')
  app.use(cors({ origin: env.corsOrigins, credentials: true }))
  app.use(express.json({ limit: '100kb' }))

  app.use('/api', apiRouter)

  const clientDistPath = fileURLToPath(new URL('../../client/dist', import.meta.url))

  if (env.isProduction && existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath))
    app.get(/^(?!\/api(?:\/|$)).*/, (_req, res) => {
      res.sendFile(join(clientDistPath, 'index.html'))
    })
  }

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
