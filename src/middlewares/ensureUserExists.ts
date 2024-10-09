import { AppError } from '@/functions/AppError'
import { NextFunction, Request, Response } from 'express'

import dbUser from '../modules/user/user.service'

/**
 * Middleware para garantir que o usuário informado via parametro existe
 */
export async function ensureUserExists(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params

        const user = await dbUser.findById(id)

        if (!user) {
            throw new AppError('User not found', 404)
        }

        next()
    } catch (e) {
        next(e)
    }
}
