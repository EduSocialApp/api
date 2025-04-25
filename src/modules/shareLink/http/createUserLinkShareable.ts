import { NextFunction, Request, Response } from 'express'

import user from '../sharelink.service'
import { AppError } from '../../../functions/AppError'

/**
 * Cria link de compartilhamento de usuario
 */
export default async function createUserLinkShareable(request: Request, response: Response, next: NextFunction) {
    try {
        const { userId } = request.body as { userId: string }

        if (userId && request.user.role !== 'ADMIN' && request.user.id !== 'MODERATOR') {
            throw new AppError('Unauthorized', 401)
        }

        const { id, maxUses, expiresAt } = await user.createShareUserLink(userId || request.user.id)

        return response.json({ id, maxUses, expiresAt })
    } catch (e) {
        next(e)
    }
}
