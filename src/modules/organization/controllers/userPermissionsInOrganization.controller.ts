import { NextFunction, Request, Response } from 'express'

import organizationMemberService from '../services/member/organizationMember.service'

/**
 * Retorna permissões do usuário logado na organização
 */
export default async function userPermissionsInOrganization(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params

        const member = await organizationMemberService.findByUserIdAndOrganizationId(request.user.id, id)

        if (!member) {
            return response.status(403).json({ message: 'Permission denied' })
        }

        response.status(200).json({ role: member.role })
    } catch (e) {
        next(e)
    }
}
