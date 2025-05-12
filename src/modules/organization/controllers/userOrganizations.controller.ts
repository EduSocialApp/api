import { NextFunction, Request, Response } from 'express'

import organizationMemberService from '../services/member/organizationMember.service'

/**
 * Retorna lista de organizações do usuário
 */
export default async function userOrganizations(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params as { id: string }

        const list = await organizationMemberService.listByUserId(id)

        response.status(200).json(list)
    } catch (e) {
        next(e)
    }
}
