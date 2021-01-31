import { Router } from 'express'

import { messagesRouter } from './messages.routes'
import { sessionsRouter } from './sessions.routes'
import { usersRouter } from './users.routes'

const router = Router()

router.use('/users', usersRouter)
router.use('/sessions', sessionsRouter)
router.use('/messages', messagesRouter)

export { router }
