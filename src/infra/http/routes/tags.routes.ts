import express from 'express'

import { adaptMiddleware } from '../adapters/ExpressMiddlewareAdapter'
import { adaptRoute } from '../adapters/ExpressRouteAdapter'
import { makeCreateTagController } from '../factories/controllers/CreateTagControllerFactory'
import { makeSearchTagsController } from '../factories/controllers/SearchTagsControllerFactory'
import { makeSubscribeContactToTagController } from '../factories/controllers/SubscribeContactToTagControllerFactory'
import { makeEnsureAuthenticatedMiddleware } from '../factories/middlewares/EnsureAuthenticatedMiddlewareFactory'

const tagsRouter = express.Router()

tagsRouter.use(adaptMiddleware(makeEnsureAuthenticatedMiddleware()))

tagsRouter.post('/', adaptRoute(makeCreateTagController()))
tagsRouter.get('/search', adaptRoute(makeSearchTagsController()))

tagsRouter.post(
  '/:tagId/subscribers',
  adaptRoute(makeSubscribeContactToTagController())
)

export { tagsRouter }
