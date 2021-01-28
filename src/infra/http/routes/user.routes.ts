import express from 'express'

import { adaptRoute } from '../adapters/ExpressRouteAdapter'
import { makeRegisterUserController } from '../factories/RegisterUserControllerFactory'

const userRouter = express.Router()

userRouter.post('/', adaptRoute(makeRegisterUserController()))

export { userRouter }
