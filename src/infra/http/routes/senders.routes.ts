import express from 'express'

import { adaptMiddleware } from '../adapters/ExpressMiddlewareAdapter'
import { adaptRoute } from '../adapters/ExpressRouteAdapter'
import { makeCreateSenderController } from '../factories/controllers/CreateSenderControllerFactory'
import { makeRemoveSenderController } from '../factories/controllers/RemoveSenderControllerFactory'
import { makeSetDefaultSenderController } from '../factories/controllers/SetDefaultSenderControllerFactory'
import { makeEnsureAuthenticatedMiddleware } from '../factories/middlewares/EnsureAuthenticatedMiddlewareFactory'

const sendersRouter = express.Router()

sendersRouter.use(adaptMiddleware(makeEnsureAuthenticatedMiddleware()))

sendersRouter.post('/', adaptRoute(makeCreateSenderController()))
sendersRouter.delete('/:id', adaptRoute(makeRemoveSenderController()))
sendersRouter.patch(
  '/:senderId/set-as-default',
  adaptRoute(makeSetDefaultSenderController())
)

export { sendersRouter }
