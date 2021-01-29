import express from 'express'

import { adaptRoute } from '../adapters/ExpressRouteAdapter'
import { makeAuthenticateUserController } from '../factories/AuthenticateUserControllerFactory'

const sessionsRouter = express.Router()

sessionsRouter.post('/', adaptRoute(makeAuthenticateUserController()))

export { sessionsRouter }
