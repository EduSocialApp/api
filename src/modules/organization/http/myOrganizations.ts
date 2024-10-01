import { NextFunction, Request, Response } from 'express'

import organizationMemberService from '../member/organizationmember.service'

/**
 * Retorna lista de organizações do usuário autenticado
 */
export default async function myOrganizations(request: Request, response: Response, next: NextFunction) {
    try {
        const list = await organizationMemberService.listByUserId(request.user.id)

        response.status(200).json(list)
    } catch (e) {
        next(e)
    }
}
