import { NextFunction, Request, Response } from 'express'

import { organizationMember } from '../services/member/organizationMember.service'

/**
 * Retorna lista de organizações do usuário
 */
export async function userOrganizations(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params as { id: string }

        const list = await organizationMember.listByUserId(id)

        response.status(200).json(list)
    } catch (e) {
        next(e)
    }
}
