import express from 'express'

import { adaptRoute } from '../adapters/ExpressRouteAdapter'
import { makeCreateMessageController } from '../factories/controllers/CreateMessageControllerFactory'

const messagesRouter = express.Router()

messagesRouter.post('/', adaptRoute(makeCreateMessageController()))

export { messagesRouter }
