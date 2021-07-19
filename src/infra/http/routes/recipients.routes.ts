import express from 'express'

import { adaptMiddleware } from '../adapters/ExpressMiddlewareAdapter'
import { adaptRoute } from '../adapters/ExpressRouteAdapter'
import { makeCountRecipientsFromTagsController } from '../factories/controllers/CountRecipientsFromTagsControllerFactory'
import { makeEnsureAuthenticatedMiddleware } from '../factories/middlewares/EnsureAuthenticatedMiddlewareFactory'

const recipientsRouter = express.Router()

recipientsRouter.use(adaptMiddleware(makeEnsureAuthenticatedMiddleware()))

recipientsRouter.get(
  '/count',
  adaptRoute(makeCountRecipientsFromTagsController())
)

export { recipientsRouter }
