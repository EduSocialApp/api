import { AppError } from '@/functions/AppError'
import { NextFunction, Request, Response } from 'express'

/**
 * Middleware para garantir que o usuário autenticado tem privilégios necessários para acessar a rota de visualizacao de perfil
 */
export function ensureCanViewUserProfile(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params as { id: string }

        const userIsSupervised = request.user.supervisedUsers.includes(id)
        const userIsSupervisor = request.user.supervisorUsers.includes(id)

        // Se o usuario e admin, moderador, o proprio usuario, ou e supervisionado/supervisor, passa direto
        if (request.user.role === 'ADMIN' || request.user.role === 'MODERATOR' || request.user.id === id || userIsSupervised || userIsSupervisor) {
            next()
            return
        }

        throw new AppError('Permission denied', 403)
    } catch (e) {
        next(e)
    }
}
