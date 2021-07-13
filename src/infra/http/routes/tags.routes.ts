import express from 'express'

import { adaptMiddleware } from '../adapters/ExpressMiddlewareAdapter'
import { adaptRoute } from '../adapters/ExpressRouteAdapter'
import { makeCreateTagController } from '../factories/controllers/CreateTagControllerFactory'
import { makeSearchTagsController } from '../factories/controllers/SearchTagsControllerFactory'
import { makeSubscribeContactToTagController } from '../factories/controllers/SubscribeContactToTagControllerFactory'
import { makeUnsubscribeContactFromTagController } from '../factories/controllers/UnsubscribeContactFromTagControllerFactory'
import { makeEnsureAuthenticatedMiddleware } from '../factories/middlewares/EnsureAuthenticatedMiddlewareFactory'

const tagsRouter = express.Router()

tagsRouter.use(adaptMiddleware(makeEnsureAuthenticatedMiddleware()))

tagsRouter.post('/', adaptRoute(makeCreateTagController()))
tagsRouter.get('/search', adaptRoute(makeSearchTagsController()))

tagsRouter.post(
  '/:tagId/subscribers',
  adaptRoute(makeSubscribeContactToTagController())
)

tagsRouter.delete(
  '/:tagId/subscribers/:contactId',
  adaptRoute(makeUnsubscribeContactFromTagController())
)

export { tagsRouter }
