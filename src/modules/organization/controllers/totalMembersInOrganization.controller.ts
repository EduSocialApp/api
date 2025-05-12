import { NextFunction, Request, Response } from 'express'

import organizationMemberService from '../services/member/organizationMember.service'

/**
 * Retorna a quantidade de membros em uma organização
 */
export default async function totalMembersInOrganization(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params

        const list = await organizationMemberService.countByOrganizationId(id)

        response.status(200).json(list)
    } catch (e) {
        next(e)
    }
}
