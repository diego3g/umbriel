import express from 'express'

import { adaptMiddleware } from '../adapters/ExpressMiddlewareAdapter'
import { adaptRoute } from '../adapters/ExpressRouteAdapter'
import { makeRegisterEventController } from '../factories/controllers/RegisterEventControllerFactory'
import { makeAmazonSNSValidatorMiddleware } from '../factories/middlewares/AmazonSNSValidatorMiddlewareFactory'

const eventsRouter = express.Router()

eventsRouter.post(
  '/notifications',
  adaptMiddleware(makeAmazonSNSValidatorMiddleware()),
  adaptRoute(makeRegisterEventController())
)

export { eventsRouter }
