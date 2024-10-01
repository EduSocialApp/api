import { AppError } from '@/functions/AppError'
import { NextFunction, Request, Response } from 'express'

import organization from '../modules/organization/organization.service'
import organizationMember from '../modules/organization/member/organizationmember.service'

/**
 * Middleware para garantir que o usuário autenticado tem privilégios sob a organização para acessar a rota
 */
export function ensureOrgPrivileges(requiredRole: 'OWNER' | 'MODERATOR' | 'USER' = 'USER') {
    return async (request: Request, response: Response, next: NextFunction) => {
        try {
            let { id } = request.params

            // Busca organizacao
            const org = await organization.findById(id)

            if (!org) {
                throw new AppError('Organization not found', 404)
            }

            const userLoggedOrgLink = await organizationMember.findByUserIdAndOrganizationId(request.user.id, org.id)

            // Se o usuário não está vinculado a organização, não tem permissão
            if (!userLoggedOrgLink) {
                throw new AppError('Permission denied', 403)
            }

            // Se usuário é dono da organização, passa direto
            if (userLoggedOrgLink.role === 'OWNER') {
                return next()
            }

            if (requiredRole === 'OWNER') {
                throw new AppError('Permission denied', 403)
            }

            // Se necessita ser um moderador
            if (requiredRole === 'MODERATOR' && userLoggedOrgLink.role !== 'MODERATOR') {
                throw new AppError('Permission denied', 403)
            }

            next()
        } catch (e) {
            next(e)
        }
    }
}
