import { AppError } from '@/functions/AppError'
import { userScopes } from '@/modules/user/user.scopes'
import { NextFunction, Request, Response } from 'express'

import organization from '../organization.service'

/**
 * Aprova uma organizacao
 * - Somente ADMINISTRADORES, MODERADOS e usuarios com a permissao `userScopes.organization.approve` podem aprovar uma organizacao
 */
export default async function approveOrganization(request: Request, response: Response, next: NextFunction) {
    try {
        let { id } = request.params

        // Verifica se o usuário tem permissão para aprovar uma organização
        if (request.user.role !== 'ADMIN' && request.user.role !== 'MODERATOR' && !request.user.scopes.includes(userScopes.organization.approve)) {
            throw new AppError('Permission denied', 403)
        }

        const org = await organization.findById(id)

        if (!org) {
            throw new AppError('Organization not found', 404)
        }

        await organization.setVerified(id, true)

        response.status(200).json({
            message: 'Organization approved',
        })
    } catch (e) {
        next(e)
    }
}
