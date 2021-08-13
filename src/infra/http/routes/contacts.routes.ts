import express from 'express'

import { adaptMiddleware } from '@core/infra/adapters/ExpressMiddlewareAdapter'
import { adaptRoute } from '@core/infra/adapters/ExpressRouteAdapter'

import { makeBlockContactController } from '../factories/controllers/BlockContactControllerFactory'
import { makeCreateContactController } from '../factories/controllers/CreateContactControllerFactory'
import { makeGetContactDetailsController } from '../factories/controllers/GetContactDetailsControllerFactory'
import { makeSearchContactsController } from '../factories/controllers/SearchContactsControllerFactory'
import { makeUnsubscribeContactController } from '../factories/controllers/UnsubscribeContactControllerFactory'
import { makeEnsureAuthenticatedMiddleware } from '../factories/middlewares/EnsureAuthenticatedMiddlewareFactory'

const contactsRouter = express.Router()

contactsRouter.use(adaptMiddleware(makeEnsureAuthenticatedMiddleware()))

contactsRouter.post('/', adaptRoute(makeCreateContactController()))
contactsRouter.get('/search', adaptRoute(makeSearchContactsController()))
contactsRouter.get('/:id', adaptRoute(makeGetContactDetailsController()))

contactsRouter.patch(
  '/:contactId/unsubscribe',
  adaptRoute(makeUnsubscribeContactController())
)

contactsRouter.patch(
  '/:contactId/block',
  adaptRoute(makeBlockContactController())
)

export { contactsRouter }
