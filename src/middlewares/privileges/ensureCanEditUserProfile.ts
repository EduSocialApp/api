import { AppError } from '../../functions/AppError'
import { NextFunction, Request, Response } from 'express'

/**
 * Middleware para garantir que o usuario autenticado pode editar o perfil do usuario especificado
 */
export function ensureCanEditUserProfile(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params as { id: string }

        const userIsSupervised = request.user.supervisedUsers.includes(id) // E um dos usuarios que supervisiono

        // Se o usuario e admin, moderador, o proprio usuario, ou supervisiono, passa direto
        if (request.user.role === 'ADMIN' || request.user.role === 'MODERATOR' || request.user.id === id || userIsSupervised) {
            next()
            return
        }

        throw new AppError('Permission denied', 403)
    } catch (e) {
        next(e)
    }
}
