import { AppError } from '@/functions/AppError'
import { NextFunction, Request, Response } from 'express'
import { verifyAcessToken } from '@/functions/jwt'
import dbUser from '@/modules/user/user.service'

interface Payload {
    sub: string
}

/**
 * Middleware para garantir que o usuário está autenticado e adiciona dados do usuário na requisição
 */
export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    try {
        const authHeader = request.headers.authorization

        if (!authHeader) {
            throw new AppError('Token missing!', 401)
        }

        // Bearer token
        const [, token] = authHeader.split(' ')

        const { sub: userId } = verifyAcessToken(token) as Payload

        const user = await dbUser.findById(userId)

        if (!user) {
            throw new AppError('User not found!', 401)
        }

        request.user = {
            id: userId,
            scopes: user.scopes,
            role: user.role,
        }

        next()
    } catch (e) {
        next(e)
    }
}
