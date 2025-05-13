import { NextFunction, Request, Response } from 'express'

import { organizationMember } from '../services/member/organizationMember.service'

/**
 * Retorna a quantidade de membros em uma organização
 */
export async function totalMembersInOrganization(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params

        const list = await organizationMember.countByOrganizationId(id)

        response.status(200).json(list)
    } catch (e) {
        next(e)
    }
}
