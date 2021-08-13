import cors from 'cors'
import { config } from 'dotenv-flow'
import express from 'express'

config({ silent: true })

import { router } from './routes' // eslint-disable-line

const app = express()

app.use(
  cors({
    exposedHeaders: ['x-total-count', 'Content-Type', 'Content-Length'],
  })
)

app.use(
  express.json({
    type: ['application/json', 'text/plain'],
  })
)

app.use(router)

export { app }
