import { Router, Request, Response } from 'express'

import { userRoutes } from '@/modules/user/user.routes'

const router = Router()

router.get('/', (request: Request, response: Response) => {
    response.json({
        status: 'API is running 🟢'
    })
})

router.use('/user', userRoutes)

export default router