import { NextFunction, Request, Response } from 'express'
import { validateAccessToken } from '../auth/validateAccessToken.auth'

/**
 * Middleware para garantir que o usuário está autenticado e adiciona dados do usuário na requisição
 */
export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    try {
        request.user = await validateAccessToken(request.headers.authorization)

        next()
    } catch (e) {
        next(e)
    }
}
