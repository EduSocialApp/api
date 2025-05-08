import { Router, Request, Response } from 'express'

import { userRoutes } from '../modules/user/user.routes'
import { orgRoutes } from '../modules/organization/organization.routes'
import { findRoutes } from './find.routes'
import { shareLinkRoutes } from '../modules/shareLink/sharelink.routes'
import { postRoutes } from '../modules/post/post.routes'
import { conversationRoutes } from 'src/modules/conversation/conversation.routes'
import { ensureAuthenticated } from 'src/middlewares/ensureAuthenticated'

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

export default router
