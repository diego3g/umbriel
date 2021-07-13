import express from 'express'

import { adaptMiddleware } from '../adapters/ExpressMiddlewareAdapter'
import { adaptRoute } from '../adapters/ExpressRouteAdapter'
import { makeCreateTemplateController } from '../factories/controllers/CreateTemplateControllerFactory'
import { makeSearchTemplatesController } from '../factories/controllers/SearchTemplatesControllerFactory'
import { makeEnsureAuthenticatedMiddleware } from '../factories/middlewares/EnsureAuthenticatedMiddlewareFactory'

const templatesRouter = express.Router()

templatesRouter.use(adaptMiddleware(makeEnsureAuthenticatedMiddleware()))

templatesRouter.post('/', adaptRoute(makeCreateTemplateController()))
templatesRouter.get('/search', adaptRoute(makeSearchTemplatesController()))

export { templatesRouter }
