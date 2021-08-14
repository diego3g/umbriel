import express from 'express'

import { adaptMiddleware } from '@core/infra/adapters/ExpressMiddlewareAdapter'
import { adaptRoute } from '@core/infra/adapters/ExpressRouteAdapter'

import { makeCreateTemplateController } from '../factories/controllers/CreateTemplateControllerFactory'
import { makeGetAllTemplatesController } from '../factories/controllers/GetAllTemplatesControllerFactory'
import { makePreviewTemplateController } from '../factories/controllers/PreviewTemplateControllerFactory'
import { makeSearchTemplatesController } from '../factories/controllers/SearchTemplatesControllerFactory'
import { makeSetDefaultTemplateController } from '../factories/controllers/SetDefaultTemplateControllerFactory'
import { makeEnsureAuthenticatedMiddleware } from '../factories/middlewares/EnsureAuthenticatedMiddlewareFactory'

const templatesRouter = express.Router()

templatesRouter.use(adaptMiddleware(makeEnsureAuthenticatedMiddleware()))

templatesRouter.get('/', adaptRoute(makeGetAllTemplatesController()))
templatesRouter.post('/', adaptRoute(makeCreateTemplateController()))
templatesRouter.get('/search', adaptRoute(makeSearchTemplatesController()))
templatesRouter.post('/preview', adaptRoute(makePreviewTemplateController()))
templatesRouter.patch(
  '/:templateId/set-as-default',
  adaptRoute(makeSetDefaultTemplateController())
)

export { templatesRouter }
