import { Router, Request, Response } from 'express'

import { userRoutes } from '@/modules/user/user.routes'
import { orgRoutes } from '@/modules/organization/organization.routes'
import { findRoutes } from './find.routes'

const router = Router()

router.get('/', (request: Request, response: Response) => {
    response.json({
        status: 'API is running 🟢',
    })
})

router.use('/user', userRoutes)
router.use('/org', orgRoutes)
router.use('/find', findRoutes)

export default router
