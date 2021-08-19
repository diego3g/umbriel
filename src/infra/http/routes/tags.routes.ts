import express from 'express'

import { adaptMiddleware } from '@core/infra/adapters/ExpressMiddlewareAdapter'
import { adaptRoute } from '@core/infra/adapters/ExpressRouteAdapter'

import { makeCreateTagController } from '../factories/controllers/CreateTagControllerFactory'
import { makeGetAllTagsController } from '../factories/controllers/GetAllTagsControllerFactory'
import { makeSearchTagsController } from '../factories/controllers/SearchTagsControllerFactory'
import { makeSubscribeContactToTagController } from '../factories/controllers/SubscribeContactToTagControllerFactory'
import { makeUnsubscribeContactFromTagController } from '../factories/controllers/UnsubscribeContactFromTagControllerFactory'
import { makeEnsureAuthenticatedMiddleware } from '../factories/middlewares/EnsureAuthenticatedMiddlewareFactory'

const tagsRouter = express.Router()

tagsRouter.use(adaptMiddleware(makeEnsureAuthenticatedMiddleware()))

tagsRouter.get('/', adaptRoute(makeGetAllTagsController()))
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
