import { Router, Request, Response } from 'express'

import { userRoutes, ensureAuthenticated } from '../modules/user'
import { orgRoutes } from '../modules/organization'
import { findRoutes } from './find.routes'
import { shareLinkRoutes } from '../modules/shareLink'
import { postRoutes } from '../modules/post'
import { conversationRoutes } from '../modules/conversation'
import { messageRoutes } from '../modules/message'

console.log('aqui')

const router = Router()

router.get('/', (request: Request, response: Response) => {
    response.json({
        status: 'API is running 🟢',
    })
})

router.use('/user', userRoutes)
router.use('/org', orgRoutes)
router.use('/find', findRoutes)
router.use('/link', shareLinkRoutes)
router.use('/post', postRoutes)
router.use('/conversation', ensureAuthenticated, conversationRoutes)
router.use('/message', ensureAuthenticated, messageRoutes)

export default router
