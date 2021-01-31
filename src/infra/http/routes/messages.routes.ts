import express from 'express'

import { adaptRoute } from '../adapters/ExpressRouteAdapter'
import { makeCreateMessageController } from '../factories/controllers/CreateMessageControllerFactory'
import { makeSendMessageController } from '../factories/controllers/SendMessageControllerFactory'

const messagesRouter = express.Router()

messagesRouter.post('/', adaptRoute(makeCreateMessageController()))
messagesRouter.post('/:id/send', adaptRoute(makeSendMessageController()))

export { messagesRouter }
