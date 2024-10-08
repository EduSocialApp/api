import { AppError } from '@/functions/AppError'
import { NextFunction, Request, Response } from 'express'
import { verifyAcessToken } from '@/functions/jwt'

import dbUser from '@/modules/user/user.service'
import dbSession from '@/modules/session/session.service'

interface Payload {
    sub: string
    jti: string
}

/**
 * Middleware para garantir que o usuário está autenticado e adiciona dados do usuário na requisição
 */
export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    try {
        const authHeader = request.headers.authorization

        if (!authHeader) {
            throw new AppError('Token missing', 401)
        }

        // Bearer token
        const [, token] = authHeader.split(' ')

        // Verificar se o token é valido e recupera informacoes do payload
        const { sub: userId, jti } = verifyAcessToken(token) as Payload

        // Verificar se existe uma sessao ativa para este token
        const session = await dbSession.findByAccessTokenHash(jti)
        if (!session) throw new AppError('Invalid token', 401)

        const user = await dbUser.findById(userId)

        if (!user) {
            throw new AppError('User not found', 401)
        }

        request.user = {
            id: userId,
            scopes: user.scopes,
            role: user.role,
            sessionId: session.id,
            notificationToken: user.receiveNotifications ? session.notificationToken : null,
        }

        next()
    } catch (e) {
        next(e)
    }
}
