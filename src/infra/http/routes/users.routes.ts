import express from 'express'

import { adaptRoute } from '../adapters/ExpressRouteAdapter'
import { makeRegisterUserController } from '../factories/controllers/RegisterUserControllerFactory'

const usersRouter = express.Router()

// usersRouter.use(adaptMiddleware(makeEnsureAuthenticatedMiddleware()))

usersRouter.post('/', adaptRoute(makeRegisterUserController()))

export { usersRouter }
