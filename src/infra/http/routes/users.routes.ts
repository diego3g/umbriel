import express from 'express'

import { adaptMiddleware } from '../adapters/ExpressMiddlewareAdapter'
import { adaptRoute } from '../adapters/ExpressRouteAdapter'
import { makeRegisterUserController } from '../factories/controllers/RegisterUserControllerFactory'
import { makeEnsureAuthenticatedMiddleware } from '../factories/middlewares/EnsureAuthenticatedMiddlewareFactory'

const usersRouter = express.Router()

usersRouter.use(adaptMiddleware(makeEnsureAuthenticatedMiddleware()))

usersRouter.post('/', adaptRoute(makeRegisterUserController()))

export { usersRouter }
