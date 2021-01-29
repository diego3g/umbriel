import express from 'express'

import { adaptRoute } from '../adapters/ExpressRouteAdapter'
import { makeRegisterUserController } from '../factories/RegisterUserControllerFactory'

const usersRouter = express.Router()

usersRouter.post('/', adaptRoute(makeRegisterUserController()))

export { usersRouter }
