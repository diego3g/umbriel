import express from 'express'

import { adaptMiddleware } from '@core/infra/adapters/ExpressMiddlewareAdapter'
import { adaptRoute } from '@core/infra/adapters/ExpressRouteAdapter'

import { makeCreateSenderController } from '../factories/controllers/CreateSenderControllerFactory'
import { makeGetAllSendersController } from '../factories/controllers/GetAllSendersControllerFactory'
import { makeRemoveSenderController } from '../factories/controllers/RemoveSenderControllerFactory'
import { makeSearchSendersController } from '../factories/controllers/SearchSendersControllerFactory'
import { makeSetDefaultSenderController } from '../factories/controllers/SetDefaultSenderControllerFactory'
import { makeEnsureAuthenticatedMiddleware } from '../factories/middlewares/EnsureAuthenticatedMiddlewareFactory'

const sendersRouter = express.Router()

sendersRouter.use(adaptMiddleware(makeEnsureAuthenticatedMiddleware()))

sendersRouter.get('/', adaptRoute(makeGetAllSendersController()))
sendersRouter.get('/search', adaptRoute(makeSearchSendersController()))
sendersRouter.post('/', adaptRoute(makeCreateSenderController()))
sendersRouter.delete('/:id', adaptRoute(makeRemoveSenderController()))
sendersRouter.patch(
  '/:senderId/set-as-default',
  adaptRoute(makeSetDefaultSenderController())
)

export { sendersRouter }
