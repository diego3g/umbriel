import express from 'express'

import { adaptMiddleware } from '@core/infra/adapters/ExpressMiddlewareAdapter'
import { adaptRoute } from '@core/infra/adapters/ExpressRouteAdapter'

import { makeRegisterEventController } from './factories/controllers/RegisterEventControllerFactory'
import { makeAmazonSNSValidatorMiddleware } from './factories/middlewares/AmazonSNSValidatorMiddlewareFactory'

const router = express.Router()

router.post(
  '/events/notifications',
  adaptMiddleware(makeAmazonSNSValidatorMiddleware()),
  adaptRoute(makeRegisterEventController())
)

export { router }
