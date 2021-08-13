import { Router } from 'express'

import { contactsRouter } from './contacts.routes'
import { messagesRouter } from './messages.routes'
import { recipientsRouter } from './recipients.routes'
import { sendersRouter } from './senders.routes'
import { sessionsRouter } from './sessions.routes'
import { tagsRouter } from './tags.routes'
import { templatesRouter } from './templates.routes'
import { usersRouter } from './users.routes'

const router = Router()

router.use('/users', usersRouter)
router.use('/sessions', sessionsRouter)
router.use('/messages', messagesRouter)
router.use('/contacts', contactsRouter)
router.use('/senders', sendersRouter)
router.use('/tags', tagsRouter)
router.use('/templates', templatesRouter)
router.use('/recipients', recipientsRouter)

export { router }
