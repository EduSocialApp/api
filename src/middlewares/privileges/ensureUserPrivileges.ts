import { AppError } from '@/functions/AppError'
import { NextFunction, Request, Response } from 'express'

/**
 * Middleware para garantir que o usuário autenticado tem privilégios necessários para acessar a rota
 */
export function ensureUserPrivileges(requiredScopes: string[] = [], requiredRole: 'ADMIN' | 'MODERATOR' | 'USER' | 'MODERATOR_OR_LOGGED' = 'USER') {
    return (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params as { id?: string }

            const userAdmin = request.user.role === 'ADMIN'
            const userModerator = request.user.role === 'MODERATOR'

            // Se usuário é admin, passa direto
            if (userAdmin) {
                return next()
            }

            if (requiredRole === 'ADMIN') {
                throw new AppError('Permission denied', 403)
            }

            // Se necessita ser um moderador
            if (requiredRole === 'MODERATOR' && !userModerator) {
                throw new AppError('Permission denied', 403)
            }

            if (id) {
                // Se necessita ser um moderador ou o próprio usuário
                if (requiredRole === 'MODERATOR_OR_LOGGED' && request.user.id !== id && !userModerator) {
                    throw new AppError('Permission denied', 403)
                }
            }

            // Verifica se o usuário tem escopos necessários
            const hasScopes = requiredScopes.every((scope) => request.user.scopes.includes(scope))

            if (!hasScopes) {
                throw new AppError('Permission denied', 403)
            }

            next()
        } catch (e) {
            next(e)
        }
    }
}
