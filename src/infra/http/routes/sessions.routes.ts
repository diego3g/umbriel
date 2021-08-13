import express from 'express'

import { adaptRoute } from '@core/infra/adapters/ExpressRouteAdapter'

import { makeAuthenticateUserController } from '../factories/controllers/AuthenticateUserControllerFactory'

const sessionsRouter = express.Router()

sessionsRouter.post('/', adaptRoute(makeAuthenticateUserController()))

export { sessionsRouter }
