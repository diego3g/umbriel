import express from 'express'

import { adaptMiddleware } from '../adapters/ExpressMiddlewareAdapter'
import { adaptRoute } from '../adapters/ExpressRouteAdapter'
import { makeCreateSenderController } from '../factories/controllers/CreateSenderControllerFactory'
import { makeRemoveSenderController } from '../factories/controllers/RemoveSenderControllerFactory'
import { makeEnsureAuthenticatedMiddleware } from '../factories/middlewares/EnsureAuthenticatedMiddlewareFactory'

const sendersRouter = express.Router()

sendersRouter.use(adaptMiddleware(makeEnsureAuthenticatedMiddleware()))

sendersRouter.post('/', adaptRoute(makeCreateSenderController()))
sendersRouter.delete('/:id', adaptRoute(makeRemoveSenderController()))

export { sendersRouter }
