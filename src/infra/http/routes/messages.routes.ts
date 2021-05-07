import express from 'express'

import { adaptMiddleware } from '../adapters/ExpressMiddlewareAdapter'
import { adaptRoute } from '../adapters/ExpressRouteAdapter'
import { makeCreateMessageController } from '../factories/controllers/CreateMessageControllerFactory'
import { makeSendMessageController } from '../factories/controllers/SendMessageControllerFactory'
import { makeEnsureAuthenticatedMiddleware } from '../factories/middlewares/EnsureAuthenticatedMiddlewareFactory'

const messagesRouter = express.Router()

messagesRouter.use(adaptMiddleware(makeEnsureAuthenticatedMiddleware()))

messagesRouter.post('/', adaptRoute(makeCreateMessageController()))
messagesRouter.post('/:id/send', adaptRoute(makeSendMessageController()))

export { messagesRouter }
